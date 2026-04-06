import Anthropic from '@anthropic-ai/sdk';

function getClient() {
  const key = process.env['AI_API_KEY'] || process.env['ANTHROPIC_API_KEY'] || '';
  console.log('API KEY present:', key ? `yes (${key.slice(0, 10)}...)` : 'NO - EMPTY');
  return new Anthropic({
    apiKey: key,
  });
}

const SYSTEM_PROMPT = `Você é um assistente pedagógico especializado na metodologia Sala de Aula Invertida (SAI).
Seu papel é GUIAR o professor na construção de planos de aula, NÃO gerar planos prontos automaticamente.

REGRAS IMPORTANTES:
1. Sempre faça perguntas antes de gerar qualquer conteúdo. Você precisa entender o contexto.
2. Pergunte sobre: experiência prévia dos alunos, recursos disponíveis, tempo de aula, dificuldades da turma, objetivos específicos.
3. Faça UMA pergunta por vez para não sobrecarregar o professor.
4. Após 3-5 trocas de mensagens, quando tiver contexto suficiente, gere o plano estruturado.
5. O plano deve ter 3 fases: PRÉ-AULA, AULA PRESENCIAL e AVALIAÇÃO FORMATIVA.
6. Sempre sugira, nunca imponha. O professor é o protagonista.
7. Responda sempre em português brasileiro.
8. Seja conciso e prático nas sugestões.

Quando gerar o plano final, use este formato JSON dentro de tags <plan>:
<plan>
{
  "title": "Título do plano",
  "preClass": {
    "description": "Descrição da fase",
    "activities": ["atividade 1", "atividade 2"],
    "materials": ["material 1", "material 2"],
    "duration": "tempo estimado"
  },
  "inClass": {
    "description": "Descrição da fase",
    "activities": ["atividade 1", "atividade 2"],
    "methodology": "como conduzir",
    "duration": "tempo estimado"
  },
  "assessment": {
    "description": "Descrição da avaliação",
    "methods": ["método 1", "método 2"],
    "criteria": ["critério 1", "critério 2"]
  }
}
</plan>`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  const response = await getClient().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  const block = response.content[0];
  if (block.type === 'text') {
    return block.text;
  }
  return '';
}

export async function generateMaterial(
  type: string,
  context: { planTitle: string; subject: string; level: string; objectives: string }
): Promise<string> {
  const typePrompts: Record<string, string> = {
    quiz: `Crie um quiz diagnóstico com 5 questões de múltipla escolha (4 alternativas cada) sobre "${context.subject}" para alunos do nível "${context.level}".
Objetivo: ${context.objectives}.
Retorne em JSON: { "questions": [{ "question": "...", "options": ["a", "b", "c", "d"], "correct": 0 }] }`,

    summary: `Crie um resumo didático sobre "${context.subject}" para alunos do nível "${context.level}".
Objetivo: ${context.objectives}.
O resumo deve ser claro, com tópicos principais e exemplos práticos.
Retorne em JSON: { "sections": [{ "title": "...", "content": "..." }] }`,

    'video-script': `Crie um roteiro de vídeo educativo (5-10 minutos) sobre "${context.subject}" para alunos do nível "${context.level}".
Objetivo: ${context.objectives}.
Retorne em JSON: { "segments": [{ "timestamp": "0:00", "narration": "...", "visual": "..." }] }`,

    activity: `Crie uma atividade colaborativa sobre "${context.subject}" para alunos do nível "${context.level}".
Objetivo: ${context.objectives}.
Retorne em JSON: { "steps": [{ "step": 1, "instruction": "...", "duration": "...", "groupSize": "..." }] }`,
  };

  const response = await getClient().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: 'Você é um assistente pedagógico especializado em criar materiais educacionais para a metodologia Sala de Aula Invertida. Responda sempre em português brasileiro. Retorne APENAS o JSON solicitado, sem texto adicional.',
    messages: [{ role: 'user', content: typePrompts[type] || typePrompts.summary }],
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text : '{}';
}

export async function generateReflectionSuggestion(
  perceptions: string,
  difficulties: string,
  improvements: string,
  planTitle?: string
): Promise<string> {
  const prompt = `Um professor utilizou a metodologia SAI${planTitle ? ` no plano "${planTitle}"` : ''} e registrou a seguinte reflexão:

PERCEPÇÕES (o que funcionou): ${perceptions}
DIFICULDADES: ${difficulties}
MELHORIAS SUGERIDAS PELO PROFESSOR: ${improvements}

Com base nessas informações, ofereça sugestões práticas e encorajadoras para melhorar a próxima aplicação. Seja específico e baseado em evidências da metodologia SAI.`;

  const response = await getClient().messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: 'Você é um mentor pedagógico especializado em Sala de Aula Invertida. Ofereça sugestões práticas, encorajadoras e baseadas em evidências. Responda em português brasileiro.',
    messages: [{ role: 'user', content: prompt }],
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}
