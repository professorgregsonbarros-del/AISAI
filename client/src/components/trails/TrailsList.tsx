import { useState, useEffect } from 'react';
import { trailsAPI } from '../../services/api';
import { TrailContent } from '../../types';
import MicroContentCard from './MicroContentCard';
import { GraduationCap } from 'lucide-react';

export default function TrailsList() {
  const [trails, setTrails] = useState<TrailContent[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trailsAPI.list(filter || undefined)
      .then(res => setTrails(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  const filters = [
    { value: '', label: 'Todas' },
    { value: 'general', label: 'Geral' },
    { value: 'pre-class', label: 'Pré-Aula' },
    { value: 'in-class', label: 'Aula Presencial' },
    { value: 'assessment', label: 'Avaliação' },
  ];

  if (loading) return <div className="text-center py-10 text-gray-400">Carregando trilhas...</div>;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Trilhas Formativas</h3>
        <p className="text-sm text-gray-500">Micro-conteúdos sobre a metodologia SAI e uso ético da IA na educação</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
              filter === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {trails.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>Nenhuma trilha encontrada</p>
        </div>
      ) : (
        trails.map(trail => <MicroContentCard key={trail.id} trail={trail} />)
      )}
    </div>
  );
}
