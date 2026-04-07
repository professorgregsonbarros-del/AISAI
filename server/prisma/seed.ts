import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const trailContents = [
  {
    title: 'O que é a Sala de Aula Invertida?',
    body: `A Sala de Aula Invertida (SAI) é uma abordagem pedagógica onde o conteúdo teórico é estudado pelo aluno **antes** da aula presencial. Na aula, o tempo é dedicado a atividades práticas, discussões e resolução de problemas com o suporte do professor.\n\n**Benefícios comprovados:**\n- Maior engajamento dos alunos\n- Aprendizagem mais profunda\n- Desenvolvimento de autonomia\n- Tempo de aula otimizado para interação`,
    context: 'general',
    duration: '3 min',
    order: 1,
  },
  {
    title: 'Por que a Pré-Aula é Essencial?',
    body: `A fase de pré-aula é o alicerce da SAI. Sem ela, a aula presencial perde seu propósito.\n\n**Dicas para uma pré-aula eficaz:**\n- Use materiais curtos (vídeos de 5-10 min, textos de 1-2 páginas)\n- Inclua uma atividade simples de verificação (quiz rápido)\n- Considere os recursos disponíveis para os alunos\n- Estabeleça prazos claros\n\n**Erro comum:** Enviar conteúdo extenso sem orientação. O aluno precisa saber *o que* estudar e *por que*.`,
    context: 'pre-class',
    duration: '2 min',
    order: 2,
  },
  {
    title: 'Conduzindo a Aula Presencial na SAI',
    body: `Na SAI, a aula presencial é o momento de **aplicar** o conhecimento, não de transmiti-lo.\n\n**Estratégias eficazes:**\n- Comece com uma revisão rápida (5 min) do conteúdo pré-aula\n- Use atividades em grupo para resolução de problemas\n- Circule pela sala dando feedback individual\n- Reserve tempo para dúvidas coletivas\n\n**O papel do professor muda:** de transmissor para facilitador e mentor.`,
    context: 'in-class',
    duration: '2 min',
    order: 3,
  },
  {
    title: 'Avaliação Formativa na SAI',
    body: `A avaliação formativa é contínua e orientada para a aprendizagem, diferente da avaliação somativa (provas).\n\n**Métodos recomendados:**\n- Quizzes rápidos no início da aula\n- Observação durante atividades em grupo\n- Autoavaliação dos alunos\n- Feedback entre pares\n- Portfólios de aprendizagem\n\n**Importante:** A avaliação formativa serve para ajustar o ensino, não para classificar alunos.`,
    context: 'assessment',
    duration: '2 min',
    order: 4,
  },
  {
    title: 'IA na Educação: Uso Ético e Estratégico',
    body: `A Inteligência Artificial pode ser uma aliada poderosa na educação, mas requer uso consciente.\n\n**Princípios para uso ético da IA:**\n- A IA sugere, o professor decide\n- Todo conteúdo gerado deve ser revisado e adaptado\n- Transparência: alunos devem saber quando IA foi utilizada\n- A IA complementa, não substitui, a expertise pedagógica\n\n**Na SAI:** Use IA para criar materiais de pré-aula, gerar quizzes e obter sugestões de atividades — sempre com sua curadoria.`,
    context: 'general',
    duration: '3 min',
    order: 5,
  },
  {
    title: 'E se os Alunos Não Fizerem a Pré-Aula?',
    body: `Este é o desafio mais comum na SAI. Estratégias comprovadas:\n\n1. **Accountability:** Quiz rápido no início da aula sobre o conteúdo\n2. **Valor percebido:** Mostre que a pré-aula é essencial para a atividade presencial\n3. **Acessibilidade:** Garanta que os materiais são acessíveis (offline, mobile)\n4. **Engajamento:** Use formatos variados (vídeo, podcast, infográfico)\n5. **Gradualidade:** Comece com tarefas curtas e aumente progressivamente\n\n**Não puna — motive.** O objetivo é criar o hábito de estudo prévio.`,
    context: 'pre-class',
    duration: '2 min',
    order: 6,
  },
  {
    title: 'Atividades Colaborativas que Funcionam',
    body: `Na aula presencial da SAI, atividades colaborativas são fundamentais.\n\n**Formatos eficazes:**\n- **Think-Pair-Share:** Reflexão individual → dupla → grupo\n- **Jigsaw:** Cada grupo estuda uma parte e ensina aos demais\n- **Estudo de caso:** Análise prática em grupo com apresentação\n- **Debate estruturado:** Argumentação baseada no conteúdo pré-aula\n\n**Dica:** Grupos de 3-4 alunos funcionam melhor que duplas ou grupos grandes.`,
    context: 'in-class',
    duration: '2 min',
    order: 7,
  },
  {
    title: 'Reflexão Docente: Por que Registrar?',
    body: `A reflexão após cada aula é o que transforma experiência em expertise.\n\n**O que registrar:**\n- O que funcionou e por quê\n- O que não funcionou e possíveis causas\n- Reações e engajamento dos alunos\n- Ideias para melhoria\n\n**Benefícios a longo prazo:**\n- Identifica padrões no seu ensino\n- Documenta sua evolução profissional\n- Cria um banco de práticas validadas\n- Facilita o compartilhamento com colegas`,
    context: 'general',
    duration: '2 min',
    order: 8,
  },
];

async function main() {
  console.log('Seeding trail content...');

  const existing = await prisma.trailContent.count();
  if (existing > 0) {
    console.log(`Trails already seeded (${existing} items). Skipping.`);
    return;
  }

  await prisma.trailContent.createMany({ data: trailContents });

  console.log(`Seeded ${trailContents.length} trail content items.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
