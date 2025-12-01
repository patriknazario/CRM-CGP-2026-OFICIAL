import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  CURSOS_MOCK, 
  LEADS_MOCK, 
  PROFESSORES_MOCK, 
  VENDEDORAS_MOCK, 
  META_GLOBAL_MOCK, 
  COMISSOES_MOCK 
} from '../constants';
import { 
  Curso, 
  Lead, 
  Professor, 
  Vendedora, 
  MetaGlobal, 
  TaxaComissao, 
  Notificacao, 
  ActivityLog,
  StatusCurso,
  LeadStatus
} from '../types';

interface DataContextType {
  cursos: Curso[];
  leads: Lead[];
  professores: Professor[];
  vendedoras: Vendedora[];
  metaGlobal: MetaGlobal;
  taxasComissao: TaxaComissao[];
  notifications: Notificacao[];
  activities: ActivityLog[];
  loading: boolean;
  
  // Actions (simplified for now - just state updates in frontend, would be DB calls in full prod)
  addLead: (lead: Lead) => Promise<void>;
  updateLead: (lead: Lead) => Promise<void>;
  addCurso: (curso: Curso) => Promise<void>;
  updateCurso: (curso: Curso) => Promise<void>;
  deleteCurso: (id: string) => Promise<void>;
  updateMetaGlobal: (meta: MetaGlobal) => Promise<void>;
  logActivity: (type: ActivityLog['type'], message: string, details: string, author: string) => void;
  addNotification: (n: Notificacao) => void;
  markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [cursos, setCursos] = useState<Curso[]>(CURSOS_MOCK);
  const [leads, setLeads] = useState<Lead[]>(LEADS_MOCK);
  const [professores, setProfessores] = useState<Professor[]>(PROFESSORES_MOCK);
  const [vendedoras, setVendedoras] = useState<Vendedora[]>(VENDEDORAS_MOCK);
  const [metaGlobal, setMetaGlobal] = useState<MetaGlobal>(META_GLOBAL_MOCK);
  const [taxasComissao, setTaxasComissao] = useState<TaxaComissao[]>(COMISSOES_MOCK);
  
  // Local only states
  const [notifications, setNotifications] = useState<Notificacao[]>([
    { id: '1', titulo: 'Meta Batida!', mensagem: 'Parabéns time! Atingimos 100% da meta trimestral antecipadamente.', tipo: 'info', data: new Date().toISOString(), lida: false },
    { id: '2', titulo: 'Atualização de Sistema', mensagem: 'O sistema passará por manutenção no domingo às 02:00.', tipo: 'warning', data: new Date().toISOString(), lida: false }
  ]);
  
  const [activities, setActivities] = useState<ActivityLog[]>([
    { id: '1', type: 'success', message: 'Nova inscrição confirmada', details: 'Vendedora Elis fechou contrato com Prefeitura de Osasco.', author: 'Elis', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
    { id: '2', type: 'info', message: 'Novo lead cadastrado', details: 'Lead "Carlos Silva" adicionado ao pipeline.', author: 'Sistema', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    { id: '3', type: 'warning', message: 'Oportunidade perdida', details: 'Lead "Marcos Pereira" declinado.', author: 'Patrícia', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() }
  ]);

  const fetchData = async () => {
    setLoading(true);
    
    // If Supabase is not configured, we stick to initial Mocks
    if (!supabase) {
      console.log('Supabase not configured. Using Mock Data.');
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch Professores
      const { data: profsData } = await supabase.from('professores').select('*');
      if (profsData) setProfessores(profsData);

      // 2. Fetch Vendedoras
      const { data: vendsData } = await supabase.from('vendedoras').select('*');
      if (vendsData) {
        // Map snake_case from DB to camelCase for frontend if needed, or ensure DB columns match types
        // Assuming DB columns match Types or mapping logic here:
        setVendedoras(vendsData.map((v: any) => ({
            ...v,
            metaIndividual: v.meta_individual,
            vendasTotais: v.vendas_totais || 0, // Should be calculated in real app
            // ... map other fields
        })));
      }

      // 3. Fetch Cursos
      const { data: cursosData } = await supabase.from('cursos').select('*');
      if (cursosData) {
         setCursos(cursosData.map((c: any) => ({
            ...c,
            dataInicio: c.data_inicio,
            dataFim: c.data_fim,
            cargaHoraria: c.carga_horaria,
            valorInscricao: c.valor_inscricao,
            metaFaturamento: c.meta_faturamento,
            faturamentoAtual: c.faturamento_atual,
            professorId: c.professor_id
         })));
      }

      // 4. Fetch Leads
      const { data: leadsData } = await supabase.from('leads').select('*');
      if (leadsData) {
         setLeads(leadsData.map((l: any) => ({
            ...l,
            valorPotencial: l.valor_potencial,
            valorNegociado: l.valor_negociado,
            quantidadeInscricoes: l.quantidade_inscricoes,
            responsavelId: l.responsavel_id,
            cursoId: l.curso_id,
            dataCadastro: l.data_cadastro,
            motivoPerda: l.motivo_perda
         })));
      }

      // 5. Fetch Meta Global
      const { data: metaData } = await supabase.from('metas_globais').select('*').limit(1).single();
      if (metaData) {
         setMetaGlobal({
            ...metaData,
            metaGlobalValor: metaData.valor_meta,
            bonusValor1: metaData.bonus_valor_1,
            bonusValor2: metaData.bonus_valor_2,
            bonusValor3: metaData.bonus_valor_3
         });
      }

    } catch (error) {
      console.error('Error fetching data from Supabase:', error);
      // Fallback is already set (Mocks)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- ACTIONS ---
  
  const logActivity = (type: ActivityLog['type'], message: string, details: string, author: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      type,
      message,
      details,
      author,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newLog, ...prev]);
    // TODO: Persist to Supabase 'activity_logs'
  };

  const addLead = async (lead: Lead) => {
    setLeads(prev => [...prev, lead]);
    // TODO: Supabase Insert logic
    /* 
    if (supabase) {
       await supabase.from('leads').insert([{
          nome: lead.nome,
          // ... map fields
       }]);
    } 
    */
  };

  const updateLead = async (lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
    // TODO: Supabase Update logic
  };

  const addCurso = async (curso: Curso) => {
    setCursos(prev => [...prev, curso]);
  };

  const updateCurso = async (curso: Curso) => {
    setCursos(prev => prev.map(c => c.id === curso.id ? curso : c));
  };

  const deleteCurso = async (id: string) => {
    setCursos(prev => prev.filter(c => c.id !== id));
  };

  const updateMetaGlobal = async (meta: MetaGlobal) => {
    setMetaGlobal(meta);
  };

  const addNotification = (n: Notificacao) => {
    setNotifications(prev => [n, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  };

  return (
    <DataContext.Provider value={{
      cursos,
      leads,
      professores,
      vendedoras,
      metaGlobal,
      taxasComissao,
      notifications,
      activities,
      loading,
      addLead,
      updateLead,
      addCurso,
      updateCurso,
      deleteCurso,
      updateMetaGlobal,
      logActivity,
      addNotification,
      markNotificationRead
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};