
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CURSOS_MOCK, LEADS_MOCK, PROFESSORES_MOCK } from '../constants';
import { Curso, Lead, LeadStatus, MetaGlobal, StatusCurso, ActivityLog } from '../types';
import { 
  DollarSign, Users, Calendar, TrendingUp, ArrowRight, 
  X, Phone, Mail, FileText, CheckCircle, Clock, 
  AlertOctagon, Ban, Target, MapPin, AlertTriangle, Check, Activity, AlertCircle
} from 'lucide-react';
import { shouldShowViabilityAlert, getDaysUntil } from '../utils/calculations';

// --- COMPONENTE MODAL DE DETALHES ---
interface CourseDetailModalProps {
  course: Curso | null;
  onClose: () => void;
  onNavigateToCRM: (courseName: string) => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, onClose, onNavigateToCRM }) => {
  if (!course) return null;

  // Filtra leads interessados neste curso (Simulação de CRM)
  // Lógica: Se o campo 'interesse' do lead contiver partes do tema do curso
  const courseLeads = LEADS_MOCK.filter(lead => 
    course.tema.toLowerCase().includes(lead.interesse.toLowerCase()) ||
    lead.interesse.toLowerCase().includes(course.tema.toLowerCase())
  );

  const funnelStats = {
    [LeadStatus.PropostaEnviada]: courseLeads.filter(l => l.status === LeadStatus.PropostaEnviada).length,
    [LeadStatus.EmAnalise]: courseLeads.filter(l => l.status === LeadStatus.EmAnalise).length,
    [LeadStatus.Inscrito]: courseLeads.filter(l => l.status === LeadStatus.Inscrito).length,
    [LeadStatus.Declinado]: courseLeads.filter(l => l.status === LeadStatus.Declinado).length,
  };

  const percentGoal = Math.round((course.faturamentoAtual / course.metaFaturamento) * 100);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up border border-white/20">
        
        {/* Header Visual */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 p-8 text-white overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-sm z-20">
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                  course.status === 'Concluído' ? 'bg-green-500/20 border-green-400/30 text-green-300' :
                  course.status === 'Em Andamento' ? 'bg-blue-500/20 border-blue-400/30 text-blue-300' :
                  'bg-pink-500/20 border-pink-400/30 text-pink-300'
                }`}>
                  {course.status}
                </span>
                <span className="flex items-center text-xs text-indigo-200">
                  <MapPin className="w-3 h-3 mr-1" /> {course.cidade}/{course.estado}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1 leading-tight">{course.tema}</h2>
              <p className="text-indigo-200 text-sm">Data: {new Date(course.dataInicio).toLocaleDateString()} a {new Date(course.dataFim).toLocaleDateString()}</p>
            </div>
            
            <div className="text-left md:text-right bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
              <p className="text-xs text-indigo-200 uppercase tracking-widest font-bold mb-1">Faturamento Atual</p>
              <div className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                R$ {course.faturamentoAtual.toLocaleString()}
                <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${percentGoal >= 100 ? 'bg-green-50 text-slate-900' : 'bg-amber-50 text-slate-900'}`}>
                  {percentGoal}% da meta
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-6 custom-scrollbar">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: CRM Summary */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Funnel Cards */}
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-pink-500" /> Funil de Vendas do Curso
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-sm text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{funnelStats[LeadStatus.PropostaEnviada]}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Proposta</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-1">{funnelStats[LeadStatus.EmAnalise]}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Análise</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-green-100 shadow-sm text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">{funnelStats[LeadStatus.Inscrito]}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Inscritos</div>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-red-100 shadow-sm text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">{funnelStats[LeadStatus.Declinado]}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Declinados</div>
                  </div>
                </div>
              </div>

              {/* Leads List */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700 text-sm">Leads Interessados & Inscritos</h3>
                  <button 
                    onClick={() => {
                        onNavigateToCRM(course.tema);
                        onClose();
                    }}
                    className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline"
                  >
                    Ver CRM Completo
                  </button>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {courseLeads.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhum lead encontrado especificamente para este curso.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3">Nome / Empresa</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Potencial</th>
                          <th className="px-4 py-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {courseLeads.map(lead => (
                          <tr key={lead.id} className="hover:bg-pink-50/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-bold text-slate-800">{lead.nome}</div>
                              <div className="text-slate-500 text-[10px] truncate max-w-[150px]">{lead.empresa}</div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                lead.status === LeadStatus.Inscrito ? 'bg-green-50 text-green-600 border-green-100' :
                                lead.status === LeadStatus.PropostaEnviada ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                lead.status === LeadStatus.Declinado ? 'bg-red-50 text-red-600 border-red-100' :
                                'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                {lead.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-700">R$ {lead.valorPotencial.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right flex justify-end gap-1">
                              <button className="p-1.5 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded" title="WhatsApp">
                                <Phone className="w-3 h-3" />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded" title="Email">
                                <Mail className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Course Info */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Detalhes do Curso</h4>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <Target className="w-4 h-4 text-pink-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-slate-500 text-xs">Meta de Faturamento</p>
                      <p className="font-bold text-slate-800">R$ {course.metaFaturamento.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="w-4 h-4 text-indigo-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-slate-500 text-xs">Total Inscritos</p>
                      <p className="font-bold text-slate-800">{course.inscritos} Alunos</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <DollarSign className="w-4 h-4 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-slate-500 text-xs">Valor Inscrição</p>
                      <p className="font-bold text-slate-800">R$ {course.valorInscricao.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-4 h-4 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-slate-500 text-xs">Carga Horária</p>
                      <p className="font-bold text-slate-800">{course.cargaHoraria} horas</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 mb-2">Observações</p>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">
                    {course.observacoes || "Nenhuma observação registrada."}
                  </p>
                </div>
              </div>

              <button className="w-full py-2.5 bg-slate-800 text-white rounded-lg font-bold text-sm hover:bg-slate-900 transition-colors shadow-lg">
                Editar Informações
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

interface DashboardProps {
    onNavigateToCRM: (courseName: string) => void;
    metaGlobal: MetaGlobal;
    activities: ActivityLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToCRM, metaGlobal, activities }) => {
  const [selectedCourse, setSelectedCourse] = useState<Curso | null>(null);

  const totalFaturamento = CURSOS_MOCK.reduce((acc, curr) => acc + curr.faturamentoAtual, 0);
  const totalInscritos = CURSOS_MOCK.reduce((acc, curr) => acc + curr.inscritos, 0);
  const totalCursos = CURSOS_MOCK.length;
  const activeCourses = CURSOS_MOCK.filter(c => c.status !== 'Concluído' && c.status !== 'Cancelado').length;
  
  // Usando a Meta Global Dinâmica vinda das Props
  const metaAnual = metaGlobal.metaGlobalValor;
  const percentAnual = (totalFaturamento / metaAnual) * 100;
  
  const stats = [
    { label: 'Faturamento Total', value: `R$ ${totalFaturamento.toLocaleString('pt-BR')}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500' },
    { label: 'Total Inscritos', value: totalInscritos, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500' },
    { label: 'Cursos Ativos', value: activeCourses, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500' },
    { label: 'Meta Atingida', value: '87%', icon: TrendingUp, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500' },
  ];

  // Sorting and Grouping Courses by Month
  const sortedCourses = [...CURSOS_MOCK].sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());
  
  const groupedCourses = sortedCourses.reduce((groups, course) => {
    const date = new Date(course.dataInicio);
    const monthYear = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const formattedKey = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
    
    if (!groups[formattedKey]) {
        groups[formattedKey] = [];
    }
    groups[formattedKey].push(course);
    return groups;
  }, {} as Record<string, Curso[]>);

  return (
    <div className="space-y-8 animate-fade-in p-2">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900 shadow-xl p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Olá, Diretoria Comercial</h1>
          <p className="text-blue-200 max-w-xl text-lg">Bem-vindo ao painel CGP Dashboard 360. Você tem 3 cursos iniciando esta semana.</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-pink-500/20 to-transparent skew-x-12 transform origin-bottom-right"></div>
        <div className="absolute right-10 bottom-0 h-64 w-64 bg-purple-500/30 rounded-full blur-3xl"></div>
      </div>

      {/* Annual Goal Progress Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-colors"></div>
         <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-pink-100 text-pink-600 rounded-xl shadow-sm">
               <Target className="w-8 h-8" />
            </div>
            <div>
               <h3 className="text-lg font-bold text-slate-800">Meta de Faturamento Anual 2026</h3>
               <p className="text-slate-500 text-sm">Acompanhamento consolidado de todas as unidades</p>
            </div>
         </div>
         <div className="flex-1 w-full md:max-w-2xl relative z-10">
            <div className="flex justify-between text-sm font-bold mb-2">
               <span className="text-slate-700">R$ {totalFaturamento.toLocaleString('pt-BR')}</span>
               <span className="text-slate-400">Meta: R$ {metaAnual.toLocaleString('pt-BR')}</span>
            </div>
            <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden border border-slate-100">
               <div 
                  className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all duration-1000 ease-out relative"
                  style={{ width: `${Math.min(percentAnual, 100)}%` }}
               >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] opacity-30"></div>
               </div>
            </div>
            <div className="text-right mt-1.5 flex justify-end items-center gap-2">
               <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">{percentAnual.toFixed(1)}% Atingido</span>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>+12%</span>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Layout Vertical: Cursos em cima, Widgets em baixo */}
      <div className="flex flex-col gap-10">
        
        {/* Course Cards Groups */}
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-2">
             <h2 className="text-lg font-bold text-slate-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-pink-500" />
              Próximos Cursos (Cronograma)
            </h2>
          </div>
          
          {Object.entries(groupedCourses).map(([month, courses]) => (
            <div key={month} className="animate-fade-in">
                {/* Month Divider */}
                <div className="flex items-center gap-4 mb-5">
                    <div className="px-4 py-1.5 bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
                        {month}
                    </div>
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                </div>

                {/* Grid for this month */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map(curso => {
                        const alert = shouldShowViabilityAlert(curso.inscritos, curso.dataInicio) && curso.status === StatusCurso.Agendado;
                        const professorName = PROFESSORES_MOCK.find(p => p.id === curso.professorId)?.nome || 'Professor não definido';
                        const percentFinancial = Math.min((curso.faturamentoAtual / curso.metaFaturamento) * 100, 100);
                        const percentInscritos = Math.min((curso.inscritos / 30) * 100, 100); 
                        const days = getDaysUntil(curso.dataInicio);

                        return (
                            <div 
                            key={curso.id} 
                            onClick={() => setSelectedCourse(curso)}
                            className={`bg-white rounded-xl p-6 shadow-sm border transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group ${alert ? 'border-amber-400' : 'border-slate-200'}`}
                            >
                            {/* Hover Effect Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-500/0 group-hover:from-pink-500/5 group-hover:to-purple-500/5 transition-all"></div>

                            {/* Header */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                                curso.status === 'Concluído' ? 'bg-green-50 text-green-600 border-green-100' :
                                curso.status === 'Em Andamento' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                curso.status === 'Cancelado' ? 'bg-red-50 text-red-600 border-red-100' :
                                'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>
                                {curso.status}
                                </span>
                                <div className="flex items-center text-xs text-slate-500 font-medium">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(curso.dataInicio).toLocaleDateString('pt-BR')}
                                </div>
                            </div>

                            {/* Viability Alert */}
                            {alert && (
                                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center gap-3 relative z-10 animate-pulse">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                                <div className="text-xs text-amber-800 leading-tight">
                                    <span className="font-bold">Atenção:</span> Baixa adesão. Início em {days} dias.
                                </div>
                                </div>
                            )}

                            {/* Body */}
                            <div className="mb-5 relative z-10 min-h-[80px]">
                                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2">{curso.tema}</h3>
                                <div className="flex flex-col gap-1.5 mt-2">
                                <p className="text-xs text-slate-500 flex items-center">
                                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> {curso.cidade}/{curso.estado}
                                </p>
                                <p className="text-xs text-slate-500 flex items-center">
                                    <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" /> Prof. {professorName}
                                </p>
                                </div>
                            </div>

                            {/* Indicators */}
                            <div className="space-y-4 relative z-10">
                                {/* Financial Bar */}
                                <div>
                                <div className="flex justify-between text-[11px] mb-1.5">
                                    <span className="text-slate-500 font-medium">Financeiro</span>
                                    <span className="font-bold text-slate-700">{Math.round(percentFinancial)}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.3)]" style={{ width: `${percentFinancial}%` }}></div>
                                </div>
                                <div className="text-[10px] text-slate-400 text-right mt-1">R$ {curso.faturamentoAtual.toLocaleString()}</div>
                                </div>

                                {/* Inscriptions Bar */}
                                <div>
                                <div className="flex justify-between text-[11px] mb-1.5">
                                    <span className="text-slate-500 font-medium">Inscrições</span>
                                    <span className="font-bold text-slate-700">{curso.inscritos}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percentInscritos}%` }}></div>
                                </div>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="mt-5 pt-4 border-t border-slate-50 flex justify-end relative z-10">
                                <span className="text-xs font-bold text-pink-600 group-hover:text-pink-700 flex items-center">
                                Ver Detalhes <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>

                            </div>
                        );
                    })}
                </div>
            </div>
          ))}
        </div>

        {/* Widgets - Below Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity (2/3) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
               <Activity className="w-5 h-5 mr-2 text-pink-500" />
               Atividade Recente (Tempo Real)
            </h3>
            <div className="space-y-6">
              {activities.length === 0 ? (
                 <p className="text-slate-400 italic text-sm">Nenhuma atividade registrada hoje.</p>
              ) : (
                 activities.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-start pb-6 border-b border-slate-50 last:border-0 last:pb-0 animate-fade-in">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shrink-0 border 
                          ${log.type === 'success' ? 'bg-green-50 text-green-500 border-green-100' : 
                            log.type === 'warning' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                            log.type === 'danger' ? 'bg-red-50 text-red-500 border-red-100' :
                            'bg-blue-50 text-blue-500 border-blue-100'
                          }`}>
                          {log.type === 'success' ? <CheckCircle className="w-5 h-5" /> : 
                           log.type === 'warning' || log.type === 'danger' ? <AlertTriangle className="w-5 h-5" /> :
                           <Activity className="w-5 h-5" />}
                       </div>
                       <div>
                          <p className="text-sm text-slate-800 font-bold">{log.message}</p>
                          <p className="text-sm text-slate-600 mt-0.5">{log.details}</p>
                          <p className="text-xs text-slate-400 mt-2 flex items-center">
                             <Clock className="w-3 h-3 mr-1" /> 
                             {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Por {log.author}
                          </p>
                       </div>
                    </div>
                 ))
              )}
            </div>
          </div>

          {/* Quick Actions / Help (1/3) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
             <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden h-full flex flex-col justify-center">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3">Precisa de ajuda?</h3>
                  <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                     Use nossa Inteligência Artificial para analisar dados complexos e obter insights de vendas.
                  </p>
                  <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-md flex items-center justify-center">
                     <Target className="w-4 h-4 mr-2" /> Gerar Relatório IA
                  </button>
               </div>
             </div>
          </div>
        </div>

      </div>

      <CourseDetailModal 
        course={selectedCourse} 
        onClose={() => setSelectedCourse(null)}
        onNavigateToCRM={onNavigateToCRM}
      />
    </div>
  );
};

export default Dashboard;
