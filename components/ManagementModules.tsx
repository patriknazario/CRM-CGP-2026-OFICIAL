
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CURSOS_MOCK, PROFESSORES_MOCK, ESTADOS_BRASIL, VENDEDORAS_MOCK, COMISSOES_MOCK } from '../constants';
import { Curso, StatusCurso, Notificacao, Professor, TaxaComissao, Vendedora, MetaGlobal } from '../types';
import { Edit2, Save, Plus, Calendar, MapPin, DollarSign, Target, AlertTriangle, X, Trash2, Check, Clock, Bell, Send, Info, ChevronDown, Linkedin, Instagram, User, Mail, FileText, Globe, Users, TrendingUp, Award, BarChart, Percent, Layers } from 'lucide-react';
import { shouldShowViabilityAlert, getDaysUntil } from '../utils/calculations';
import { useData } from '../contexts/DataContext';

// --- COURSE MODAL COMPONENT ---
interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Curso) => void;
  onDelete: (id: string) => void;
  initialData: Curso | null;
}

const CourseFormModal: React.FC<CourseFormModalProps> = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
  const [formData, setFormData] = useState<Partial<Curso>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        tema: '',
        cidade: '',
        estado: 'SP',
        dataInicio: '',
        dataFim: '',
        cargaHoraria: 16,
        valorInscricao: 0,
        metaFaturamento: 0,
        faturamentoAtual: 0,
        inscritos: 0,
        status: StatusCurso.Agendado,
        professorId: PROFESSORES_MOCK[0]?.id || '',
        observacoes: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tema || !formData.dataInicio) return;

    const courseToSave = {
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9),
    } as Curso;

    onSave(courseToSave);
  };

  const handleChange = (field: keyof Curso, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 flex justify-between items-center shrink-0">
          <h3 className="text-white text-lg font-bold flex items-center">
            {initialData ? <Edit2 className="w-4 h-4 mr-2 text-pink-400" /> : <Plus className="w-4 h-4 mr-2 text-pink-400" />}
            {initialData ? 'Editar Curso' : 'Novo Curso'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="course-form" onSubmit={handleSubmit} className="space-y-6">

            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-pink-600 uppercase tracking-wider border-b border-pink-100 pb-1">Informações Principais</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tema do Curso</label>
                  <input
                    type="text"
                    value={formData.tema}
                    onChange={(e) => handleChange('tema', e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-slate-900"
                    placeholder="Ex: Nova Lei de Licitações"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Professor Responsável</label>
                  <div className="relative">
                    <select
                      value={formData.professorId}
                      onChange={(e) => handleChange('professorId', e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none appearance-none text-slate-900"
                    >
                      {PROFESSORES_MOCK.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none appearance-none text-slate-900"
                    >
                      {Object.values(StatusCurso).map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Location & Date */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider border-b border-indigo-100 pb-1">Logística</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={formData.cidade}
                    onChange={(e) => handleChange('cidade', e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <div className="relative">
                    <select
                      value={formData.estado}
                      onChange={(e) => handleChange('estado', e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none appearance-none text-slate-900"
                    >
                      {ESTADOS_BRASIL.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Início</label>
                  <input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => handleChange('dataInicio', e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data Fim</label>
                  <input
                    type="date"
                    value={formData.dataFim}
                    onChange={(e) => handleChange('dataFim', e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Carga Horária (h)</label>
                  <input
                    type="number"
                    value={formData.cargaHoraria}
                    onChange={(e) => handleChange('cargaHoraria', Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Financial */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider border-b border-green-100 pb-1">Financeiro & Metas</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor Inscrição</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">R$</span>
                    <input
                      type="number"
                      value={formData.valorInscricao}
                      onChange={(e) => handleChange('valorInscricao', Number(e.target.value))}
                      className="w-full pl-8 p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meta Faturamento</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">R$</span>
                    <input
                      type="number"
                      value={formData.metaFaturamento}
                      onChange={(e) => handleChange('metaFaturamento', Number(e.target.value))}
                      className="w-full pl-8 p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Faturado (Atual)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm">R$</span>
                    <input
                      type="number"
                      value={formData.faturamentoAtual}
                      onChange={(e) => handleChange('faturamentoAtual', Number(e.target.value))}
                      className="w-full pl-8 p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Inscritos</label>
                  <input
                    type="number"
                    value={formData.inscritos}
                    onChange={(e) => handleChange('inscritos', Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Observations */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
              <textarea
                value={formData.observacoes || ''}
                onChange={(e) => handleChange('observacoes', e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none h-20 resize-none text-slate-900"
                placeholder="Detalhes adicionais sobre o curso..."
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          {initialData ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Tem certeza que deseja excluir este curso?')) {
                  if (initialData.id) onDelete(initialData.id);
                }
              }}
              className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center px-3 py-2 rounded hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Excluir
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="course-form"
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-bold shadow-md shadow-pink-500/30 hover:shadow-lg hover:scale-105 transition-all flex items-center"
            >
              <Save className="w-4 h-4 mr-2" /> Salvar Curso
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- PROFESSOR MODAL COMPONENT ---
interface ProfessorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (professor: Professor) => void;
  onDelete: (id: string) => void;
  initialData: Professor | null;
}

const ProfessorFormModal: React.FC<ProfessorFormModalProps> = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
  const [formData, setFormData] = useState<Partial<Professor>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      setFormData({
        nome: '',
        especialidade: '',
        email: '',
        linkedin: '',
        instagram: '',
        bio: ''
      });
    }
  }, [initialData, isOpen]);

  const handleDeleteClick = () => {
    if (window.confirm('Tem certeza que deseja remover este professor?')) {
      if (initialData && initialData.id) {
        onDelete(initialData.id);
      }
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profToSave = {
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9),
    } as Professor;
    onSave(profToSave);
  };

  const handleChange = (field: keyof Professor, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 flex justify-between items-center shrink-0">
          <h3 className="text-white text-lg font-bold flex items-center">
            {initialData ? <Edit2 className="w-4 h-4 mr-2 text-pink-400" /> : <Plus className="w-4 h-4 mr-2 text-pink-400" />}
            {initialData ? 'Editar Professor' : 'Novo Professor'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="professor-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.nome}
                  onChange={e => handleChange('nome', e.target.value)}
                  required
                  className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                  placeholder="Ex: Dr. Cláudio Santos"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Especialidade</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={formData.especialidade}
                  onChange={e => handleChange('especialidade', e.target.value)}
                  required
                  className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                  placeholder="Ex: Direito Administrativo"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  required
                  className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                  placeholder="email@cgp.com.br"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn (URL)</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.linkedin || ''}
                    onChange={e => handleChange('linkedin', e.target.value)}
                    className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                    placeholder="linkedin.com/in/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Instagram (@)</label>
                <div className="relative">
                  <Instagram className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.instagram || ''}
                    onChange={e => handleChange('instagram', e.target.value)}
                    className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none text-slate-900"
                    placeholder="@perfil"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mini Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={e => handleChange('bio', e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none h-24 resize-none text-slate-900"
                placeholder="Breve descrição do professor..."
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          {initialData ? (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center px-3 py-2 rounded hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Excluir
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="professor-form"
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-bold shadow-md shadow-pink-500/30 hover:scale-105 transition-all flex items-center"
            >
              <Save className="w-4 h-4 mr-2" /> Salvar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- SELLER GOAL MODAL ---
interface SellerGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSeller: Vendedora) => void;
  seller: Vendedora | null;
}

const SellerGoalModal: React.FC<SellerGoalModalProps> = ({ isOpen, onClose, onSave, seller }) => {
  const [formData, setFormData] = useState<Partial<Vendedora>>({});

  useEffect(() => {
    if (seller) {
      setFormData({ ...seller });
    }
  }, [seller, isOpen]);

  if (!isOpen || !seller) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...seller, ...formData } as Vendedora);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 to-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={seller.avatar} alt={seller.nome} className="w-10 h-10 rounded-full border-2 border-white/20" />
            <div>
              <h3 className="text-white text-lg font-bold">Metas: {seller.nome}</h3>
              <p className="text-indigo-200 text-xs">Definição de objetivos individuais</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form id="seller-goal-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Meta Mensal (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">R$</span>
                <input
                  type="number"
                  value={formData.metaMensal || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaMensal: Number(e.target.value) }))}
                  className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Meta Trimestral (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">R$</span>
                <input
                  type="number"
                  value={formData.metaTrimestral || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTrimestral: Number(e.target.value) }))}
                  className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Meta Anual (R$)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">R$</span>
                <input
                  type="number"
                  value={formData.metaAnual || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaAnual: Number(e.target.value) }))}
                  className="w-full pl-9 p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
            }}
            form="seller-goal-form"
            className="px-6 py-2 bg-pink-600 text-white rounded-lg font-bold shadow-md hover:bg-pink-700 transition-all flex items-center"
          >
            <Save className="w-4 h-4 mr-2" /> Salvar Metas
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- COMMISSION RATE MODAL ---
interface CommissionRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taxa: TaxaComissao) => void;
}

const CommissionRateModal: React.FC<CommissionRateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [vendedorId, setVendedorId] = useState('todos');
  const [taxa, setTaxa] = useState(5);
  const [applyType, setApplyType] = useState<'course' | 'month'>('course');
  const [targetId, setTargetId] = useState('todos'); // Course ID or Month Name

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isSpecific = vendedorId !== 'todos' || targetId !== 'todos';

    const newTaxa: TaxaComissao = {
      id: Date.now().toString(),
      taxa,
      vendedorId,
      vendedorNome: vendedorId === 'todos' ? 'Todos' : VENDEDORAS_MOCK.find(v => v.id === vendedorId)?.nome || 'Desconhecido',
      tipo: isSpecific ? 'Específica' : 'Padrão',
      cursoId: applyType === 'course' ? targetId : 'todos',
      cursoNome: applyType === 'course' ? (targetId === 'todos' ? 'Todos' : CURSOS_MOCK.find(c => c.id === targetId)?.tema || 'Desconhecido') : 'Todos',
      mesAplicacao: applyType === 'month' ? targetId : undefined
    };

    onSave(newTaxa);
    // Reset defaults
    setVendedorId('todos');
    setTaxa(5);
    setApplyType('course');
    setTargetId('todos');
  };

  return createPortal(
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
        <div className="px-6 py-4 bg-gradient-to-r from-pink-600 to-purple-600 flex justify-between items-center">
          <h3 className="text-white text-lg font-bold flex items-center">
            <Plus className="w-5 h-5 mr-2" /> Nova Taxa de Comissão
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form id="commission-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Vendedora</label>
              <div className="relative">
                <select
                  value={vendedorId}
                  onChange={e => setVendedorId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-pink-500 outline-none appearance-none"
                >
                  <option value="todos">Todas as Vendedoras</option>
                  {VENDEDORAS_MOCK.map(v => (
                    <option key={v.id} value={v.id}>{v.nome}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Taxa de Comissão (%)</label>
              <div className="relative">
                <input
                  type="number"
                  value={taxa}
                  onChange={e => setTaxa(Number(e.target.value))}
                  min="0"
                  step="0.1"
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                />
                <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Aplicação</label>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => { setApplyType('course'); setTargetId('todos'); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${applyType === 'course' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Por Curso
                </button>
                <button
                  type="button"
                  onClick={() => { setApplyType('month'); setTargetId(months[0]); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${applyType === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Por Mês (Sazonal)
                </button>
              </div>
            </div>

            {applyType === 'course' ? (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Curso Específico</label>
                <div className="relative">
                  <select
                    value={targetId}
                    onChange={e => setTargetId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-pink-500 outline-none appearance-none"
                  >
                    <option value="todos">Todos os Cursos (Padrão)</option>
                    {CURSOS_MOCK.map(c => (
                      <option key={c.id} value={c.id}>{c.tema}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mês de Aplicação</label>
                <div className="relative">
                  <select
                    value={targetId}
                    onChange={e => setTargetId(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-pink-500 outline-none appearance-none"
                  >
                    {months.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="commission-form"
            className="px-6 py-2 bg-pink-600 text-white rounded-lg font-bold shadow-md hover:bg-pink-700 transition-all flex items-center"
          >
            <Save className="w-4 h-4 mr-2" /> Salvar Taxa
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// --- COURSES MANAGEMENT VIEW ---
export const CoursesMgmtView: React.FC = () => {
  const { cursos: courses, addCurso, updateCurso, deleteCurso } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Curso | null>(null);

  const handleEdit = (course: Curso) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleSave = async (course: Curso) => {
    if (editingCourse) {
      // Update
      await updateCurso(course);
    } else {
      // Create
      await addCurso(course);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    await deleteCurso(id);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gerenciar Cursos</h2>
          <p className="text-slate-500 text-sm">Total de {courses.length} cursos cadastrados</p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg font-medium shadow-md shadow-pink-500/20 hover:bg-pink-700 transition-all flex items-center transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Curso
        </button>
      </div>

      <div className="grid gap-4">
        {courses.map((curso) => {
          const showAlert = shouldShowViabilityAlert(curso.inscritos, curso.dataInicio) && curso.status === StatusCurso.Agendado;
          const daysUntil = getDaysUntil(curso.dataInicio);
          const professor = PROFESSORES_MOCK.find(p => p.id === curso.professorId)?.nome || 'Professor não atribuído';

          return (
            <div
              key={curso.id}
              className={`bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-lg hover:border-pink-200 group relative ${showAlert ? 'border-2 border-amber-500' : 'border border-slate-200'
                }`}
            >
              {showAlert && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2 animate-pulse">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-bold text-amber-800">Atenção: Viabilidade em risco!</p>
                    <p className="text-amber-700">
                      Apenas <span className="font-bold">{curso.inscritos}</span> inscrições confirmadas.
                      Início em {daysUntil} {daysUntil === 1 ? 'dia' : 'dias'}.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${curso.status === StatusCurso.Concluido ? 'bg-green-100 text-green-600' :
                      curso.status === StatusCurso.EmAndamento ? 'bg-blue-100 text-blue-600' :
                        curso.status === StatusCurso.Cancelado ? 'bg-red-100 text-red-600' :
                          'bg-pink-100 text-pink-600'
                    }`}>
                    {curso.status === StatusCurso.Concluido ? <Check className="w-6 h-6" /> :
                      curso.status === StatusCurso.Cancelado ? <X className="w-6 h-6" /> :
                        curso.status === StatusCurso.EmAndamento ? <Clock className="w-6 h-6" /> :
                          <Calendar className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider mb-1 block px-2 py-0.5 rounded w-fit ${curso.status === StatusCurso.Concluido ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                      {curso.status}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800">{curso.tema}</h3>
                    <p className="text-sm text-slate-500">Prof. {professor}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(curso)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-pink-500 rounded-lg transition-all shadow-sm"
                  title="Editar Curso"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-6 pt-4 border-t border-slate-50">
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-2 text-pink-400" />
                  {curso.cidade}/{curso.estado}
                </div>
                <div className="flex items-center text-slate-600">
                  <Calendar className="w-4 h-4 mr-2 text-pink-400" />
                  {new Date(curso.dataInicio).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center text-slate-600">
                  <DollarSign className="w-4 h-4 mr-2 text-pink-400" />
                  R$ {curso.valorInscricao.toLocaleString()}
                </div>
                <div className="flex items-center text-slate-600">
                  <Target className="w-4 h-4 mr-2 text-pink-400" />
                  Meta: R$ {curso.metaFaturamento.toLocaleString()}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="w-full mr-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Faturamento Realizado</span>
                    <span className="font-bold text-slate-700">{Math.round((curso.faturamentoAtual / curso.metaFaturamento) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min((curso.faturamentoAtual / curso.metaFaturamento) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600 whitespace-nowrap">
                  {curso.inscritos} Inscritos
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={editingCourse}
      />
    </div>
  );
};

// --- PROFESSORS MANAGEMENT ---
export const ProfessorsMgmtView: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>(PROFESSORES_MOCK);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);

  const handleEdit = (prof: Professor) => {
    setEditingProfessor(prof);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setEditingProfessor(null);
    setIsModalOpen(true);
  };

  const handleSave = (prof: Professor) => {
    if (editingProfessor) {
      setProfessors(professors.map(p => p.id === prof.id ? prof : p));
    } else {
      setProfessors([...professors, prof]);
    }
    setIsModalOpen(false);
  };

  // Função para deletar um professor (usando callback funcional para evitar state stale)
  const handleDelete = (id: string) => {
    setProfessors(prevProfessors => prevProfessors.filter(p => p.id !== id));
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Corpo Docente</h2>
        <button
          onClick={handleNew}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 flex items-center transition-transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Professor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {professors.map((prof) => (
          <div key={prof.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center hover:border-pink-300 transition-colors group relative">
            <div className="w-24 h-24 bg-slate-100 rounded-full mb-4 overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
              <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${prof.nome}`} alt={prof.nome} className="w-full h-full" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{prof.nome}</h3>
            <p className="text-pink-600 text-sm font-medium mb-4">{prof.especialidade}</p>

            <div className="w-full space-y-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg mb-4">
              <p className="flex items-center justify-center gap-2"><Mail className="w-3 h-3" /> {prof.email}</p>
              {(prof.linkedin || prof.instagram) && (
                <div className="flex justify-center gap-3 mt-2">
                  {prof.linkedin && <Linkedin className="w-4 h-4 text-blue-600 cursor-pointer" />}
                  {prof.instagram && <Instagram className="w-4 h-4 text-pink-600 cursor-pointer" />}
                </div>
              )}
            </div>

            <button
              onClick={() => handleEdit(prof)}
              className="w-full py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center"
            >
              <Edit2 className="w-3 h-3 mr-2" /> Editar Perfil
            </button>
          </div>
        ))}
      </div>

      <ProfessorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        initialData={editingProfessor}
      />
    </div>
  );
};

// --- GOALS & BONUSES MANAGEMENT ---
interface GoalsMgmtViewProps {
  metaGlobal: MetaGlobal;
  onUpdateMeta: (meta: MetaGlobal) => void;
}

export const GoalsMgmtView: React.FC<GoalsMgmtViewProps> = ({ metaGlobal, onUpdateMeta }) => {
  const [activeSubTab, setActiveSubTab] = useState<'global' | 'vendedores' | 'comissoes'>('global');
  const [vendedores, setVendedores] = useState<Vendedora[]>(VENDEDORAS_MOCK);
  const [taxas, setTaxas] = useState<TaxaComissao[]>(COMISSOES_MOCK);

  // State for Seller Editing
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Vendedora | null>(null);

  // State for Commission Modal
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);

  // Totals for "Metas por Vendedor"
  const totalMetasIndividuais = vendedores.reduce((acc, v) => acc + v.metaAnual, 0);

  // Mock handler for deleting a commission rate
  const handleDeleteRate = (id: string) => {
    setTaxas(prev => prev.filter(t => t.id !== id));
  };

  const handleAddRate = (taxa: TaxaComissao) => {
    setTaxas([...taxas, taxa]);
    setIsCommissionModalOpen(false);
  };

  const handleEditSeller = (seller: Vendedora) => {
    setEditingSeller(seller);
    setIsSellerModalOpen(true);
  };

  const handleUpdateSellerGoal = (updatedSeller: Vendedora) => {
    setVendedores(prev => prev.map(v => v.id === updatedSeller.id ? updatedSeller : v));
    setIsSellerModalOpen(false);
    setEditingSeller(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Sub-Navigation Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('global')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeSubTab === 'global' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Target className="w-4 h-4" /> Meta Global
        </button>
        <button
          onClick={() => setActiveSubTab('vendedores')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeSubTab === 'vendedores' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Users className="w-4 h-4" /> Metas por Vendedor
        </button>
        <button
          onClick={() => setActiveSubTab('comissoes')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeSubTab === 'comissoes' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <TrendingUp className="w-4 h-4" /> Comissões
        </button>
      </div>

      {/* --- CONTENT AREA --- */}

      {/* 1. Global Goal View */}
      {activeSubTab === 'global' && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Visual Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-slate-700" />
                <h2 className="text-xl font-bold text-slate-800">Meta Global 2026</h2>
              </div>
              <p className="text-slate-500 mb-6">Objetivo anual da empresa</p>

              <div className="text-5xl font-black text-slate-800 tracking-tight mb-8">
                R$ {metaGlobal.metaGlobalValor.toLocaleString('pt-BR')}
              </div>

              {/* Progress Bar Mock */}
              <div className="relative pt-6 mb-8">
                <div className="flex justify-between text-sm mb-2 text-slate-500 font-medium">
                  <span>R$ 0</span>
                  <span>Meta: R$ {metaGlobal.metaGlobalValor.toLocaleString('pt-BR')}</span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-200 w-0"></div>
                </div>
                <p className="mt-2 text-sm text-slate-400">Realizado: R$ 0 (0%)</p>
              </div>

              {/* Monthly/Quarterly Breakdown */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Meta Mensal</p>
                  <p className="text-lg font-bold text-slate-700">R$ {(metaGlobal.metaGlobalValor / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Meta Trimestral</p>
                  <p className="text-lg font-bold text-slate-700">R$ {(metaGlobal.metaGlobalValor / 4).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Editar Meta Global</h2>
              <p className="text-slate-500 mb-8 text-sm">Altere o valor e a descrição da meta</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Meta Anual (R$)</label>
                  <input
                    type="number"
                    value={metaGlobal.metaGlobalValor}
                    onChange={(e) => onUpdateMeta({ ...metaGlobal, metaGlobalValor: Number(e.target.value) })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 font-mono text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Descrição</label>
                  <textarea
                    value={metaGlobal.descricao || ''}
                    onChange={(e) => onUpdateMeta({ ...metaGlobal, descricao: e.target.value })}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 h-32 resize-none"
                    placeholder="Descreva o significado ou recompensas ao atingir a meta..."
                  />
                </div>

                <button className="w-full py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-md shadow-pink-500/20">
                  Atualizar Meta
                </button>
              </div>
            </div>
          </div>

          {/* Bonus Rules Section - Restored */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Award className="w-6 h-6 text-yellow-500" />
              <div>
                <h2 className="text-xl font-bold text-slate-800">Regras de Bônus</h2>
                <p className="text-slate-500 text-sm">Escala progressiva de premiação (Meta Global)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {/* Level 1 */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-yellow-200 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nível 1</span>
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">% Atingimento</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={metaGlobal.bonus1}
                        onChange={(e) => onUpdateMeta({ ...metaGlobal, bonus1: Number(e.target.value) })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                      <span className="absolute right-3 top-2 text-slate-400 text-xs font-bold">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Valor Bônus (R$)</label>
                    <input
                      type="number"
                      value={metaGlobal.bonusValor1}
                      onChange={(e) => onUpdateMeta({ ...metaGlobal, bonusValor1: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Level 2 */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-yellow-300 transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Nível 2</span>
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">% Atingimento</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={metaGlobal.bonus2}
                        onChange={(e) => onUpdateMeta({ ...metaGlobal, bonus2: Number(e.target.value) })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                      <span className="absolute right-3 top-2 text-slate-400 text-xs font-bold">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Valor Bônus (R$)</label>
                    <input
                      type="number"
                      value={metaGlobal.bonusValor2}
                      onChange={(e) => onUpdateMeta({ ...metaGlobal, bonusValor2: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Level 3 */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-pink-300 transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600"></div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">Nível 3 (Máximo)</span>
                  <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">% Atingimento</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={metaGlobal.bonus3}
                        onChange={(e) => onUpdateMeta({ ...metaGlobal, bonus3: Number(e.target.value) })}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                      />
                      <span className="absolute right-3 top-2 text-slate-400 text-xs font-bold">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">Valor Bônus (R$)</label>
                    <input
                      type="number"
                      value={metaGlobal.bonusValor3}
                      onChange={(e) => onUpdateMeta({ ...metaGlobal, bonusValor3: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all flex items-center">
                <Save className="w-4 h-4 mr-2" /> Atualizar Regras de Bônus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Sellers Goals View */}
      {activeSubTab === 'vendedores' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          {/* Header Summary */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Metas por Vendedor - 2026</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-500 text-sm">Total das metas individuais:</span>
                <span className="font-bold text-slate-800">R$ {totalMetasIndividuais.toLocaleString('pt-BR')}</span>
                <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-xs font-bold">{vendedores.length} vendedoras cadastradas</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Vendedor</th>
                  <th className="px-6 py-4 text-center">Meta Mensal</th>
                  <th className="px-6 py-4 text-center">Meta Trimestral</th>
                  <th className="px-6 py-4 text-center">Meta Anual</th>
                  <th className="px-6 py-4 text-center">% Da Meta Global</th>
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendedores.map((v) => {
                  const percentOfGlobal = Math.round((v.metaAnual / metaGlobal.metaGlobalValor) * 100);
                  return (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{v.nome}</td>
                      <td className="px-6 py-4 text-center text-slate-600">R$ {v.metaMensal.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center text-slate-600">R$ {v.metaTrimestral.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center text-slate-600">R$ {v.metaAnual.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold border border-slate-200">
                          {percentOfGlobal}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSeller(v);
                          }}
                          className="p-2 text-slate-400 hover:text-pink-600 transition-colors bg-transparent hover:bg-pink-50 rounded-lg"
                          title="Editar Metas"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Commissions View */}
      {activeSubTab === 'comissoes' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Taxas de Comissão</h2>
              <p className="text-slate-500 text-sm">Configure as taxas de comissão padrão e específicas</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsCommissionModalOpen(true);
              }}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700 transition-colors flex items-center shadow-md shadow-pink-500/20"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar Taxa
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Taxa</th>
                  <th className="px-6 py-4">Vendedor</th>
                  <th className="px-6 py-4">Aplicável A</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {taxas.map((taxa) => (
                  <tr key={taxa.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{taxa.taxa}%</td>
                    <td className="px-6 py-4 text-slate-600">{taxa.vendedorNome}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {taxa.mesAplicacao ? (
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-indigo-500" /> {taxa.mesAplicacao}</span>
                      ) : (
                        <span>{taxa.cursoNome}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${taxa.tipo === 'Padrão' ? 'bg-slate-700' : 'bg-indigo-500'}`}>
                        {taxa.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteRate(taxa.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Seller Goal Modal */}
      <SellerGoalModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        onSave={handleUpdateSellerGoal}
        seller={editingSeller}
      />

      {/* Commission Rate Modal */}
      <CommissionRateModal
        isOpen={isCommissionModalOpen}
        onClose={() => setIsCommissionModalOpen(false)}
        onSave={handleAddRate}
      />

    </div>
  );
};

// --- NOTIFICATIONS MANAGEMENT ---
interface NotificationsMgmtProps {
  notifications: Notificacao[];
  onAdd: (n: Notificacao) => void;
  onDelete: (id: string) => void;
}

export const NotificationsMgmtView: React.FC<NotificationsMgmtProps> = ({ notifications, onAdd, onDelete }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'urgent'>('info');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const newNotif: Notificacao = {
      id: Date.now().toString(),
      titulo: title,
      mensagem: message,
      tipo: type,
      data: new Date().toISOString(),
      lida: false
    };

    onAdd(newNotif);
    setTitle('');
    setMessage('');
    setType('info');
    alert('Aviso enviado com sucesso!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Avisos Gerais</h2>
        <p className="text-slate-500">Envie comunicados importantes para o painel de todas as vendedoras.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
              <Send className="w-5 h-5 mr-2 text-pink-500" /> Novo Comunicado
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-slate-900"
                  placeholder="Resumo do aviso..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prioridade</label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none appearance-none text-slate-900"
                  >
                    <option value="info">Informativo (Azul)</option>
                    <option value="warning">Atenção (Amarelo)</option>
                    <option value="urgent">Urgente (Vermelho)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none h-32 resize-none text-slate-900"
                  placeholder="Escreva a mensagem completa aqui..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Enviar Aviso
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Avisos Ativos */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-lg text-slate-800 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-indigo-500" /> Avisos Ativos ({notifications.length})
          </h3>

          {notifications.length === 0 ? (
            <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200 border-dashed">
              <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">Nenhum aviso ativo no momento.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-start hover:border-pink-200 transition-colors">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${notif.tipo === 'urgent' ? 'bg-red-100 text-red-600' :
                        notif.tipo === 'warning' ? 'bg-amber-100 text-amber-600' :
                          'bg-blue-100 text-blue-600'
                      }`}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800">{notif.titulo}</h4>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${notif.tipo === 'urgent' ? 'bg-red-50 text-red-600' :
                            notif.tipo === 'warning' ? 'bg-amber-50 text-amber-600' :
                              'bg-blue-50 text-blue-600'
                          }`}>
                          {notif.tipo}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{notif.mensagem}</p>
                      <p className="text-xs text-slate-400 mt-2">Enviado em: {new Date(notif.data).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(notif.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-2"
                    title="Excluir aviso"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
