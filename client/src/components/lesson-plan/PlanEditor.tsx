import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, Check } from 'lucide-react';

interface PlanPhase {
  description: string;
  activities: string[];
  materials?: string[];
  methodology?: string;
  duration: string;
}

interface AssessmentPhase {
  description: string;
  methods: string[];
  criteria: string[];
}

interface Props {
  plan: {
    title: string;
    preClass?: PlanPhase;
    inClass?: PlanPhase;
    assessment?: AssessmentPhase;
  };
  onChange?: (plan: any) => void;
  readOnly?: boolean;
}

export default function PlanEditor({ plan, onChange, readOnly = false }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    preClass: true,
    inClass: true,
    assessment: true,
  });

  const toggleSection = (key: string) => {
    setExpanded(e => ({ ...e, [key]: !e[key] }));
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-800">{plan.title}</h4>

      {plan.preClass && (
        <PhaseSection
          title="Pré-Aula"
          color="blue"
          phase={plan.preClass}
          expanded={expanded.preClass}
          onToggle={() => toggleSection('preClass')}
          readOnly={readOnly}
          onChange={readOnly ? undefined : (p) => onChange?.({ ...plan, preClass: p })}
        />
      )}

      {plan.inClass && (
        <PhaseSection
          title="Aula Presencial"
          color="green"
          phase={plan.inClass}
          expanded={expanded.inClass}
          onToggle={() => toggleSection('inClass')}
          readOnly={readOnly}
          onChange={readOnly ? undefined : (p) => onChange?.({ ...plan, inClass: p })}
        />
      )}

      {plan.assessment && (
        <AssessmentSection
          assessment={plan.assessment}
          expanded={expanded.assessment}
          onToggle={() => toggleSection('assessment')}
          readOnly={readOnly}
          onChange={readOnly ? undefined : (a) => onChange?.({ ...plan, assessment: a })}
        />
      )}
    </div>
  );
}

function PhaseSection({
  title,
  color,
  phase,
  expanded,
  onToggle,
  readOnly,
  onChange,
}: {
  title: string;
  color: string;
  phase: PlanPhase;
  expanded: boolean;
  onToggle: () => void;
  readOnly: boolean;
  onChange?: (phase: PlanPhase) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(phase);

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
  };

  const save = () => {
    onChange?.(editData);
    setEditing(false);
  };

  return (
    <div className={`border rounded-lg ${colorMap[color] || 'bg-gray-50 border-gray-200'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium"
      >
        <span>{title}</span>
        <div className="flex items-center gap-1">
          {phase.duration && <span className="text-xs opacity-70">{phase.duration}</span>}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 text-sm space-y-2">
          {!readOnly && !editing && (
            <button onClick={() => { setEditData(phase); setEditing(true); }} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> Editar
            </button>
          )}

          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full p-2 border rounded text-xs"
                rows={2}
              />
              <div>
                <label className="text-xs font-medium">Atividades:</label>
                {editData.activities.map((a, i) => (
                  <input
                    key={i}
                    value={a}
                    onChange={(e) => {
                      const acts = [...editData.activities];
                      acts[i] = e.target.value;
                      setEditData({ ...editData, activities: acts });
                    }}
                    className="w-full p-1 border rounded text-xs mt-1"
                  />
                ))}
              </div>
              <button onClick={save} className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-2 py-1 rounded">
                <Check className="w-3 h-3" /> Salvar
              </button>
            </div>
          ) : (
            <>
              <p className="opacity-80">{phase.description}</p>
              {phase.activities?.length > 0 && (
                <ul className="list-disc list-inside space-y-1 opacity-80">
                  {phase.activities.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              )}
              {phase.materials && phase.materials.length > 0 && (
                <div>
                  <span className="font-medium text-xs">Materiais: </span>
                  <span className="opacity-80 text-xs">{phase.materials.join(', ')}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function AssessmentSection({
  assessment,
  expanded,
  onToggle,
  readOnly,
  onChange,
}: {
  assessment: AssessmentPhase;
  expanded: boolean;
  onToggle: () => void;
  readOnly: boolean;
  onChange?: (a: AssessmentPhase) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(assessment);

  const save = () => {
    onChange?.(editData);
    setEditing(false);
  };

  return (
    <div className="border rounded-lg bg-amber-50 border-amber-200 text-amber-800">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium"
      >
        <span>Avaliação Formativa</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 text-sm space-y-2">
          {!readOnly && !editing && (
            <button onClick={() => { setEditData(assessment); setEditing(true); }} className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              <Edit3 className="w-3 h-3" /> Editar
            </button>
          )}

          {editing ? (
            <div className="space-y-2">
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full p-2 border rounded text-xs"
                rows={2}
              />
              <button onClick={save} className="flex items-center gap-1 text-xs bg-indigo-600 text-white px-2 py-1 rounded">
                <Check className="w-3 h-3" /> Salvar
              </button>
            </div>
          ) : (
            <>
              <p className="opacity-80">{assessment.description}</p>
              {assessment.methods?.length > 0 && (
                <div>
                  <span className="font-medium text-xs">Métodos: </span>
                  <ul className="list-disc list-inside opacity-80">
                    {assessment.methods.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              )}
              {assessment.criteria?.length > 0 && (
                <div>
                  <span className="font-medium text-xs">Critérios: </span>
                  <ul className="list-disc list-inside opacity-80">
                    {assessment.criteria.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
