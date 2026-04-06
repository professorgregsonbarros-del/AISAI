import { useState, useEffect } from 'react';
import { plansAPI } from '../../services/api';
import { LessonPlan } from '../../types';
import { FileText, Search, Plus, Eye, Trash2, Filter, Download } from 'lucide-react';
import PlanEditor from '../lesson-plan/PlanEditor';
import { exportToPDF } from '../../services/pdf';
import { useToast } from '../ui/Toast';

interface Props {
  onNewPlan: () => void;
}

export default function PlansList({ onNewPlan }: Props) {
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadPlans();
  }, [search, statusFilter]);

  const loadPlans = async () => {
    try {
      const params: any = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await plansAPI.list(params);
      setPlans(res.data);
    } catch (err) {
      console.error('Error loading plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewPlan = async (id: string) => {
    try {
      const res = await plansAPI.get(id);
      setSelectedPlan(res.data);
    } catch (err) {
      console.error('Error loading plan:', err);
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return;
    try {
      await plansAPI.delete(id);
      setPlans(plans.filter(p => p.id !== id));
      if (selectedPlan?.id === id) setSelectedPlan(null);
      toast.success('Plano excluído.');
    } catch (err) {
      console.error('Error deleting plan:', err);
      toast.error('Erro ao excluir o plano.');
    }
  };

  if (selectedPlan) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setSelectedPlan(null)} className="text-sm text-indigo-600 hover:underline">
            &larr; Voltar para lista
          </button>
          <button
            onClick={() => exportToPDF('plan-pdf-content', selectedPlan.title)}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
        <div id="plan-pdf-content" className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">{selectedPlan.title}</h2>
          <p className="text-sm text-gray-500 mb-4">
            {selectedPlan.subject} · {selectedPlan.level} · {new Date(selectedPlan.updatedAt).toLocaleDateString('pt-BR')}
          </p>
          {selectedPlan.objectives && (
            <p className="text-sm text-gray-600 mb-4"><strong>Objetivos:</strong> {selectedPlan.objectives}</p>
          )}
          <PlanEditor
            plan={{
              title: selectedPlan.title,
              preClass: selectedPlan.preClass as any,
              inClass: selectedPlan.inClass as any,
              assessment: selectedPlan.assessment as any,
            }}
            readOnly
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Meus Planos de Aula</h3>
          <p className="text-sm text-gray-500">{plans.length} plano(s) criado(s)</p>
        </div>
        <button
          onClick={onNewPlan}
          className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Novo Plano
        </button>
      </div>

      {/* Search and filter */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar planos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
          >
            <option value="">Todos</option>
            <option value="draft">Rascunho</option>
            <option value="complete">Completo</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Carregando...</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>Nenhum plano encontrado</p>
          <p className="text-sm mt-1">Crie seu primeiro plano de aula com a IA</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map(plan => (
            <div
              key={plan.id}
              className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:border-indigo-200 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-800">{plan.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    plan.status === 'complete'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {plan.status === 'complete' ? 'Completo' : 'Rascunho'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {plan.subject && `${plan.subject} · `}
                  {new Date(plan.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => viewPlan(plan.id)} className="p-2 text-gray-400 hover:text-indigo-600 rounded">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => deletePlan(plan.id)} className="p-2 text-gray-400 hover:text-red-600 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
