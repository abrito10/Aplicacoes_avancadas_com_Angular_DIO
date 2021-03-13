// a criacao da interface garante a integridade dos dados 
export interface Filme {
  id?: number; // o ponto de interrogacao deixa o campo como opcional
  titulo: string;
  urlFoto?: string;
  dtLancamento: Date;
  descricao?: string;
  nota: number;
  urlIMDb?: string;
  genero: string;
}

// para gerar a interface no terminal digitar
// ng g i shared/model/filme 
// ng - comando
// g - generate
// i - interface
// shared - pasta que seta criada
// model -pasta que sere criada
// filme - nome do aqruivo que sera criado  e sera incluindo o .ts
