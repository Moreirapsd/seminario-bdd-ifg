export class Pedido {
  constructor({ regiao = 'Centro-Oeste' } = {}) {
    this.regiao = regiao;
    this.subtotal = 0;
    this.temEstoque = true;
    this.frete = 0;
    this.desconto = 0;
    this.total = 0;
    this.bloqueado = false;
    this.mensagemErro = null;
  }

  definirItens(subtotal, estoqueDisponivel = true) {
    this.subtotal = parseFloat(subtotal);
    this.temEstoque = estoqueDisponivel;
  }

  definirRegiao(regiao) {
    this.regiao = regiao;
  }

  calcularTotais() {
    // RN-03: Consistência de Estoque
    if (!this.temEstoque) {
      this.bloqueado = true;
      this.mensagemErro = 'Item esgotado. Atualize seu carrinho para continuar.';
      return;
    }

    // RN-01: Frete Grátis (>= R$ 200,00 para Sudeste ou Centro-Oeste)
    const regioesValidas = ['Centro-Oeste', 'Sudeste'];
    if (this.subtotal >= 200.00 && regioesValidas.includes(this.regiao)) {
      this.frete = 0.00;
    } else {
      this.frete = 20.00;
    }

    // RN-02: Desconto Progressivo (10% para compras >= R$ 300,00)
    if (this.subtotal >= 300.00) {
      this.desconto = Number((this.subtotal * 0.10).toFixed(2));
    } else {
      this.desconto = 0.00;
    }

    // Cálculo do Total Final
    this.total = Number((this.subtotal - this.desconto + this.frete).toFixed(2));
  }
}