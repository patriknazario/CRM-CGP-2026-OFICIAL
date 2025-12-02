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
  const [notifications, setNotifications] = useState<Notificacao[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

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

      // 6. Fetch Notificacoes
      const { data: notifData, error: notifError } = await supabase.from('notificacoes').select('*').order('data', { ascending: false });
      if (notifError) console.error('Error fetching notificacoes:', notifError);
      // Always set notifications, even if empty, to clear mocks
      setNotifications(notifData || []);

      // 7. Fetch Activity Logs
      const { data: activityData, error: activityError } = await supabase.from('activity_logs').select('*').order('timestamp', { ascending: false });
      if (activityError) console.error('Error fetching activity_logs:', activityError);
      // Always set activities, even if empty, to clear mocks
      setActivities(activityData || []);

      // 8. Fetch Taxas Comissao
      const { data: taxasData, error: taxasError } = await supabase.from('taxas_comissao').select('*');
      if (taxasError) console.error('Error fetching taxas_comissao:', taxasError);
      if (taxasData) {
        setTaxasComissao(taxasData.map((t: any) => ({
          ...t,
          vendedorId: t.vendedor_id,
          vendedorNome: t.vendedor_nome,
          cursoId: t.curso_id,
          cursoNome: t.curso_nome,
          mesAplicacao: t.mes_aplicacao
        })));
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

    if (!supabase) return;

    // Realtime Subscription
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        console.log('Realtime Change (Leads):', payload);
        if (payload.eventType === 'INSERT') {
          setLeads(prev => [payload.new as Lead, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setLeads(prev => prev.map(l => l.id === payload.new.id ? { ...l, ...payload.new } : l));
        } else if (payload.eventType === 'DELETE') {
          setLeads(prev => prev.filter(l => l.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cursos' }, (payload) => {
        console.log('Realtime Change (Cursos):', payload);
        if (payload.eventType === 'INSERT') {
          setCursos(prev => [payload.new as Curso, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setCursos(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
        } else if (payload.eventType === 'DELETE') {
          setCursos(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notificacoes' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => [payload.new as Notificacao, ...prev]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- ACTIONS ---

  const logActivity = async (type: ActivityLog['type'], message: string, details: string, author: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(), // Temp ID, DB will generate UUID
      type,
      message,
      details,
      author,
      timestamp: new Date().toISOString()
    };

    // Optimistic Update
    setActivities(prev => [newLog, ...prev]);

    if (supabase) {
      await supabase.from('activity_logs').insert([{
        type, message, details, author, timestamp: newLog.timestamp
      }]);
    }
  };

  const addLead = async (lead: Lead) => {
    // Optimistic Update (Optional, but good for UX. Realtime will confirm it)
    // setLeads(prev => [...prev, lead]); 

    if (supabase) {
      const { error } = await supabase.from('leads').insert([{
        nome: lead.nome,
        empresa: lead.empresa,
        cargo: lead.cargo,
        cidade: lead.cidade,
        estado: lead.estado,
        email: lead.email,
        telefone: lead.telefone,
        interesse: lead.interesse,
        status: lead.status,
        valor_potencial: lead.valorPotencial,
        valor_negociado: lead.valorNegociado,
        quantidade_inscricoes: lead.quantidadeInscricoes,
        curso_id: lead.cursoId,
        responsavel_id: lead.responsavelId,
        data_cadastro: lead.dataCadastro
      }]);
      if (error) console.error('Error adding lead:', error);
    } else {
      // Fallback for Mock Mode
      setLeads(prev => [...prev, lead]);
    }
  };

  const updateLead = async (lead: Lead) => {
    // Optimistic
    // setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));

    if (supabase) {
      const { error } = await supabase.from('leads').update({
        nome: lead.nome,
        empresa: lead.empresa,
        cargo: lead.cargo,
        cidade: lead.cidade,
        estado: lead.estado,
        email: lead.email,
        telefone: lead.telefone,
        interesse: lead.interesse,
        status: lead.status,
        valor_potencial: lead.valorPotencial,
        valor_negociado: lead.valorNegociado,
        quantidade_inscricoes: lead.quantidadeInscricoes,
        curso_id: lead.cursoId,
        responsavel_id: lead.responsavelId,
        // data_cadastro usually doesn't change
      }).eq('id', lead.id);

      if (error) console.error('Error updating lead:', error);
    } else {
      setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
    }
  };

  const addCurso = async (curso: Curso) => {
    if (supabase) {
      const { error } = await supabase.from('cursos').insert([{
        tema: curso.tema,
        professor_id: curso.professorId,
        cidade: curso.cidade,
        estado: curso.estado,
        data_inicio: curso.dataInicio,
        data_fim: curso.dataFim,
        carga_horaria: curso.cargaHoraria,
        valor_inscricao: curso.valorInscricao,
        meta_faturamento: curso.metaFaturamento,
        faturamento_atual: curso.faturamentoAtual,
        status: curso.status,
        inscritos: curso.inscritos
      }]);
      if (error) console.error('Error adding curso:', error);
    } else {
      setCursos(prev => [...prev, curso]);
    }
  };

  const updateCurso = async (curso: Curso) => {
    if (supabase) {
      const { error } = await supabase.from('cursos').update({
        tema: curso.tema,
        professor_id: curso.professorId,
        cidade: curso.cidade,
        estado: curso.estado,
        data_inicio: curso.dataInicio,
        data_fim: curso.dataFim,
        carga_horaria: curso.cargaHoraria,
        valor_inscricao: curso.valorInscricao,
        meta_faturamento: curso.metaFaturamento,
        faturamento_atual: curso.faturamentoAtual,
        status: curso.status,
        inscritos: curso.inscritos
      }).eq('id', curso.id);
      if (error) console.error('Error updating curso:', error);
    } else {
      setCursos(prev => prev.map(c => c.id === curso.id ? curso : c));
    }
  };

  const deleteCurso = async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from('cursos').delete().eq('id', id);
      if (error) console.error('Error deleting curso:', error);
    } else {
      setCursos(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateMetaGlobal = async (meta: MetaGlobal) => {
    if (supabase) {
      // Assuming single row for meta global
      const { error } = await supabase.from('metas_globais').update({
        valor_meta: meta.metaGlobalValor,
        bonus_valor_1: meta.bonusValor1,
        bonus_valor_2: meta.bonusValor2,
        bonus_valor_3: meta.bonusValor3
        // ... other fields
      }).eq('periodo', 'Anual'); // Or use ID if available

      if (error) console.error('Error updating meta:', error);
      else setMetaGlobal(meta); // Update local state as well since meta might not be realtime
    } else {
      setMetaGlobal(meta);
    }
  };

  const addNotification = async (n: Notificacao) => {
    if (supabase) {
      const { error } = await supabase.from('notificacoes').insert([{
        titulo: n.titulo,
        mensagem: n.mensagem,
        tipo: n.tipo,
        data: n.data,
        lida: n.lida
      }]);
      if (error) console.error('Error adding notification:', error);
    } else {
      setNotifications(prev => [n, ...prev]);
    }
  };

  const markNotificationRead = async (id: string) => {
    if (supabase) {
      const { error } = await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
      if (error) console.error('Error marking notification read:', error);
      else setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    } else {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    }
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