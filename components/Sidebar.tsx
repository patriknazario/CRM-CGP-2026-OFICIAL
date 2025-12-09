import React, { useState } from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, BookOpen, GraduationCap, Target, Map, PieChart, ChevronLeft, ChevronRight, BellRing } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard, section: 'Principal' },
    { id: 'crm', label: 'CRM & Pipeline', icon: Users, section: 'Vendas' },
    { id: 'leads', label: 'Gestão de Leads', icon: BookOpen, section: 'Vendas' },
    { id: 'analytics-team', label: 'Performance Time', icon: Users, section: 'Análises' },
    { id: 'analytics-kpi', label: 'KPIs & Cursos', icon: PieChart, section: 'Análises' },
    { id: 'analytics-map', label: 'Mapa de Cursos', icon: Map, section: 'Análises' },
    { id: 'analytics-reports', label: 'Relatórios', icon: BarChart3, section: 'Análises' },
    { id: 'mgmt-courses', label: 'Gerenciar Cursos', icon: GraduationCap, section: 'Gestão' },
    { id: 'mgmt-professors', label: 'Professores', icon: Users, section: 'Gestão' },
    { id: 'mgmt-goals', label: 'Metas & Bônus', icon: Target, section: 'Gestão' },
    { id: 'mgmt-notifications', label: 'Avisos Gerais', icon: BellRing, section: 'Gestão' },
  ];

  const sections = Array.from(new Set(menuItems.map(item => item.section)));

  return (
    <div 
      className={`${isCollapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-950 text-white flex flex-col h-full shadow-2xl z-40 font-sans border-r border-white/10 transition-all duration-300 relative`}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-pink-600 text-white p-1 rounded-full shadow-lg shadow-pink-900/50 hover:bg-pink-500 transition-transform hover:scale-110 z-30 border-2 border-indigo-950"
        title={isCollapsed ? "Expandir Menu" : "Retrair Menu"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Header */}
      <div className={`flex flex-col items-center justify-center border-b border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 ${isCollapsed ? 'p-4 py-6' : 'p-8'}`}>
        <div className={`${isCollapsed ? 'w-10 h-10 text-sm' : 'w-12 h-12 text-xl'} bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-pink-500/20 transition-all duration-300`}>
          <span className="font-bold text-white">CGP</span>
        </div>
        <h1 className={`text-lg font-bold tracking-wide text-white mt-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden mt-0' : 'opacity-100'}`}>
          CGP<span className="font-light opacity-70">Systems</span>
        </h1>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar overflow-x-hidden">
        {sections.map(section => (
          <div key={section} className="mb-6">
            {/* Section Title */}
            {!isCollapsed ? (
              <h3 className="px-6 text-xs font-bold text-pink-400 uppercase tracking-widest mb-3 flex items-center animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-pink-500 mr-2"></span>
                {section}
              </h3>
            ) : (
              <div className="h-px w-8 mx-auto bg-white/10 mb-3"></div>
            )}
            
            <ul className={`space-y-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
              {menuItems.filter(item => item.section === section).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      title={isCollapsed ? item.label : ''}
                      className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative
                        ${isActive 
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-900/30' 
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                    >
                      <Icon className={`w-5 h-5 transition-all ${!isCollapsed ? 'mr-3' : ''} ${isActive ? 'text-white scale-110' : 'text-slate-400 group-hover:text-white'}`} />
                      
                      <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                        {item.label}
                      </span>

                      {/* Active Indicator for Collapsed Mode */}
                      {isCollapsed && isActive && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Profile Footer */}
      <div className={`p-4 bg-black/20 backdrop-blur-md transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="relative shrink-0">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-10 h-10 rounded-full border-2 border-pink-500 bg-slate-800" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            <p className="text-sm font-bold text-white truncate">Diretoria</p>
            <p className="text-xs text-slate-400 truncate">Acesso Master</p>
          </div>
          
          {!isCollapsed && (
            <Settings className="w-4 h-4 text-slate-400 ml-auto hover:text-pink-400 transition-colors shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;