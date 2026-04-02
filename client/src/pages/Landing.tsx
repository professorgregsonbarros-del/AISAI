import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Brain, BarChart3, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero */}
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <img
            src="/Gemini_Generated_Image_8ii5l8ii5l8ii5l8-removebg-preview.png"
            alt="AI-SAI Logo"
            className="w-12 h-12 object-contain"
          />
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-800">AI-SAI</span>
            <span className="text-sm text-gray-500">Teacher Hub</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Cadastrar
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Transforme suas aulas com a
            <br />
            <span className="text-indigo-600">Sala de Aula Invertida</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Seu assistente pedagógico inteligente para planejar, executar e avaliar
            aulas no modelo invertido. A IA guia — você decide.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white text-lg rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Planos com IA Conversacional</h3>
            <p className="text-sm text-gray-600">
              A IA faz perguntas, entende seu contexto e gera planos de aula
              estruturados para pré-aula, aula presencial e avaliação.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Materiais Editáveis</h3>
            <p className="text-sm text-gray-600">
              Quizzes, resumos, roteiros de vídeo e atividades colaborativas —
              todos editáveis e adaptáveis ao seu contexto.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Reflexão e Crescimento</h3>
            <p className="text-sm text-gray-600">
              Registre percepções, dificuldades e melhorias. A IA sugere ajustes
              baseados em padrões comprovados.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-gray-400">
        AI-SAI Teacher Hub · Data de criação: 31 de março de 2026
      </footer>
    </div>
  );
}
