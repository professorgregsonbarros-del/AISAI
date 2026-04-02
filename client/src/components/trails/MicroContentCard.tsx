import { useState } from 'react';
import {  Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { TrailContent } from '../../types';

interface Props {
  trail: TrailContent;
}

const contextColors: Record<string, string> = {
  'pre-class': 'border-blue-200 bg-blue-50',
  'in-class': 'border-green-200 bg-green-50',
  'assessment': 'border-amber-200 bg-amber-50',
  'general': 'border-indigo-200 bg-indigo-50',
};

const contextLabels: Record<string, string> = {
  'pre-class': 'Pré-Aula',
  'in-class': 'Aula Presencial',
  'assessment': 'Avaliação',
  'general': 'Geral',
};

export default function MicroContentCard({ trail }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-lg p-3 mb-3 ${contextColors[trail.context] || contextColors.general}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between text-left"
      >
        <div className="flex items-start gap-2">
          <div>
            <h4 className="text-sm font-medium text-gray-800">{trail.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/50 text-gray-600">
                {contextLabels[trail.context]}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {trail.duration}
              </span>
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line border-t border-white/50 pt-3">
          {trail.body}
        </div>
      )}
    </div>
  );
}
