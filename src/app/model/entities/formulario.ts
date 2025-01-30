export interface Formulario {

    formularioId : string;
    data: Date;
    pIMC : string;
    pPerda : string;
    pReducao : string;
    pEstado : string;
    eNutricionalPrejudicado: string;
    gravidadeDoenca: string;
    pontos: number;
    estadoNutricional: string; // refere-se a soma das pontuações das suas colunas nutricional prejudicado e gravidade da doença 
    dietaPrescrita: string; // campo final da parte2 
    mudancaPeso: string;
    continuaPerdaPeso: string;
    porcetagemPerda: string;
    pesoAtual: string;
    pesoHabitual: string;
    tempo: string;
    pesoInternacao: string;
    diasInternado: string;

}
