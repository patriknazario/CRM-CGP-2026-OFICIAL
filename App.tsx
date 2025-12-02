import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { CRMView, LeadsView } from './components/SalesModules';
import { TeamPerformanceView, KPIView, MapView, ReportsView } from './components/AnalyticsModules';
import { CoursesMgmtView, ProfessorsMgmtView, GoalsMgmtView, NotificationsMgmtView } from './components/ManagementModules';
import AiAssistant from './components/AiAssistant';
import { Bell, X, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { DataProvider, useData } from './contexts/DataContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [crmInitialFilter, setCrmInitialFilter] = useState('Todas');

  // Consuming Global Data from Context
  const {
    notifications,
    metaGlobal,
    activities,
    markNotificationRead,
    addNotification,
    updateMetaGlobal,
    loading
  } = useData();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Format Date: "Setembro 2026" -> "Dezembro 2025"
  const monthYear = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

  // Format Time: "14:30"
  const timeString = currentDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Navegação cruzada
  const handleNavigateToCRM = (courseName: string) => {
    setCrmInitialFilter(courseName);
    setActiveTab('crm');
  };

  const unreadCount = notifications.filter(n => !n.lida).length;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full min-h-[500px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigateToCRM={handleNavigateToCRM} metaGlobal={metaGlobal} activities={activities} />;
      // Note: Passing logActivity or other actions might require small updates to child components to use the hook directly instead of props, 
      // but for compatibility we can keep passing props if the child expects them, or refactor children later.
      // For now, let's keep the props if required or update them to use context.
      // Since child components are not refactored in this step to useData(), we assume they still use Mock imports internally 
      // OR we pass data as props. To fully switch, we should pass context data as props.

      case 'crm': return <CRMView initialFilter={crmInitialFilter} />;
      case 'leads': return <LeadsView />;
      case 'analytics-team': return <TeamPerformanceView />;
      case 'analytics-kpi': return <KPIView />;
      case 'analytics-map': return <MapView />;
      case 'analytics-reports': return <ReportsView />;
      case 'mgmt-courses': return <CoursesMgmtView />;
      case 'mgmt-professors': return <ProfessorsMgmtView />;
      case 'mgmt-goals': return <GoalsMgmtView metaGlobal={metaGlobal} onUpdateMeta={updateMetaGlobal} />;
      case 'mgmt-notifications': return <NotificationsMgmtView notifications={notifications} onAdd={addNotification} onDelete={() => { }} />;
      default: return <Dashboard onNavigateToCRM={handleNavigateToCRM} metaGlobal={metaGlobal} activities={activities} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto relative">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {activeTab.replace('-', ' ').replace('mgmt', 'Gestão')}
            </h2>
            <p className="text-xs text-slate-500">Painel Administrativo CGP</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-700 capitalize">{capitalizedMonthYear}</p>
              <p className="text-xs text-slate-500">Última atualização: Hoje, {timeString}</p>
            </div>

            {/* Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600 relative"
              >
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
                <Bell className="w-5 h-5" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in z-50">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 text-sm">Notificações</h3>
                    {unreadCount > 0 && (
                      <span className="bg-pink-100 text-pink-600 text-xs px-2 py-0.5 rounded-full font-bold">{unreadCount} novas</span>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm">
                        Nenhuma notificação no momento.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${!notif.lida ? 'bg-blue-50/30' : ''}`}
                        >
                          {!notif.lida && (
                            <span className="absolute left-2 top-4 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          )}
                          <div className="flex items-start gap-3 pl-2">
                            <div className={`mt-0.5 ${notif.tipo === 'urgent' ? 'text-red-500' :
                                notif.tipo === 'warning' ? 'text-amber-500' : 'text-blue-500'
                              }`}>
                              {notif.tipo === 'urgent' ? <AlertCircle className="w-4 h-4" /> :
                                notif.tipo === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                                  <Info className="w-4 h-4" />}
                            </div>
                            <div>
                              <h4 className={`text-sm font-bold ${notif.lida ? 'text-slate-600' : 'text-slate-900'}`}>{notif.titulo}</h4>
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.mensagem}</p>
                              <p className="text-[10px] text-slate-400 mt-2 text-right">{new Date(notif.data).toLocaleDateString()} às {new Date(notif.data).getHours()}:{new Date(notif.data).getMinutes().toString().padStart(2, '0')}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        <div className="p-6 lg:p-10 w-full max-w-[1920px] mx-auto pb-24">
          {renderContent()}
        </div>

        <AiAssistant />
      </main>
    </div>
  );
};

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;