export const L = "ABCDEFGHIJ";

export type Question = {
  id: string;
  t: "in" | "ch" | "tx" | "sc";
  lbl: string;
  ph?: string;
  opts?: string[];
  la?: string;
  lb?: string;
};

export type Section = {
  id: string;
  eye: string;
  head: string;
  qs: Question[];
};

export type Entry = Record<string, unknown> & {
  id: string;
  ts: string;
  coletor?: string;
  nota?: number;
  nome?: string;
  idade?: string;
  games?: string;
  fin?: string;
  recom?: string;
  aprendeu?: string;
  travou?: string;
  gostou?: string;
  melhoria?: string;
  onde?: string;
};

export const SECS: Section[] = [
  {
    id: "perfil", eye: "Perfil", head: "Quem é você?", qs: [
      { id: "nome", t: "in", lbl: "Como você quer ser chamado?", ph: "Pode ser apelido ou nome fictício" },
      { id: "idade", t: "ch", lbl: "Qual sua faixa de idade?", opts: ["Menos de 16", "16 – 18 anos", "19 – 24 anos", "25 – 30 anos", "31 – 40 anos", "Acima de 40"] },
      { id: "games", t: "ch", lbl: "Com que frequência você joga jogos digitais?", opts: ["Nunca jogo", "Raramente, quase nunca", "Às vezes (casual)", "Toda semana", "Quase todo dia"] },
      { id: "fin", t: "ch", lbl: "Como você avalia seu conhecimento sobre finanças?", opts: ["Nenhum conhecimento", "Entendo o básico", "Sei usar crédito e débito", "Conheço bem", "Trabalho com isso"] },
    ]
  },
  {
    id: "inicio", eye: "Onboarding", head: "Primeiros minutos", qs: [
      { id: "iniciou", t: "ch", lbl: "Conseguiu iniciar o jogo por conta própria?", opts: ["Sim, sem nenhuma dificuldade", "Precisei de uma dica rápida", "Tive bastante dificuldade", "Não consegui iniciar"] },
      { id: "objetivo", t: "ch", lbl: "O objetivo do jogo ficou claro para você?", opts: ["Imediatamente, já no início", "Ficou claro após o tutorial", "Demorei um pouco", "Não ficou claro"] },
      { id: "tutorial", t: "ch", lbl: "O tutorial com o chefe foi útil?", opts: ["Muito útil, explicou tudo", "Útil, mas faltou algo", "Mais ou menos", "Não foi útil"] },
      { id: "tools", t: "ch", lbl: "Conseguiu usar dossiê, calculadora e guia?", opts: ["Todas sem dificuldade", "Usei algumas, não percebi outras", "Tive dificuldade com elas", "Não as encontrei"] },
    ]
  },
  {
    id: "gameplay", eye: "Jogabilidade", head: "Durante o jogo", qs: [
      { id: "prog", t: "ch", lbl: "Como foi sua progressão ao longo dos dias?", opts: ["Avancei facilmente", "Precisei repetir alguma fase", "Tive bastante dificuldade", "Não consegui avançar"] },
      { id: "consq", t: "ch", lbl: "Percebeu que suas escolhas afetam os clientes depois?", opts: ["Sim, percebi claramente", "Percebi mas só mais tarde", "Percebi algo, sem entender bem", "Não percebi"] },
      { id: "tempo", t: "ch", lbl: "O tempo de 8 minutos por fase pareceu…", opts: ["Muito pouco — não deu pra terminar", "Pouco, mas dá pra se virar", "Adequado", "Adequado, sobrou tempo"] },
      { id: "travou", t: "ch", lbl: "Você ficou travado ou confuso em algum momento?", opts: ["Não, o jogo fluiu bem", "Sim, uma vez", "Sim, algumas vezes", "Sim, várias vezes"] },
      { id: "onde", t: "tx", lbl: "Se travou, onde foi? (opcional)", ph: "Ex: na diferença entre crédito rotativo e parcelado…" },
    ]
  },
  {
    id: "aprend", eye: "Aprendizado", head: "O que você aprendeu?", qs: [
      { id: "aprendeu", t: "ch", lbl: "O jogo te ensinou algo novo sobre finanças?", opts: ["Aprendi bastante coisa nova", "Aprendi algumas coisas", "Revisei o que já sabia", "Não aprendi nada novo"] },
      { id: "realismo", t: "ch", lbl: "Os cenários dos clientes pareceram realistas?", opts: ["Muito realistas, me identifiquei", "Moderadamente realistas", "Pouco realistas", "Nada a ver com a realidade"] },
      { id: "erros", t: "ch", lbl: "As explicações quando você errou foram claras?", opts: ["Muito claras e úteis", "Razoáveis", "Um pouco confusas", "Passaram rápido demais, não li"] },
      { id: "habito", t: "ch", lbl: "O jogo te faria repensar algum hábito financeiro?", opts: ["Sim, com certeza", "Provavelmente sim", "Talvez, não tenho certeza", "Provavelmente não"] },
    ]
  },
  {
    id: "geral", eye: "Avaliação final", head: "Experiência geral", qs: [
      { id: "nota", t: "sc", lbl: "Que nota você dá ao jogo?", la: "péssimo", lb: "incrível" },
      { id: "visual", t: "ch", lbl: "O visual pixel art combinou com o jogo?", opts: ["Adorei, é parte do charme", "Gostei bastante", "Indiferente", "Não gostei do estilo"] },
      { id: "recom", t: "ch", lbl: "Você recomendaria esse jogo para alguém?", opts: ["Com certeza", "Provavelmente sim", "Talvez", "Provavelmente não"] },
      { id: "gostou", t: "tx", lbl: "O que você mais gostou no jogo?", ph: "Personagens, progressão, visual, história…" },
      { id: "melhoria", t: "tx", lbl: "O que poderia ser melhorado?", ph: "Tempo, interface, explicações, controles…" },
    ]
  },
];
