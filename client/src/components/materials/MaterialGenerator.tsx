import { useState, useEffect } from 'react';
import { FileText, HelpCircle, Video, Users, Plus, Loader2 } from 'lucide-react';
import { materialsAPI, plansAPI } from '../../services/api';
import { Material, LessonPlan } from '../../types';
import MaterialEditor from './MaterialEditor';
import { useToast } from '../ui/Toast';

interface Props {
  onGenerated?: () => void;
}

export default function MaterialGenerator({ onGenerated }: Props) {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansRes, matsRes] = await Promise.all([
        plansAPI.list(),
        materialsAPI.list(),
      ]);
      setPlans(plansRes.data);
      setMaterials(matsRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const generate = async (type: string) => {
    if (!selectedPlan) return;
    setGenerating(true);
    toast.info('Gerando material com IA...');
    try {
      await materialsAPI.generate(type, selectedPlan);
      await loadData();
      toast.success('Material gerado com sucesso!');
      onGenerated?.();
    } catch (err) {
      console.error('Error generating material:', err);
      toast.error('Erro ao gerar material. Verifique os créditos da IA.');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdate = async (id: string, content: any) => {
    try {
      await materialsAPI.update(id, { content });
      setMaterials(mats => mats.map(m => m.id === id ? { ...m, content } : m));
      toast.success('Material atualizado.');
    } catch (err) {
      console.error('Error updating material:', err);
      toast.error('Erro ao atualizar material.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await materialsAPI.delete(id);
      setMaterials(mats => mats.filter(m => m.id !== id));
      toast.success('Material excluído.');
    } catch (err) {
      console.error('Error deleting material:', err);
      toast.error('Erro ao excluir material.');
    }
  };

  const typeConfig = [
    { type: 'quiz', label: 'Quiz Diagnóstico', icon: HelpCircle, color: 'text-purple-600 bg-purple-50' },
    { type: 'summary', label: 'Resumo', icon: FileText, color: 'text-blue-600 bg-blue-50' },
    { type: 'video-script', label: 'Roteiro de Vídeo', icon: Video, color: 'text-red-600 bg-red-50' },
    { type: 'activity', label: 'Atividade Colaborativa', icon: Users, color: 'text-green-600 bg-green-50' },
  ];

  const filtered = filter ? materials.filter(m => m.type === filter) : materials;

  if (loading) return <div className="text-center py-10 text-gray-400">Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Generate section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Gerar Novo Material</h3>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Selecione o plano de aula:</label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          >
            <option value="">Selecione um plano...</option>
            {plans.map(p => (
              <option key={p.id} value={p.id}>{p.title} — {p.subject}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {typeConfig.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => generate(type)}
              disabled={generating || !selectedPlan}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors disabled:opacity-40 ${color}`}
            >
              {generating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Icon className="w-6 h-6" />}
              <span className="text-xs font-medium text-center">{label}</span>
              <Plus className="w-4 h-4 opacity-50" />
            </button>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('')}
          className={`px-3 py-1 text-xs rounded-full ${!filter ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Todos
        </button>
        {typeConfig.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 text-xs rounded-full ${filter === type ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Materials list */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>Nenhum material encontrado</p>
          <p className="text-sm mt-1">Selecione um plano e gere seu primeiro material</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(material => (
            <MaterialEditor
              key={material.id}
              material={material}
              onUpdate={(content) => handleUpdate(material.id, content)}
              onDelete={() => handleDelete(material.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
