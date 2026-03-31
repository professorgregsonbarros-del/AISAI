import { useState } from 'react';
import { Edit3, Trash2, Check, X, HelpCircle, FileText, Video, Users } from 'lucide-react';
import { Material } from '../../types';

interface Props {
  material: Material;
  onUpdate: (content: any) => void;
  onDelete: () => void;
}

export default function MaterialEditor({ material, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(material.content);

  const typeIcons: Record<string, any> = {
    quiz: HelpCircle,
    summary: FileText,
    'video-script': Video,
    activity: Users,
  };

  const typeColors: Record<string, string> = {
    quiz: 'border-purple-200 bg-purple-50',
    summary: 'border-blue-200 bg-blue-50',
    'video-script': 'border-red-200 bg-red-50',
    activity: 'border-green-200 bg-green-50',
  };

  const Icon = typeIcons[material.type] || FileText;

  const save = () => {
    onUpdate(editContent);
    setEditing(false);
  };

  const cancel = () => {
    setEditContent(material.content);
    setEditing(false);
  };

  return (
    <div className={`border rounded-xl p-4 ${typeColors[material.type] || 'border-gray-200 bg-white'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 opacity-70" />
          <h4 className="font-medium text-sm text-gray-800">{material.title}</h4>
        </div>
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <button onClick={save} className="p-1.5 text-green-600 hover:bg-green-100 rounded">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={cancel} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="p-1.5 text-gray-400 hover:bg-white/50 rounded">
                <Edit3 className="w-4 h-4" />
              </button>
              <button onClick={onDelete} className="p-1.5 text-red-400 hover:bg-red-100 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {material.type === 'quiz' && (
        <QuizView content={editContent} editing={editing} onChange={setEditContent} />
      )}
      {material.type === 'summary' && (
        <SummaryView content={editContent} editing={editing} onChange={setEditContent} />
      )}
      {material.type === 'video-script' && (
        <VideoScriptView content={editContent} editing={editing} onChange={setEditContent} />
      )}
      {material.type === 'activity' && (
        <ActivityView content={editContent} editing={editing} onChange={setEditContent} />
      )}

      {material.plan && (
        <p className="text-xs text-gray-400 mt-3">
          Plano: {material.plan.title}
        </p>
      )}
    </div>
  );
}

function QuizView({ content, editing, onChange }: { content: any; editing: boolean; onChange: (c: any) => void }) {
  const questions = content?.questions || [];

  if (editing) {
    return (
      <div className="space-y-3">
        {questions.map((q: any, qi: number) => (
          <div key={qi} className="bg-white/50 p-3 rounded-lg">
            <input
              value={q.question}
              onChange={(e) => {
                const updated = [...questions];
                updated[qi] = { ...q, question: e.target.value };
                onChange({ ...content, questions: updated });
              }}
              className="w-full p-1.5 border rounded text-sm mb-2"
            />
            {q.options?.map((opt: string, oi: number) => (
              <div key={oi} className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  checked={q.correct === oi}
                  onChange={() => {
                    const updated = [...questions];
                    updated[qi] = { ...q, correct: oi };
                    onChange({ ...content, questions: updated });
                  }}
                  className="text-indigo-600"
                />
                <input
                  value={opt}
                  onChange={(e) => {
                    const updated = [...questions];
                    const opts = [...q.options];
                    opts[oi] = e.target.value;
                    updated[qi] = { ...q, options: opts };
                    onChange({ ...content, questions: updated });
                  }}
                  className="flex-1 p-1 border rounded text-xs"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((q: any, i: number) => (
        <div key={i} className="bg-white/50 p-3 rounded-lg">
          <p className="text-sm font-medium mb-2">{i + 1}. {q.question}</p>
          {q.options?.map((opt: string, oi: number) => (
            <p key={oi} className={`text-xs ml-4 py-0.5 ${q.correct === oi ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
              {String.fromCharCode(65 + oi)}) {opt} {q.correct === oi && ' ✓'}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

function SummaryView({ content, editing, onChange }: { content: any; editing: boolean; onChange: (c: any) => void }) {
  const sections = content?.sections || [];

  if (editing) {
    return (
      <div className="space-y-3">
        {sections.map((s: any, i: number) => (
          <div key={i}>
            <input
              value={s.title}
              onChange={(e) => {
                const updated = [...sections];
                updated[i] = { ...s, title: e.target.value };
                onChange({ ...content, sections: updated });
              }}
              className="w-full p-1.5 border rounded text-sm font-medium mb-1"
            />
            <textarea
              value={s.content}
              onChange={(e) => {
                const updated = [...sections];
                updated[i] = { ...s, content: e.target.value };
                onChange({ ...content, sections: updated });
              }}
              className="w-full p-1.5 border rounded text-xs"
              rows={3}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map((s: any, i: number) => (
        <div key={i}>
          <h5 className="text-sm font-medium">{s.title}</h5>
          <p className="text-xs text-gray-600 mt-1">{s.content}</p>
        </div>
      ))}
    </div>
  );
}

function VideoScriptView({ content, editing, onChange }: { content: any; editing: boolean; onChange: (c: any) => void }) {
  const segments = content?.segments || [];

  if (editing) {
    return (
      <div className="space-y-2">
        {segments.map((s: any, i: number) => (
          <div key={i} className="bg-white/50 p-2 rounded flex gap-2">
            <input value={s.timestamp} onChange={(e) => { const u = [...segments]; u[i] = { ...s, timestamp: e.target.value }; onChange({ ...content, segments: u }); }} className="w-16 p-1 border rounded text-xs" />
            <textarea value={s.narration} onChange={(e) => { const u = [...segments]; u[i] = { ...s, narration: e.target.value }; onChange({ ...content, segments: u }); }} className="flex-1 p-1 border rounded text-xs" rows={2} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {segments.map((s: any, i: number) => (
        <div key={i} className="flex gap-3 text-xs">
          <span className="font-mono text-indigo-600 w-12">{s.timestamp}</span>
          <div>
            <p className="text-gray-700">{s.narration}</p>
            {s.visual && <p className="text-gray-400 italic">[{s.visual}]</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityView({ content, editing, onChange }: { content: any; editing: boolean; onChange: (c: any) => void }) {
  const steps = content?.steps || [];

  if (editing) {
    return (
      <div className="space-y-2">
        {steps.map((s: any, i: number) => (
          <div key={i} className="bg-white/50 p-2 rounded">
            <textarea value={s.instruction} onChange={(e) => { const u = [...steps]; u[i] = { ...s, instruction: e.target.value }; onChange({ ...content, steps: u }); }} className="w-full p-1 border rounded text-xs" rows={2} />
            <div className="flex gap-2 mt-1">
              <input value={s.duration} onChange={(e) => { const u = [...steps]; u[i] = { ...s, duration: e.target.value }; onChange({ ...content, steps: u }); }} className="p-1 border rounded text-xs w-20" placeholder="Duração" />
              <input value={s.groupSize} onChange={(e) => { const u = [...steps]; u[i] = { ...s, groupSize: e.target.value }; onChange({ ...content, steps: u }); }} className="p-1 border rounded text-xs w-24" placeholder="Grupo" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {steps.map((s: any, i: number) => (
        <div key={i} className="flex gap-3 text-xs">
          <span className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-medium flex-shrink-0">{s.step || i + 1}</span>
          <div>
            <p className="text-gray-700">{s.instruction}</p>
            <p className="text-gray-400">{s.duration} · {s.groupSize}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
