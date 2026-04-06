import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Save } from 'lucide-react';
import { ChatMessage } from '../../types';
import { plansAPI } from '../../services/api';
import PlanEditor from './PlanEditor';
import MicroContentCard from '../trails/MicroContentCard';
import { trailsAPI } from '../../services/api';
import { TrailContent } from '../../types';

interface Props {
  planId?: string;
  initialMessages?: ChatMessage[];
  onPlanSaved?: () => void;
}

export default function ConversationalPlanner({ planId, initialMessages, onPlanSaved }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [currentPlanId, setCurrentPlanId] = useState(planId);
  const [trails, setTrails] = useState<TrailContent[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string>('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    trailsAPI.list(currentPhase).then(res => setTrails(res.data)).catch(() => {});
  }, [currentPhase]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await plansAPI.chat(newMessages, currentPlanId);
      const assistantMessage: ChatMessage = { role: 'assistant', content: res.data.message };
      setMessages([...newMessages, assistantMessage]);

      if (res.data.generatedPlan) {
        setGeneratedPlan(res.data.generatedPlan);
      }

      // Detect phase context for trail suggestions
      const lastMsg = res.data.message.toLowerCase();
      if (lastMsg.includes('pré-aula') || lastMsg.includes('antes da aula')) {
        setCurrentPhase('pre-class');
      } else if (lastMsg.includes('aula presencial') || lastMsg.includes('durante a aula')) {
        setCurrentPhase('in-class');
      } else if (lastMsg.includes('avaliação') || lastMsg.includes('avaliar')) {
        setCurrentPhase('assessment');
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Desculpe, ocorreu um erro. Tente novamente.' }]);
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async () => {
    if (!generatedPlan) return;
    setLoading(true);
    setSaveStatus('saving');
    try {
      if (currentPlanId) {
        await plansAPI.update(currentPlanId, {
          title: generatedPlan.title,
          preClass: generatedPlan.preClass,
          inClass: generatedPlan.inClass,
          assessment: generatedPlan.assessment,
          conversation: messages,
          status: 'complete',
        });
      } else {
        const firstUserMsg = messages.find(m => m.role === 'user');
        const res = await plansAPI.create({
          title: generatedPlan.title || 'Novo Plano',
          subject: firstUserMsg?.content?.split(' ').slice(0, 5).join(' ') || '',
          level: '',
          objectives: '',
          conversation: messages,
          preClass: generatedPlan.preClass,
          inClass: generatedPlan.inClass,
          assessment: generatedPlan.assessment,
          status: 'complete',
        });
        setCurrentPlanId(res.data.id);
      }
      setSaveStatus('saved');
      onPlanSaved?.();
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Error saving plan:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat area */}
      <div className="lg:col-span-2 flex flex-col h-[600px] bg-white rounded-xl border border-gray-200">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-indigo-300" />
              <p className="text-lg font-medium text-gray-600">Vamos criar seu plano de aula!</p>
              <p className="mt-2 text-sm">
                Me conte: qual é o tema da aula e para qual nível de ensino?
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content.replace(/<plan>[\s\S]*?<\/plan>/g, '').trim()}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm"
              rows={2}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar — trails + generated plan */}
      <div className="space-y-4">
        {generatedPlan && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-800">Plano Gerado!</h3>
              <div className="flex items-center gap-2">
                {saveStatus === 'saved' && <span className="text-xs text-green-700 font-medium">Salvo!</span>}
                {saveStatus === 'error' && <span className="text-xs text-red-600 font-medium">Erro ao salvar</span>}
                <button
                  onClick={savePlan}
                  disabled={loading || saveStatus === 'saving'}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'saved' ? 'Salvo' : 'Salvar'}
                </button>
              </div>
            </div>
            <PlanEditor plan={generatedPlan} onChange={setGeneratedPlan} />
          </div>
        )}

        {trails.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
              Dica Formativa
            </h3>
            {trails.slice(0, 2).map(trail => (
              <MicroContentCard key={trail.id} trail={trail} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
