
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
  
  addLead: (lead: Lead) => Promise<void>;
  updateLead: (lead: Lead) => Promise<void>;
  addCurso: (curso: Curso) => Promise<void>;
  updateCurso: (curso: Curso) => Promise<void>;
  deleteCurso: (id: string) => Promise<void>;
  updateMetaGlobal: (meta: MetaGlobal) => Promise<void>;
  addTaxaComissao: (taxa: TaxaComissao) => Promise<void>;
  deleteTaxaComissao: (id: string) => Promise<void>;
  logActivity: (type: ActivityLog['type'], message: string, details: string, author: string) => void;
  addNotification: (n: Notificacao) => void;
  markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  // Inicializa com Mocks apenas para evitar crash inicial, mas o useEffect vai sobrescrever
  const [cursos, setCursos] = useState<Curso[]>(CURSOS_MOCK);
  const [leads, setLeads] = useState<Lead[]>(LEADS_MOCK);
  const [professores, setProfessores] = useState<Professor[]>(PROFESSORES_MOCK);
  const [vendedoras, setVendedoras] = useState<Vendedora[]>(VENDEDORAS_MOCK);
  const [metaGlobal, setMetaGlobal] = useState<MetaGlobal>(META_GLOBAL_MOCK);
  const [taxasComissao, setTaxasComissao] = useState<TaxaComissao[]>(COMISSOES_MOCK);
  
  // Estados locais (ainda não persistidos no SQL, ou opcionais)
  const [notifications, setNotifications] = useState<Notificacao[]>([
    { id: '1', titulo: 'Sistema Conectado', mensagem: 'O Dashboard está operando com dados reais.', tipo: 'info', data: new Date().toISOString(), lida: false }
  ]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // --- MAPPEAMENTO DE DADOS (Banco snake_case <-> App camelCase) ---

  const mapProfessorFromDB = (p: any): Professor => ({
    id: p.id,
    nome: p.nome,
    especialidade: p.especialidade,
    email: p.email,
    linkedin: p.linkedin,
    instagram: p.instagram,
    bio: p.bio
  });

  const mapVendedoraFromDB = (v: any): Vendedora => ({
    id: v.id,
    nome: v.nome,
    avatar: v.avatar,
    vendasTotais: Number(v.vendas_totais || 0),
    metaIndividual: Number(v.meta_individual || 0),
    metaMensal: Number(v.meta_mensal || 0),
    metaTrimestral: Number(v.meta_trimestral || 0),
    metaAnual: Number(v.meta_anual || 0),
    performance: Number(v.performance || 0)
  });

  const mapCursoFromDB = (c: any): Curso => ({
    id: c.id,
    tema: c.tema,
    professorId: c.professor_id,
    cidade: c.cidade,
    estado: c.estado,
    dataInicio: c.data_inicio,
    dataFim: c.data_fim,
    cargaHoraria: c.carga_horaria,
    valorInscricao: Number(c.valor_inscricao),
    metaFaturamento: Number(c.meta_faturamento),
    faturamentoAtual: Number(c.faturamento_atual || 0),
    inscritos: c.inscritos || 0,
    status: c.status as StatusCurso,
    observacoes: c.observacoes
  });

  const mapLeadFromDB = (l: any): Lead => ({
    id: l.id,
    nome: l.nome,
    empresa: l.empresa,
    cargo: l.cargo,
    cidade: l.cidade,
    estado: l.estado,
    email: l.email,
    telefone: l.telefone,
    interesse: l.interesse,
    status: l.status as LeadStatus,
    valorPotencial: Number(l.valor_potencial || 0),
    valorNegociado: l.valor_negociado ? Number(l.valor_negociado) : undefined,
    quantidadeInscricoes: l.quantidade_inscricoes,
    cursoId: l.curso_id,
    responsavelId: l.responsavel_id,
    motivoPerda: l.motivo_perda,
    observacoes: l.observacoes,
    dataCadastro: l.data_cadastro
  });

  const mapTaxaFromDB = (t: any): TaxaComissao => ({
    id: t.id,
    taxa: Number(t.taxa),
    tipo: t.tipo as 'Padrão' | 'Específica',
    vendedorId: t.vendedor_id,
    vendedorNome: t.vendedor_id === 'todos' ? 'Todos' : (vendedoras.find(v => v.id === t.vendedor_id)?.nome || '...'),
    cursoId: t.curso_id,
    cursoNome: t.curso_id === 'todos' ? 'Todos' : (cursos.find(c => c.id === t.curso_id)?.tema || '...'),
    mesAplicacao: t.mes_aplicacao
  });

  // --- LEITURA DE DADOS (FETCH) ---

  const fetchData = async () => {
    setLoading(true);
    
    if (!supabase) {
      console.warn('Supabase não configurado. Usando dados Mock.');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Sincronizando dados com Supabase...');

      // 1. Professores
      const { data: profs } = await supabase.from('professores').select('*');
      if (profs) setProfessores(profs.map(mapProfessorFromDB));

      // 2. Vendedoras
      const { data: vends } = await supabase.from('vendedoras').select('*');
      if (vends) setVendedoras(vends.map(mapVendedoraFromDB));

      // 3. Cursos
      const { data: curs } = await supabase.from('cursos').select('*');
      if (curs) setCursos(curs.map(mapCursoFromDB));

      // 4. Leads
      const { data: lds } = await supabase.from('leads').select('*');
      if (lds) setLeads(lds.map(mapLeadFromDB));

      // 5. Taxas
      const { data: txs } = await supabase.from('taxas_comissao').select('*');
      if (txs) {
         // Mapeamento preliminar, nomes serão resolvidos na renderização
         setTaxasComissao(txs.map((t: any) => ({
            id: t.id,
            taxa: Number(t.taxa),
            tipo: t.tipo,
            vendedorId: t.vendedor_id,
            vendedorNome: 'Carregando...', 
            cursoId: t.curso_id,
            cursoNome: 'Carregando...',
            mesAplicacao: t.mes_aplicacao
         })));
      }

      // 6. Meta Global
      const { data: meta } = await supabase.from('metas_globais').select('*').limit(1).single();
      if (meta) {
         setMetaGlobal({
            periodo: meta.periodo as any,
            metaGlobalValor: Number(meta.valor_meta),
            descricao: meta.descricao,
            bonus1: meta.bonus_1_perc,
            bonus2: meta.bonus_2_perc,
            bonus3: meta.bonus_3_perc,
            bonusValor1: Number(meta.bonus_valor_1),
            bonusValor2: Number(meta.bonus_valor_2),
            bonusValor3: Number(meta.bonus_valor_3)
         });
      }

      // 7. Activity Logs
      const { data: logs } = await supabase.from('activity_logs').select('*').order('timestamp', { ascending: false }).limit(20);
      if (logs) {
         setActivities(logs.map((l: any) => ({
            id: l.id,
            type: l.type,
            message: l.message,
            details: l.details,
            author: l.author,
            timestamp: l.timestamp
         })));
      }

    } catch (error) {
      console.error('❌ Erro crítico ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- OPERAÇÕES DE ESCRITA (WRITE) ---

  const logActivity = async (type: ActivityLog['type'], message: string, details: string, author: string) => {
    const newLog = {
      type,
      message,
      details,
      author,
      timestamp: new Date().toISOString()
    };

    // Update Otimista
    setActivities(prev => [{ ...newLog, id: 'temp-' + Date.now() }, ...prev]);

    if (supabase) {
       await supabase.from('activity_logs').insert([newLog]);
    }
  };

  const addLead = async (lead: Lead) => {
    const payload = {
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
        observacoes: lead.observacoes,
        data_cadastro: lead.dataCadastro
    };

    if (supabase) {
       const { data, error } = await supabase.from('leads').insert([payload]).select().single();
       if (!error && data) {
          setLeads(prev => [...prev, mapLeadFromDB(data)]);
       } else {
          console.error('Erro ao salvar Lead:', error);
       }
    } else {
       setLeads(prev => [...prev, lead]);
    }
  };

  const updateLead = async (lead: Lead) => {
    const payload = {
        status: lead.status,
        valor_negociado: lead.valorNegociado,
        motivo_perda: lead.motivoPerda,
        // Adicione aqui outros campos que forem editáveis no futuro
    };

    if (supabase && lead.id.length > 10) { // Verifica se é UUID real
       const { error } = await supabase.from('leads').update(payload).eq('id', lead.id);
       if (error) console.error('Erro ao atualizar Lead:', error);
    }
    
    setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
  };

  const addCurso = async (curso: Curso) => {
    const payload = {
        tema: curso.tema,
        professor_id: curso.professorId,
        cidade: curso.cidade,
        estado: curso.estado,
        data_inicio: curso.dataInicio,
        data_fim: curso.dataFim,
        carga_horaria: curso.cargaHoraria,
        valor_inscricao: curso.valorInscricao,
        meta_faturamento: curso.metaFaturamento,
        status: curso.status,
        observacoes: curso.observacoes
    };

    if (supabase) {
       const { data, error } = await supabase.from('cursos').insert([payload]).select().single();
       if (!error && data) {
          setCursos(prev => [...prev, mapCursoFromDB(data)]);
       } else {
          console.error('Erro ao salvar Curso:', error);
       }
    } else {
       setCursos(prev => [...prev, curso]);
    }
  };

  const updateCurso = async (curso: Curso) => {
    const payload = {
        tema: curso.tema,
        cidade: curso.cidade,
        estado: curso.estado,
        data_inicio: curso.dataInicio,
        data_fim: curso.dataFim,
        carga_horaria: curso.cargaHoraria,
        valor_inscricao: curso.valorInscricao,
        meta_faturamento: curso.metaFaturamento,
        status: curso.status,
        professor_id: curso.professorId,
        observacoes: curso.observacoes
    };
    
    if (supabase && curso.id.length > 5) {
       await supabase.from('cursos').update(payload).eq('id', curso.id);
    }
    setCursos(prev => prev.map(c => c.id === curso.id ? curso : c));
  };

  const deleteCurso = async (id: string) => {
    if (supabase && id.length > 5) {
       await supabase.from('cursos').delete().eq('id', id);
    }
    setCursos(prev => prev.filter(c => c.id !== id));
  };

  const updateMetaGlobal = async (meta: MetaGlobal) => {
    const payload = {
        valor_meta: meta.metaGlobalValor,
        descricao: meta.descricao,
        bonus_1_perc: meta.bonus1,
        bonus_2_perc: meta.bonus2,
        bonus_3_perc: meta.bonus3,
        bonus_valor_1: meta.bonusValor1,
        bonus_valor_2: meta.bonusValor2,
        bonus_valor_3: meta.bonusValor3
    };

    if (supabase) {
        // Assume que só existe uma linha de meta global ou atualiza todas
        await supabase.from('metas_globais').update(payload).neq('id', '00000000-0000-0000-0000-000000000000'); 
    }
    setMetaGlobal(meta);
  };

  const addTaxaComissao = async (taxa: TaxaComissao) => {
     const payload = {
        taxa: taxa.taxa,
        tipo: taxa.tipo,
        vendedor_id: taxa.vendedorId,
        curso_id: taxa.cursoId,
        mes_aplicacao: taxa.mesAplicacao
     };

     if (supabase) {
        const { data, error } = await supabase.from('taxas_comissao').insert([payload]).select().single();
        if (!error && data) {
           setTaxasComissao(prev => [...prev, mapTaxaFromDB(data)]);
        }
     } else {
        setTaxasComissao(prev => [...prev, taxa]);
     }
  };

  const deleteTaxaComissao = async (id: string) => {
     if (supabase && id.length > 5) {
        await supabase.from('taxas_comissao').delete().eq('id', id);
     }
     setTaxasComissao(prev => prev.filter(t => t.id !== id));
  };

  const addNotification = async (n: Notificacao) => {
     setNotifications(prev => [n, ...prev]);
     if (supabase) {
        await supabase.from('notificacoes').insert([{
           titulo: n.titulo,
           mensagem: n.mensagem,
           tipo: n.tipo,
           data: n.data,
           lida: false
        }]);
     }
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
      addTaxaComissao,
      deleteTaxaComissao,
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
