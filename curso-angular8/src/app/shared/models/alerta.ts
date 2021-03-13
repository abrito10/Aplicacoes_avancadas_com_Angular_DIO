// ng g i shared/models/alerta --nospec 
// todos os campos sao opcionais
export interface Alerta {
  titulo?: string;
  descricao?: string;
  btnSucesso?: string;
  btnCancelar?: string;
  corBtnSucesso?: string;
  corBtnCancelar?: string;
  possuirBtnFechar?: boolean;
}
