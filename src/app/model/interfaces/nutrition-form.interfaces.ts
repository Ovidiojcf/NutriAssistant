// Tipos básicos
export type SimNao = 'sim' | 'nao';
export type Classificacao = 'Ausente' | 'Leve' | 'Moderado' | 'Grave';
export type CapacidadeFuncional = 'abaixoNormal' | 'acamado';
export type Diagnostico = 'baixoEstresse' | 'moderadoEstresse' | 'altoEstresse';

// Interfaces para cada formulário
export interface NRS1Form {
  data?: string;
  pIMC?: SimNao;
  pPerda?: SimNao;
  pReducao?: SimNao;
  pEstado?: SimNao;

  // Campos adicionais que já estão no formNRS1
  pesoAtual?: number;
  pesoHabitual?: number;
  perdaPeso?: number;
  porcetagemPerda?: number;

  // Campo calculado
  imc?: number;
}

export interface NRS2Form {
  eNutricionalPrejudicado?: Classificacao;
  gravidadeDoenca?: Classificacao;
}

export interface ASGForm {
  // Seção Peso
  mudancaPeso?: SimNao;
  continuaPerdendoPeso?: SimNao;
  pesoAtual?: number;
  pesoHabitual?: number;
  perdaPeso?: number;

  // Seção Dieta
  mudancaDieta?: SimNao;
  dietaHipocalorica?: boolean;
  dietaPastosaHipocalorica?: boolean;
  dietaLiquida?: boolean;
  jejum?: boolean;
  mudancaPersistente?: boolean;

  // Sintomas Gastrointestinais
  disfagia?: boolean;
  nauseas?: boolean;
  vomitos?: boolean;
  diarreia?: boolean;
  anorexia?: boolean;

  // Capacidade Funcional
  capacidadeFuncional?: CapacidadeFuncional;

  // Diagnóstico
  diagnostico?: Diagnostico;

  // Exame Físico
  perdaGordura?: Classificacao;
  perdaMusculo?: Classificacao;
  edemaSacral?: Classificacao;
  edemaTornozelo?: Classificacao;
  ascite?: Classificacao;

  // Observações
  evolucaoNutricional?: string;

  // Campos calculados
  imc?: number;
}
