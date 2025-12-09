
import { Curso, Lead, LeadStatus, Professor, StatusCurso, Vendedora, MetaGlobal, TaxaComissao } from './types';

export const ESTADOS_BRASIL = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export const PROFESSORES_MOCK: Professor[] = [
  { id: '1', nome: 'Dr. Cláudio Santos', especialidade: 'Direito Administrativo', email: 'claudio@cgp.com.br' },
  { id: '2', nome: 'Mestra Ana Paula', especialidade: 'Gestão de Pessoas', email: 'ana@cgp.com.br' },
  { id: '3', nome: 'Prof. Roberto Lima', especialidade: 'Finanças Públicas', email: 'roberto@cgp.com.br' },
  { id: '4', nome: 'Dra. Carla Mendes', especialidade: 'Licitações', email: 'carla@cgp.com.br' },
  { id: '5', nome: 'Prof. João Silva', especialidade: 'Contabilidade', email: 'joao@cgp.com.br' },
];

export const VENDEDORAS_MOCK: Vendedora[] = [
  { id: 'v1', nome: 'Ana', vendasTotais: 154000, metaIndividual: 120000, metaMensal: 15000, metaTrimestral: 45000, metaAnual: 180000, performance: 128, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana' },
  { id: 'v2', nome: 'Andreia', vendasTotais: 98000, metaIndividual: 120000, metaMensal: 37500, metaTrimestral: 112500, metaAnual: 450000, performance: 81, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andreia' },
  { id: 'v3', nome: 'Ariane', vendasTotais: 132000, metaIndividual: 120000, metaMensal: 15000, metaTrimestral: 45000, metaAnual: 180000, performance: 110, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ariane' },
  { id: 'v4', nome: 'Elaine', vendasTotais: 110000, metaIndividual: 120000, metaMensal: 37500, metaTrimestral: 112500, metaAnual: 450000, performance: 91, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elaine' },
  { id: 'v5', nome: 'Elis', vendasTotais: 180000, metaIndividual: 120000, metaMensal: 15000, metaTrimestral: 45000, metaAnual: 180000, performance: 150, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elis' },
  { id: 'v6', nome: 'Halana', vendasTotais: 85000, metaIndividual: 120000, metaMensal: 15000, metaTrimestral: 45000, metaAnual: 180000, performance: 70, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Halana' },
  { id: 'v7', nome: 'Larissa', vendasTotais: 125000, metaIndividual: 120000, metaMensal: 15000, metaTrimestral: 45000, metaAnual: 180000, performance: 104, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Larissa' },
  { id: 'v8', nome: 'Najara', vendasTotais: 145000, metaIndividual: 120000, metaMensal: 15000, metaTrimestral: 45000, metaAnual: 180000, performance: 120, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Najara' },
  { id: 'v9', nome: 'Viviane', vendasTotais: 165000, metaIndividual: 120000, metaMensal: 20000, metaTrimestral: 60000, metaAnual: 240000, performance: 137, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viviane' },
];

export const COMISSOES_MOCK: TaxaComissao[] = [
  { id: 'tx1', taxa: 5, vendedorId: 'todos', vendedorNome: 'Todos', cursoId: 'todos', cursoNome: 'Todos', tipo: 'Padrão' },
  { id: 'tx2', taxa: 7, vendedorId: 'v1', vendedorNome: 'Ana', cursoId: 'todos', cursoNome: 'Todos', tipo: 'Específica' },
  { id: 'tx3', taxa: 10, vendedorId: 'todos', vendedorNome: 'Todos', cursoId: 'c1', cursoNome: 'Nova Lei de Licitações 14.133', tipo: 'Específica' },
];

export const CURSOS_MOCK: Curso[] = [
  {
    id: 'c1',
    tema: 'Nova Lei de Licitações 14.133',
    professorId: '1',
    cidade: 'São Paulo',
    estado: 'SP',
    dataInicio: '2026-10-10',
    dataFim: '2026-10-12',
    cargaHoraria: 20,
    valorInscricao: 2500,
    metaFaturamento: 100000,
    faturamentoAtual: 112500,
    status: StatusCurso.Concluido,
    inscritos: 45
  },
  {
    id: 'c2',
    tema: 'Gestão Ágil no Setor Público',
    professorId: '2',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    dataInicio: '2026-11-05',
    dataFim: '2026-11-07',
    cargaHoraria: 24,
    valorInscricao: 2800,
    metaFaturamento: 80000,
    faturamentoAtual: 65000,
    status: StatusCurso.EmAndamento,
    inscritos: 23
  },
  {
    id: 'c3',
    tema: 'Auditoria e Controle Interno',
    professorId: '3',
    cidade: 'Brasília',
    estado: 'DF',
    dataInicio: '2026-12-01',
    dataFim: '2026-12-03',
    cargaHoraria: 16,
    valorInscricao: 3000,
    metaFaturamento: 150000,
    faturamentoAtual: 155000,
    status: StatusCurso.Agendado,
    inscritos: 52
  },
  {
    id: 'c4',
    tema: 'Contratos Administrativos',
    professorId: '1',
    cidade: 'Salvador',
    estado: 'BA',
    dataInicio: '2026-09-15',
    dataFim: '2026-09-17',
    cargaHoraria: 20,
    valorInscricao: 2200,
    metaFaturamento: 90000,
    faturamentoAtual: 95000,
    status: StatusCurso.Concluido,
    inscritos: 43
  },
  {
    id: 'c5',
    tema: 'Liderança para Gestores Públicos',
    professorId: '2',
    cidade: 'Belo Horizonte',
    estado: 'MG',
    dataInicio: '2026-11-20',
    dataFim: '2026-11-22',
    cargaHoraria: 20,
    valorInscricao: 2400,
    metaFaturamento: 85000,
    faturamentoAtual: 32000,
    status: StatusCurso.Agendado,
    inscritos: 13
  },
  {
    id: 'c6',
    tema: 'Gestão de Projetos Públicos',
    professorId: '2',
    cidade: 'Curitiba',
    estado: 'PR',
    dataInicio: '2026-11-25',
    dataFim: '2026-11-27',
    cargaHoraria: 16,
    valorInscricao: 2000,
    metaFaturamento: 60000,
    faturamentoAtual: 58000,
    status: StatusCurso.Agendado,
    inscritos: 29
  },
  {
    id: 'c7',
    tema: 'Compliance no Setor Público',
    professorId: '3',
    cidade: 'Recife',
    estado: 'PE',
    dataInicio: '2026-10-01',
    dataFim: '2026-10-03',
    cargaHoraria: 24,
    valorInscricao: 3000,
    metaFaturamento: 120000,
    faturamentoAtual: 130000,
    status: StatusCurso.Concluido,
    inscritos: 44
  }
];

export const LEADS_MOCK: Lead[] = [
  { 
    id: 'l1', 
    nome: 'Carlos Silva', 
    empresa: 'Prefeitura de Osasco', 
    cargo: 'Secretário Adjunto', 
    cidade: 'Osasco', 
    estado: 'SP', 
    email: 'carlos@osasco.sp.gov.br', 
    telefone: '11999999999', 
    interesse: 'Nova Lei de Licitações', 
    status: LeadStatus.PropostaEnviada, 
    valorPotencial: 30000, 
    valorNegociado: 30000,
    quantidadeInscricoes: 12,
    cursoId: 'c1',
    responsavelId: 'v5', // Elis
    dataCadastro: '2026-10-01' 
  },
  { 
    id: 'l2', 
    nome: 'Amanda Oliveira', 
    empresa: 'Câmara Municipal de Curitiba', 
    cargo: 'Diretora Legislativa', 
    cidade: 'Curitiba', 
    estado: 'PR', 
    email: 'amanda@cmc.pr.gov.br', 
    telefone: '41988888888', 
    interesse: 'Gestão Ágil', 
    status: LeadStatus.EmAnalise, 
    valorPotencial: 5600, 
    valorNegociado: 5000,
    quantidadeInscricoes: 2,
    cursoId: 'c2',
    responsavelId: 'v2', 
    dataCadastro: '2026-10-02' 
  },
  { 
    id: 'l3', 
    nome: 'Roberto Souza', 
    empresa: 'Secretaria de Saúde - PE', 
    cargo: 'Auditor Fiscal', 
    cidade: 'Recife', 
    estado: 'PE', 
    email: 'roberto@saude.pe.gov.br', 
    telefone: '81977777777', 
    interesse: 'Auditoria', 
    status: LeadStatus.Inscrito, 
    valorPotencial: 59940, 
    valorNegociado: 55000,
    quantidadeInscricoes: 20,
    cursoId: 'c3',
    responsavelId: 'v3', // Ariane
    dataCadastro: '2026-09-28' 
  },
  { 
    id: 'l4', 
    nome: 'Julia Costa', 
    empresa: 'Tribunal de Contas - GO', 
    cargo: 'Analista de Controle', 
    cidade: 'Goiânia', 
    estado: 'GO', 
    email: 'julia@tce.go.gov.br', 
    telefone: '62966666666', 
    interesse: 'Contratos', 
    status: LeadStatus.PropostaEnviada, 
    valorPotencial: 4400, 
    valorNegociado: 4000,
    quantidadeInscricoes: 2,
    cursoId: 'c4',
    responsavelId: 'v1', 
    dataCadastro: '2026-10-05' 
  },
  { 
    id: 'l5', 
    nome: 'Marcos Pereira', 
    empresa: 'Prefeitura de Manaus', 
    cargo: 'Gerente de Projetos', 
    cidade: 'Manaus', 
    estado: 'AM', 
    email: 'marcos@manaus.am.gov.br', 
    telefone: '92955555555', 
    interesse: 'Liderança', 
    status: LeadStatus.Declinado, 
    valorPotencial: 2400, 
    valorNegociado: 0,
    quantidadeInscricoes: 1,
    cursoId: 'c5',
    responsavelId: 'v4', 
    dataCadastro: '2026-10-03',
    motivoPerda: 'Sem orçamento para este exercício.'
  },
];

export const META_GLOBAL_MOCK: MetaGlobal = {
  periodo: 'Anual',
  metaGlobalValor: 2000000,
  descricao: 'Meta agressiva para expansão em capitais do Nordeste e Sul.',
  bonus1: 100,
  bonus2: 120,
  bonus3: 150,
  bonusValor1: 1000,
  bonusValor2: 2500,
  bonusValor3: 5000
};
