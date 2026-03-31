import { useState, useEffect } from 'react';
import { reflectionsAPI, plansAPI } from '../../services/api';
import { Reflection, LessonPlan } from '../../types';
import { MessageSquare, Sparkles, Loader2, Plus } from 'lucide-react';

export default function ReflectionModule() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [suggesting, setSuggesting] = useState<string | null>(null);
  const [form, setForm] = useState({
    planId: '',
    perceptions: '',
    difficulties: '',
    improvements: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [refRes, planRes] = await Promise.all([
        reflectionsAPI.list(),
        plansAPI.list(),
      ]);
      setReflections(refRes.data);
      setPlans(planRes.data);
    } catch (err) {
      console.error('Error loading reflections:', err);
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reflectionsAPI.create(form);
      setForm({ planId: '', perceptions: '', difficulties: '', improvements: '' });
      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error('Error creating reflection:', err);
    }
  };

  const getSuggestion = async (id: string) => {
    setSuggesting(id);
    try {
      const res = await reflectionsAPI.suggest(id);
      setReflections(refs => refs.map(r => r.id === id ? res.data : r));
    } catch (err) {
      console.error('Error getting suggestion:', err);
    } finally {
      setSuggesting(null);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-400">Carregando reflexões...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Reflexão Docente</h3>
          <p className="text-sm text-gray-500">Registre suas percepções e receba sugestões da IA</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Nova Reflexão
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plano de Aula (opcional)</label>
            <select
              value={form.planId}
              onChange={(e) => setForm(f => ({ ...f, planId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione um plano...</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">O que funcionou?</label>
            <textarea
              value={form.perceptions}
              onChange={(e) => setForm(f => ({ ...f, perceptions: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Descreva o que deu certo na aplicação da aula..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dificuldades encontradas</label>
            <textarea
              value={form.difficulties}
              onChange={(e) => setForm(f => ({ ...f, difficulties: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="Quais desafios surgiram durante a aula?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Melhorias sugeridas</label>
            <textarea
              value={form.improvements}
              onChange={(e) => setForm(f => ({ ...f, improvements: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              placeholder="O que você faria diferente na próxima vez?"
              required
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
              Salvar Reflexão
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {reflections.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>Nenhuma reflexão registrada</p>
          <p className="text-sm mt-1">Registre suas percepções após aplicar uma aula</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reflections.map(ref => (
            <div key={ref.id} className="bg-white border border-gray-200 rounded-xl p-5">
              {ref.plan && (
                <p className="text-xs text-indigo-600 mb-2">Plano: {ref.plan.title}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h5 className="text-xs font-semibold text-green-700 uppercase mb-1">O que funcionou</h5>
                  <p className="text-sm text-gray-600">{ref.perceptions}</p>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-red-700 uppercase mb-1">Dificuldades</h5>
                  <p className="text-sm text-gray-600">{ref.difficulties}</p>
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-blue-700 uppercase mb-1">Melhorias</h5>
                  <p className="text-sm text-gray-600">{ref.improvements}</p>
                </div>
              </div>

              {ref.aiSuggestion ? (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-700 uppercase">Sugestão da IA</span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{ref.aiSuggestion}</p>
                </div>
              ) : (
                <button
                  onClick={() => getSuggestion(ref.id)}
                  disabled={suggesting === ref.id}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 disabled:opacity-50"
                >
                  {suggesting === ref.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Obter Sugestão da IA
                </button>
              )}

              <p className="text-xs text-gray-400 mt-3">
                {new Date(ref.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
