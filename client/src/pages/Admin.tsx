import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/ui/Toast';
import { Users, FileText, BookOpen, Plus, Edit3, Trash2, Check, X, BarChart2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  institution: string;
  role: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Plan {
  id: string;
  title: string;
  subject: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

interface Trail {
  id: string;
  title: string;
  body: string;
  context: string;
  duration: string;
  order: number;
}

const contextLabels: Record<string, string> = {
  'pre-class': 'Pré-Aula',
  'in-class': 'Aula Presencial',
  'assessment': 'Avaliação',
  'general': 'Geral',
};

export default function Admin() {
  const { user } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<'dashboard' | 'users' | 'trails'>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [trailForm, setTrailForm] = useState<Partial<Trail> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!user) return <Navigate to="/login" />;
  if (!(user as any).isAdmin) return <Navigate to="/dashboard" />;

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [usersRes, plansRes, trailsRes] = await Promise.all([
        api.get('/trails/admin/users'),
        api.get('/trails/admin/plans'),
        api.get('/trails'),
      ]);
      setUsers(usersRes.data);
      setPlans(plansRes.data);
      setTrails(trailsRes.data);
    } catch {
      toast.error('Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  const saveTrail = async () => {
    if (!trailForm?.title || !trailForm?.body || !trailForm?.context || !trailForm?.duration) {
      toast.error('Preencha todos os campos.');
      return;
    }
    try {
      if (editingId) {
        await api.put(`/trails/${editingId}`, trailForm);
        toast.success('Trilha atualizada.');
      } else {
        await api.post('/trails', { ...trailForm, order: trails.length + 1 });
        toast.success('Trilha criada.');
      }
      setTrailForm(null);
      setEditingId(null);
      await loadAll();
    } catch {
      toast.error('Erro ao salvar trilha.');
    }
  };

  const deleteTrail = async (id: string) => {
    if (!confirm('Excluir esta trilha?')) return;
    try {
      await api.delete(`/trails/${id}`);
      toast.success('Trilha excluída.');
      await loadAll();
    } catch {
      toast.error('Erro ao excluir trilha.');
    }
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { key: 'users', label: 'Professores', icon: Users },
    { key: 'trails', label: 'Trilhas', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Painel Administrativo</h1>
          <p className="text-sm text-gray-500">AI-SAI Teacher Hub</p>
        </div>
        <a href="/dashboard" className="text-sm text-indigo-600 hover:underline">← Voltar à plataforma</a>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === key ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Carregando...</div>
        ) : (
          <>
            {/* Dashboard */}
            {tab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard icon={Users} label="Professores" value={users.length} color="bg-indigo-50 text-indigo-700" />
                  <StatCard icon={FileText} label="Planos Criados" value={plans.length} color="bg-green-50 text-green-700" />
                  <StatCard icon={BookOpen} label="Trilhas" value={trails.length} color="bg-amber-50 text-amber-700" />
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h2 className="font-semibold text-gray-800 mb-4">Últimos Planos Criados</h2>
                  <div className="space-y-2">
                    {plans.slice(0, 8).map(plan => (
                      <div key={plan.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{plan.title}</p>
                          <p className="text-xs text-gray-500">{plan.user.name} · {plan.user.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${plan.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {plan.status === 'complete' ? 'Completo' : 'Rascunho'}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">{new Date(plan.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users */}
            {tab === 'users' && (
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="font-semibold text-gray-800">Professores Cadastrados ({users.length})</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {users.map(u => (
                    <div key={u.id} className="px-5 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email} · {u.institution || '—'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{u.role || '—'}</p>
                        <p className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trails */}
            {tab === 'trails' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => { setTrailForm({ context: 'general', duration: '2 min', order: trails.length + 1 }); setEditingId(null); }}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Nova Trilha
                  </button>
                </div>

                {/* Trail Form */}
                {trailForm && (
                  <div className="bg-white rounded-xl border border-indigo-200 p-5">
                    <h3 className="font-semibold text-gray-800 mb-4">{editingId ? 'Editar Trilha' : 'Nova Trilha'}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        value={trailForm.title || ''}
                        onChange={e => setTrailForm({ ...trailForm, title: e.target.value })}
                        placeholder="Título"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 col-span-2"
                      />
                      <textarea
                        value={trailForm.body || ''}
                        onChange={e => setTrailForm({ ...trailForm, body: e.target.value })}
                        placeholder="Conteúdo (texto ou link de vídeo)"
                        rows={3}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 col-span-2"
                      />
                      <select
                        value={trailForm.context || 'general'}
                        onChange={e => setTrailForm({ ...trailForm, context: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="general">Geral</option>
                        <option value="pre-class">Pré-Aula</option>
                        <option value="in-class">Aula Presencial</option>
                        <option value="assessment">Avaliação</option>
                      </select>
                      <input
                        value={trailForm.duration || ''}
                        onChange={e => setTrailForm({ ...trailForm, duration: e.target.value })}
                        placeholder="Duração (ex: 2 min)"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={saveTrail} className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                        <Check className="w-4 h-4" /> Salvar
                      </button>
                      <button onClick={() => { setTrailForm(null); setEditingId(null); }} className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200">
                        <X className="w-4 h-4" /> Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Trail List */}
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                  {trails.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">Nenhuma trilha cadastrada</div>
                  ) : trails.map(trail => (
                    <div key={trail.id} className="px-5 py-3 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{contextLabels[trail.context] || trail.context}</span>
                          <span className="text-xs text-gray-400">{trail.duration}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{trail.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{trail.body}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => { setTrailForm(trail); setEditingId(trail.id); }} className="p-1.5 text-gray-400 hover:text-indigo-600 rounded">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteTrail(trail.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
