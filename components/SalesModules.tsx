
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LEADS_MOCK, CURSOS_MOCK, VENDEDORAS_MOCK, ESTADOS_BRASIL } from '../constants';
import { Lead, LeadStatus, ActivityLog } from '../types';
import { Search, Plus, Phone, Mail, Filter, ArrowRight, GripVertical, ChevronDown, User, Briefcase, MapPin, Building, DollarSign, Target, X, Save, FileText, Calculator, Percent, TrendingUp, AlertTriangle, MessageSquare, Edit2, Activity, BarChart2, PieChart, Ban, CheckCircle2 } from 'lucide-react';

// --- DECLINE REASON MODAL ---
interface DeclineReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const DeclineReasonModal: React.FC<DeclineReasonModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up border border-white/20">
        <div className="p-6 bg-slate-50 border-b border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Motivo do Declínio
           </h3>
           <p className="text-sm text-slate-500 mt-1">Por que esta oportunidade foi perdida?</p>
        </div>
        <div className="p-6">
           <textarea 
             className="w-full h-32 p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-slate-900 resize-none"
             placeholder="Ex: Cliente sem orçamento, optou pelo concorrente, etc..."
             value={reason}
             onChange={(e) => setReason(e.target.value)}
             autoFocus
           />
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-800">Cancelar</button>
           <button 
             onClick={() => {
                if (reason.trim()) onConfirm(reason);
             }}
             disabled={!reason.trim()}
             className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-red-500/20"
           >
              Confirmar Declínio
           </button>
        </div>
      </div>
    </div>,
    document.body
  );
};


// --- LEAD FORM MODAL ---
interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  origin?: 'crm' | 'leads'; // New prop to determine fields to show
  initialData?: Lead | null;
}

const LeadFormModal: React.FC<LeadFormModalProps> = ({ isOpen, onClose, onSave, origin = 'leads', initialData }) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    nome: '',
    empresa: '',
    cargo: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: 'SP',
    interesse: 'Geral', // Default value
    valorPotencial: 0, 
    valorNegociado: undefined, // undefined to start blank
    quantidadeInscricoes: 1,
    cursoId: '',
    responsavelId: VENDEDORAS_MOCK[0]?.id || '', 
    status: LeadStatus.PropostaEnviada,
    observacoes: ''
  });

  // Load initial data or reset
  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData({ ...initialData });
        } else {
            setFormData({
                nome: '',
                empresa: '',
                cargo: '',
                email: '',
                telefone: '',
                cidade: '',
                estado: 'SP',
                interesse: 'Geral',
                valorPotencial: 0,
                valorNegociado: undefined,
                quantidadeInscricoes: 1,
                cursoId: '',
                responsavelId: VENDEDORAS_MOCK[0]?.id || '',
                status: LeadStatus.PropostaEnviada,
                observacoes: ''
            });
        }
    }
  }, [initialData, isOpen]);

  // Calculate values dynamically when Course or Quantity changes
  useEffect(() => {
    if (origin === 'crm' && formData.cursoId) {
      const selectedCourse = CURSOS_MOCK.find(c => c.id === formData.cursoId);
      if (selectedCourse) {
        const qty = formData.quantidadeInscricoes || 1;
        const standardTotal = selectedCourse.valorInscricao * qty;
        
        // Update Standard Value (Potencial) but don't overwrite if it matches initial data logic
        setFormData(prev => ({
          ...prev,
          interesse: selectedCourse.tema, // Auto-fill interest
          valorPotencial: standardTotal,
        }));
      }
    }
  }, [formData.cursoId, formData.quantidadeInscricoes, origin]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead = {
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9),
      dataCadastro: formData.dataCadastro || new Date().toISOString().split('T')[0]
    } as Lead;
    onSave(newLead);
  };

  const handleChange = (field: keyof Lead, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculations for UI display
  const standardValue = formData.valorPotencial || 0;
  const negotiatedValue = formData.valorNegociado || 0;
  const discountAmount = standardValue - negotiatedValue;
  const discountPercent = standardValue > 0 ? (discountAmount / standardValue) * 100 : 0;
  
  // Show discount only if negotiated value is entered and less than standard
  const hasDiscount = (formData.valorNegociado !== undefined && formData.valorNegociado > 0) && discountAmount > 0;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 flex justify-between items-center shrink-0">
          <h3 className="text-white text-lg font-bold flex items-center">
            {origin === 'crm' ? <Calculator className="w-5 h-5 mr-2 text-white" /> : <Plus className="w-5 h-5 mr-2 text-white" />}
            {initialData ? 'Editar Negócio' : (origin === 'crm' ? 'Novo Negócio (Proposta)' : 'Novo Lead (Cadastro)')}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="lead-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Responsavel (Moved to Top) */}
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Vendedora Responsável</label>
               <div className="relative">
                  <select 
                     value={formData.responsavelId || ''}
                     onChange={e => handleChange('responsavelId', e.target.value)}
                     className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none appearance-none text-slate-900"
                  >
                     {VENDEDORAS_MOCK.map(v => (
                        <option key={v.id} value={v.id}>{v.nome}</option>
                     ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
               </div>
            </div>

            {/* Section 1: Contato */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                 <User className="w-4 h-4 mr-2" /> Dados do Servidor/Contato
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      value={formData.nome}
                      onChange={e => handleChange('nome', e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cargo / Função</label>
                    <input 
                      type="text" 
                      value={formData.cargo || ''}
                      onChange={e => handleChange('cargo', e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                      placeholder="Ex: Secretário, Diretor, Pregoeiro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Profissional</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => handleChange('email', e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                      placeholder="joao@orgao.gov.br"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Celular / WhatsApp</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.telefone}
                      onChange={e => handleChange('telefone', e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                      placeholder="(XX) 9XXXX-XXXX"
                    />
                  </div>
               </div>
            </div>

            {/* Section 2: Entidade */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                 <Building className="w-4 h-4 mr-2" /> Dados do Órgão Público
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Órgão / Entidade</label>
                    <input 
                      type="text" 
                      required
                      value={formData.empresa}
                      onChange={e => handleChange('empresa', e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                      placeholder="Ex: Prefeitura Municipal de X"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                    <input 
                      type="text" 
                      value={formData.cidade || ''}
                      onChange={e => handleChange('cidade', e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-1">UF</label>
                    <div className="relative">
                      <select 
                        value={formData.estado}
                        onChange={e => handleChange('estado', e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none appearance-none text-slate-900"
                      >
                        {ESTADOS_BRASIL.map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
               </div>
            </div>

            {/* Section 3: Observações */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
               <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                 <FileText className="w-4 h-4 mr-2" /> Observações
               </h4>
               <div>
                  <textarea 
                     value={formData.observacoes || ''}
                     onChange={e => handleChange('observacoes', e.target.value)}
                     className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none h-24 resize-none text-slate-900"
                     placeholder="Detalhes adicionais sobre o contato, horários preferenciais, etc..."
                  />
               </div>
            </div>

            {/* Section: Commercial Proposal (CRM Only) - AT BOTTOM */}
            {origin === 'crm' && (
              <div className="bg-slate-50 p-5 rounded-xl border border-pink-100 shadow-sm animate-fade-in">
                 <h4 className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-4 flex items-center border-b border-pink-200 pb-2">
                   <DollarSign className="w-4 h-4 mr-2" /> Detalhes da Proposta
                 </h4>

                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="md:col-span-3">
                       <label className="block text-sm font-medium text-slate-700 mb-1">Curso de Interesse</label>
                       <div className="relative">
                          <select 
                             value={formData.cursoId || ''}
                             onChange={e => handleChange('cursoId', e.target.value)}
                             required
                             className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none appearance-none text-slate-900"
                          >
                             <option value="" disabled>Selecione um curso...</option>
                             {CURSOS_MOCK.filter(c => c.status !== 'Concluído').map(curso => (
                                <option key={curso.id} value={curso.id}>{curso.tema} (R$ {curso.valorInscricao})</option>
                             ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Qtd. Inscrições</label>
                       <input 
                          type="number" 
                          min="1"
                          value={formData.quantidadeInscricoes || 1}
                          onChange={e => handleChange('quantidadeInscricoes', parseInt(e.target.value))}
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                       />
                    </div>
                 </div>

                 <div className="bg-white p-4 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Valor da Proposta (Padrão)</label>
                          <div className="text-2xl font-black text-slate-800">
                             R$ {standardValue.toLocaleString('pt-BR')}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">Baseado na tabela do curso</p>
                       </div>
                       
                       <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Valor Negociado (Opcional)</label>
                          <div className="relative">
                             <span className="absolute left-3 top-2.5 text-slate-400 text-sm">R$</span>
                             <input 
                               type="number" 
                               value={formData.valorNegociado ?? ''} 
                               onChange={e => handleChange('valorNegociado', parseFloat(e.target.value))}
                               className="w-full pl-8 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900 font-bold placeholder-slate-300"
                               placeholder="0,00"
                             />
                          </div>
                       </div>
                    </div>

                    {/* Discount Box */}
                    {hasDiscount && (
                       <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center animate-fade-in">
                          <div className="flex items-center text-green-700 font-medium text-sm">
                             <TrendingUp className="w-4 h-4 mr-2 rotate-180" /> Desconto Aplicado
                          </div>
                          <div className="text-right">
                             <div className="text-xl font-bold text-green-600">{discountPercent.toFixed(1)}%</div>
                             <div className="text-xs text-green-600">Economia: R$ {discountAmount.toLocaleString('pt-BR')}</div>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
            )}

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
           <button 
             type="button" 
             onClick={onClose}
             className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
           >
             Cancelar
           </button>
           <button 
             type="submit" 
             form="lead-form"
             className="px-6 py-2 bg-pink-600 text-white rounded-lg font-bold shadow-md shadow-pink-500/30 hover:bg-pink-700 transition-all flex items-center"
           >
             <Save className="w-4 h-4 mr-2" /> {initialData ? 'Salvar Alterações' : (origin === 'crm' ? 'Criar Proposta' : 'Cadastrar Lead')}
           </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- CRM KANBAN VIEW ---
interface CRMViewProps {
  initialFilter?: string;
  logActivity?: (type: ActivityLog['type'], message: string, details: string, author: string) => void;
}

export const CRMView: React.FC<CRMViewProps> = ({ initialFilter, logActivity }) => {
  const [leads, setLeads] = useState<Lead[]>(LEADS_MOCK);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>(CURSOS_MOCK.length > 0 ? CURSOS_MOCK[0].tema : '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  // States for Decline Logic
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [leadToDeclineId, setLeadToDeclineId] = useState<string | null>(null);

  useEffect(() => {
    if (initialFilter && initialFilter !== 'Todas') {
        setSelectedCourse(initialFilter);
    }
  }, [initialFilter]);

  const columns = [
    { id: LeadStatus.PropostaEnviada, title: 'Proposta Enviada', color: 'bg-blue-500' },
    { id: LeadStatus.EmAnalise, title: 'Em Análise', color: 'bg-purple-500' },
    { id: LeadStatus.Inscrito, title: 'Inscrito', color: 'bg-emerald-500' },
    { id: LeadStatus.Declinado, title: 'Declinado', color: 'bg-red-500' },
  ];

  // Filter Logic
  const filteredLeads = leads.filter(lead => {
    if (selectedCourse === 'Todas') return true;
    return lead.interesse.toLowerCase().includes(selectedCourse.toLowerCase());
  });

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const el = document.getElementById(`lead-${leadId}`);
      if (el) el.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(null);
    const el = document.getElementById(`lead-${leadId}`);
    if (el) el.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: LeadStatus) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    // Logic to handle Decline with Modal
    if (targetStatus === LeadStatus.Declinado) {
       setLeadToDeclineId(draggedLeadId);
       setDeclineModalOpen(true);
       return;
    }

    const draggedLead = leads.find(l => l.id === draggedLeadId);
    if (draggedLead && targetStatus === LeadStatus.Inscrito && logActivity) {
        const vendedora = VENDEDORAS_MOCK.find(v => v.id === draggedLead.responsavelId)?.nome || 'Sistema';
        logActivity('success', 'Nova inscrição confirmada', `Vendedora ${vendedora} fechou com ${draggedLead.empresa}.`, vendedora);
    }

    // Default Move
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === draggedLeadId ? { ...lead, status: targetStatus } : lead
      )
    );
    setDraggedLeadId(null);
  };

  const handleDeclineConfirm = (reason: string) => {
     if (leadToDeclineId) {
        const lead = leads.find(l => l.id === leadToDeclineId);
        
        setLeads(prevLeads => 
           prevLeads.map(lead => 
              lead.id === leadToDeclineId ? { ...lead, status: LeadStatus.Declinado, motivoPerda: reason } : lead
           )
        );
        
        if (lead && logActivity) {
            const vendedora = VENDEDORAS_MOCK.find(v => v.id === lead.responsavelId)?.nome || 'Sistema';
            logActivity('warning', 'Oportunidade perdida', `Lead "${lead.nome}" declinado.`, vendedora);
        }

        setDeclineModalOpen(false);
        setLeadToDeclineId(null);
        setDraggedLeadId(null);
     }
  };

  const handleSaveLead = (lead: Lead) => {
    if (editingLead) {
        // Update existing lead
        setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
    } else {
        // Create new lead
        setLeads(prev => [...prev, lead]);
        if (logActivity) {
            const vendedora = VENDEDORAS_MOCK.find(v => v.id === lead.responsavelId)?.nome || 'Sistema';
            logActivity('info', 'Novo negócio iniciado', `Proposta enviada para ${lead.empresa}.`, vendedora);
        }
    }
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleEditClick = (lead: Lead) => {
      setEditingLead(lead);
      setIsModalOpen(true);
  };

  const handleNewClick = () => {
      setEditingLead(null);
      setIsModalOpen(true);
  };

  // KPIs Calculations
  const leadsInPipeline = filteredLeads;
  const closedLeads = leadsInPipeline.filter(l => l.status === LeadStatus.Inscrito);
  
  // Ticket Médio
  const totalRevenue = closedLeads.reduce<number>((acc, curr) => acc + (curr.valorNegociado ?? curr.valorPotencial), 0);
  const totalInscricoesClosed = closedLeads.reduce<number>((acc, curr) => acc + (curr.quantidadeInscricoes ?? 1), 0);
  const ticketMedioPorAluno = totalInscricoesClosed > 0 ? totalRevenue / totalInscricoesClosed : 0;
  
  // Taxa de Conversão (Inscrito / Total exceto novos se houver)
  // Simplified: Inscrito / Total visible
  const conversao = leadsInPipeline.length > 0 ? (closedLeads.length / leadsInPipeline.length) * 100 : 0;
  
  // Desconto Médio
  const leadsWithDiscount = leadsInPipeline.filter(l => l.valorNegociado && l.valorNegociado < l.valorPotencial);
  const totalDiscountPct = leadsWithDiscount.reduce<number>((acc, l) => {
     const neg = l.valorNegociado ?? l.valorPotencial;
     const disc = l.valorPotencial > 0 ? (l.valorPotencial - neg) / l.valorPotencial : 0;
     return acc + disc;
  }, 0);
  const descontoMedio = leadsWithDiscount.length > 0 ? (totalDiscountPct / leadsWithDiscount.length) * 100 : 0;

  // Motivos de Perda Chart Data
  const lostLeads = leadsInPipeline.filter(l => l.status === LeadStatus.Declinado);
  const reasonsMap = lostLeads.reduce((acc, l) => {
     const r = l.motivoPerda || 'Outros';
     acc[r] = (acc[r] || 0) + 1;
     return acc;
  }, {} as Record<string, number>);
  const sortedReasons = Object.entries(reasonsMap).sort((a,b) => b[1] - a[1]).slice(0, 3);

  // Sellers Performance (in this pipeline)
  const sellersMap = leadsInPipeline.reduce((acc, l) => {
     const vid = l.responsavelId;
     const val = l.valorNegociado || l.valorPotencial;
     acc[vid] = (acc[vid] || 0) + val;
     return acc;
  }, {} as Record<string, number>);
  const sortedSellers = Object.entries(sellersMap)
     .map(([id, val]) => ({ id, val, name: VENDEDORAS_MOCK.find(v => v.id === id)?.nome || 'Unknown' }))
     .sort((a,b) => b.val - a.val).slice(0, 3);


  return (
    <div className="flex flex-col space-y-4 animate-fade-in h-auto min-h-screen pb-12">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pipeline de Vendas</h2>
          <p className="text-sm text-slate-500">Visualizando {filteredLeads.length} oportunidades</p>
        </div>
        <div className="flex gap-2">
          {/* Course Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-500 w-4 h-4 pointer-events-none z-10" />
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium hover:border-pink-300 focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none appearance-none shadow-sm min-w-[220px]"
            >
              {CURSOS_MOCK.map(curso => (
                <option key={curso.id} value={curso.tema}>{curso.tema}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>

          <button 
            onClick={handleNewClick}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 flex items-center shadow-md shadow-pink-500/20 transition-transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Negócio
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-full">
          {columns.map(col => {
            const items = filteredLeads.filter(l => l.status === col.id);
            const totalValue = items.reduce((acc, curr) => acc + (curr.valorNegociado ?? curr.valorPotencial), 0);
            
            return (
              <div 
                key={col.id} 
                className="min-w-[320px] w-full max-w-xs flex flex-col bg-slate-100/50 rounded-xl border border-slate-200/60 h-fit min-h-[500px] transition-colors"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className={`p-3 border-b border-slate-200 flex justify-between items-center rounded-t-xl ${col.id === LeadStatus.Inscrito ? 'bg-green-50/50' : col.id === LeadStatus.Declinado ? 'bg-red-50/50' : ''}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${col.color}`}></div>
                    <span className="font-bold text-slate-700">{col.title}</span>
                    <span className="bg-white px-2 py-0.5 rounded-full text-xs text-slate-500 font-medium border border-slate-200">{items.length}</span>
                  </div>
                </div>
                
                <div className="p-3 space-y-3 flex-1 custom-scrollbar">
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wide px-1 flex justify-between">
                    <span>Total: R$ {totalValue.toLocaleString()}</span>
                  </div>
                  
                  {items.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic border-2 border-dashed border-slate-200 rounded-lg">
                      Arraste leads para cá
                    </div>
                  ) : (
                    items.map(lead => {
                       const vendedora = VENDEDORAS_MOCK.find(v => v.id === lead.responsavelId);
                       const valorFinal = lead.valorNegociado || lead.valorPotencial;
                       const valorOriginal = lead.valorPotencial;
                       const hasDiscount = !!(lead.valorNegociado && lead.valorNegociado < lead.valorPotencial);
                       const discountPct = hasDiscount ? Math.round(((lead.valorPotencial - (lead.valorNegociado ?? 0)) / lead.valorPotencial) * 100) : 0;

                       return (
                          <div 
                             key={lead.id} 
                             id={`lead-${lead.id}`}
                             draggable
                             onDragStart={(e) => handleDragStart(e, lead.id)}
                             onDragEnd={(e) => handleDragEnd(e, lead.id)}
                             className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-pink-200 transition-all group relative animate-fade-in"
                          >
                             {/* Header */}
                             <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-800 text-base leading-tight">{lead.nome}</h4>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button 
                                      onClick={() => handleEditClick(lead)}
                                      className="text-slate-400 hover:text-pink-600 transition-colors"
                                      title="Editar"
                                   >
                                      <Edit2 className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>

                             {/* Organization & Location */}
                             <div className="space-y-1 mb-4">
                                <div className="flex items-center text-xs text-slate-500">
                                   <Building className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                   <span className="truncate">{lead.empresa}</span>
                                </div>
                                <div className="flex items-center text-xs text-slate-500">
                                   <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                                   <span>{lead.cidade ? `${lead.cidade}, ${lead.estado}` : 'Local não informado'}</span>
                                </div>
                             </div>

                             {/* Qty & Financials */}
                             <div className="flex justify-between items-end mb-3">
                                <div>
                                   <p className="text-xs text-slate-500 font-medium mb-0.5">Qtd. Inscrições:</p>
                                   <p className="text-sm font-bold text-slate-800">{lead.quantidadeInscricoes || 1}</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-xs text-slate-500 font-medium mb-0.5">Valor:</p>
                                   <div className="flex items-center justify-end gap-2">
                                      <span className="text-lg font-bold text-pink-600">R$ {valorFinal.toLocaleString()}</span>
                                      {hasDiscount && (
                                         <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                            -{discountPct}%
                                         </span>
                                      )}
                                   </div>
                                   {hasDiscount && (
                                      <p className="text-xs text-slate-400 line-through decoration-slate-400">R$ {valorOriginal.toLocaleString()}</p>
                                   )}
                                </div>
                             </div>

                             {/* Footer: Seller */}
                             <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                                <span>Vendedora: {vendedora?.nome || 'N/A'}</span>
                                {lead.motivoPerda && (
                                   <span className="text-red-500 flex items-center" title={lead.motivoPerda}>
                                      <MessageSquare className="w-3 h-3 mr-1" /> Declinado
                                   </span>
                                )}
                             </div>
                          </div>
                       );
                    })
                  )}
                  
                  <button 
                    onClick={handleNewClick}
                    className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 text-sm font-medium hover:border-slate-400 hover:text-slate-500 transition-colors bg-transparent hover:bg-slate-50"
                  >
                    + Novo Negócio
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Footer */}
      <div className="mt-8 border-t border-slate-200 pt-8">
         <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-pink-500" /> Indicadores de Performance (Pipeline Atual)
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
               <div className="text-xs font-bold text-slate-400 uppercase mb-2">Ticket Médio (Por Aluno)</div>
               <div className="text-2xl font-black text-slate-800">R$ {ticketMedioPorAluno.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
               <div className="text-xs text-slate-500 mt-1">Negócios fechados</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
               <div className="text-xs font-bold text-slate-400 uppercase mb-2">Taxa de Conversão</div>
               <div className="text-2xl font-black text-emerald-600">{conversao.toFixed(1)}%</div>
               <div className="text-xs text-slate-500 mt-1">Proposta → Inscrito</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
               <div className="text-xs font-bold text-slate-400 uppercase mb-2">Desconto Médio</div>
               <div className="text-2xl font-black text-amber-500">{descontoMedio.toFixed(1)}%</div>
               <div className="text-xs text-slate-500 mt-1">Sobre valor de tabela</div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h4 className="font-bold text-slate-700 mb-4 flex items-center text-sm uppercase tracking-wider">
                  <PieChart className="w-4 h-4 mr-2" /> Motivos de Perda
               </h4>
               <div className="space-y-4">
                  {sortedReasons.length > 0 ? sortedReasons.map(([reason, count], i) => (
                     <div key={reason}>
                        <div className="flex justify-between text-xs mb-1">
                           <span className="font-bold text-slate-600">{reason}</span>
                           <span className="text-slate-400">{count} leads</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full">
                           <div className={`h-full rounded-full ${i===0 ? 'bg-red-500' : i===1 ? 'bg-amber-500' : 'bg-slate-400'}`} style={{ width: `${(count / lostLeads.length) * 100}%` }}></div>
                        </div>
                     </div>
                  )) : (
                     <p className="text-sm text-slate-400 italic">Nenhum dado de perda registrado.</p>
                  )}
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h4 className="font-bold text-slate-700 mb-4 flex items-center text-sm uppercase tracking-wider">
                  <BarChart2 className="w-4 h-4 mr-2" /> Ranking de Vendas (Pipeline)
               </h4>
               <div className="space-y-4">
                  {sortedSellers.map((seller, i) => (
                     <div key={seller.id} className="flex items-center">
                        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold mr-3 ${i===0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'}`}>{i+1}</div>
                        <div className="flex-1">
                           <div className="flex justify-between text-xs mb-1">
                              <span className="font-bold text-slate-800">{seller.name}</span>
                              <span className="font-bold text-slate-600">R$ {seller.val.toLocaleString()}</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-100 rounded-full">
                              <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(seller.val / sortedSellers[0].val) * 100}%` }}></div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <LeadFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        origin="crm" 
        initialData={editingLead}
      />

      <DeclineReasonModal 
         isOpen={declineModalOpen}
         onClose={() => {
            setDeclineModalOpen(false);
            setDraggedLeadId(null);
            setLeadToDeclineId(null);
         }}
         onConfirm={handleDeclineConfirm}
      />
    </div>
  );
};

// --- LEADS LIST VIEW ---
interface LeadsViewProps {
  logActivity?: (type: ActivityLog['type'], message: string, details: string, author: string) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({ logActivity }) => {
  const [leads, setLeads] = useState<Lead[]>(LEADS_MOCK);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddLead = (newLead: Lead) => {
    setLeads([...leads, newLead]);
    if (logActivity) {
       const vendedora = VENDEDORAS_MOCK.find(v => v.id === newLead.responsavelId)?.nome || 'Sistema';
       logActivity('info', 'Novo contato cadastrado', `Cliente: ${newLead.nome} (${newLead.empresa})`, vendedora);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão de Leads</h2>
          <p className="text-slate-500 text-sm">Gerencie todos os contatos e oportunidades comerciais.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg font-medium shadow-lg shadow-pink-500/30 hover:bg-pink-700 transition-all transform hover:-translate-y-0.5 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Lead
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por nome, empresa ou email..." 
              className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="relative">
             <select className="px-3 py-2 pr-10 rounded-lg border border-slate-300 text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none text-slate-900">
               <option>Todos os Status</option>
               <option>Novos</option>
               <option>Em Negociação</option>
             </select>
             <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs">
            <tr>
              <th className="px-6 py-4">Nome / Empresa</th>
              <th className="px-6 py-4">Cargo / Local</th>
              <th className="px-6 py-4">Interesse</th>
              <th className="px-6 py-4">Contato</th>
              <th className="px-6 py-4">Potencial</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{lead.nome}</div>
                  <div className="text-slate-500 text-xs">{lead.empresa}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-700 font-medium text-xs">{lead.cargo || '-'}</div>
                  <div className="text-slate-500 text-[10px]">{lead.cidade ? `${lead.cidade}/${lead.estado}` : '-'}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="bg-pink-50 text-pink-600 px-2 py-0.5 rounded text-[10px] font-bold border border-pink-100">
                    {lead.interesse.split(' ')[0]}...
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center text-xs text-slate-600"><Mail className="w-3 h-3 mr-1 text-slate-400"/> {lead.email}</div>
                    <div className="flex items-center text-xs text-slate-600"><Phone className="w-3 h-3 mr-1 text-slate-400"/> {lead.telefone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">R$ {lead.valorPotencial.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                    lead.status === LeadStatus.PropostaEnviada ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    lead.status === LeadStatus.Inscrito ? 'bg-green-50 text-green-600 border-green-100' :
                    lead.status === LeadStatus.Declinado ? 'bg-red-50 text-red-600 border-red-100' :
                    'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-pink-600 p-1 opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
          Mostrando {leads.length} leads cadastrados
        </div>
      </div>

      <LeadFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddLead}
        origin="leads" // Passa origin como Leads
      />
    </div>
  );
};