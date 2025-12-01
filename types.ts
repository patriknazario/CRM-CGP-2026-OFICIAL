
export enum StatusCurso {
  Agendado = 'Agendado',
  EmAndamento = 'Em Andamento',
  Concluido = 'Concluído',
  Cancelado = 'Cancelado'
}

export enum LeadStatus {
  PropostaEnviada = 'Proposta Enviada',
  EmAnalise = 'Em Análise',
  Inscrito = 'Inscrito',
  Declinado = 'Declinado'
}

export interface Professor {
  id: string;
  nome: string;
  especialidade: string;
  linkedin?: string;
  instagram?: string;
  email: string;
  bio?: string;
}

export interface Curso {
  id: string;
  tema: string;
  professorId: string;
  cidade: string;
  estado: string;
  dataInicio: string;
  dataFim: string;
  cargaHoraria: number;
  valorInscricao: number;
  metaFaturamento: number;
  faturamentoAtual: number;
  status: StatusCurso;
  observacoes?: string;
  inscritos: number;
}

export interface Vendedora {
  id: string;
  nome: string;
  vendasTotais: number;
  metaIndividual: number; // Mantido para compatibilidade
  metaMensal: number;
  metaTrimestral: number;
  metaAnual: number;
  avatar: string;
  performance: number; // 0-100
}

export interface Lead {
  id: string;
  nome: string;
  empresa: string; // Nome do Órgão Público
  cargo?: string; // Cargo do servidor
  cidade?: string;
  estado?: string;
  email: string;
  telefone: string;
  interesse: string;
  status: LeadStatus;
  valorPotencial: number; // Valor de Tabela (Padrão)
  responsavelId: string;
  dataCadastro: string;
  observacoes?: string;
  
  // Campos para Proposta Comercial (CPQ)
  cursoId?: string;
  quantidadeInscricoes?: number;
  valorNegociado?: number; // Valor Real Fechado
  
  // Motivo de Perda
  motivoPerda?: string;
}

export interface MetaGlobal {
  periodo: 'Bimestral' | 'Trimestral' | 'Semestral' | 'Anual';
  metaGlobalValor: number;
  descricao?: string;
  bonus1: number; // % atingimento
  bonus2: number; // % atingimento
  bonus3: number; // % atingimento
  bonusValor1: number; // R$
  bonusValor2: number; // R$
  bonusValor3: number; // R$
}

export interface TaxaComissao {
  id: string;
  taxa: number; // Porcentagem (ex: 5)
  vendedorId: string; // 'todos' ou ID específico
  vendedorNome: string;
  cursoId: string; // 'todos' ou ID específico
  cursoNome: string;
  tipo: 'Padrão' | 'Específica';
  mesAplicacao?: string;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'warning' | 'urgent';
  data: string;
  lida: boolean;
}

export interface ActivityLog {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  message: string;
  details: string;
  author: string;
  timestamp: string;
}