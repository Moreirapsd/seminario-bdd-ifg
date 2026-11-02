import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { Pedido } from '../../src/pedido.js';

let pedido;

function extrairValorMonetario(texto) {
  // Limpa R$, espaços e converte formato "200,00" ou "199.99" para float puro
  const limpo = texto.replace(/R\$\s?/, '').trim().replace(/\./g, '').replace(',', '.');
  return parseFloat(limpo);
}

// 1. Passos do Contexto (Flexíveis para aceitar R$ com vírgula ou ponto)
Given(/^que a loja virtual opera com frete padrão de R\$ ([\d,.]+) para Sudeste e Centro-Oeste$/, function (valorFrete) {
  pedido = new Pedido();
});

Given(/^a política de frete grátis é aplicada para compras a partir de R\$ ([\d,.]+)$/, function (valorMinimo) {
  // Regra RN-01 documentada no contexto
});

Given(/^a política de desconto progressivo concede (\d+)% para compras a partir de R\$ ([\d,.]+)$/, function (percentual, valorMinimo) {
  // Regra RN-02 documentada no contexto
});

// 2. Passos dos Cenários Principais, Alternativos e Fronteiras
Given(/^que o cliente adicionou (R\$\s?[\d,.]+) em produtos com estoque disponível$/, function (textoValor) {
  const subtotal = extrairValorMonetario(textoValor);
  pedido.definirItens(subtotal, true);
});

Given('o endereço de entrega é na região {string}', function (regiao) {
  pedido.definirRegiao(regiao);
});

// 3. Passos do Cenário de Exceção (Item esgotado)
Given(/^que o cliente possui produtos no carrinho no valor de (R\$\s?[\d,.]+)$/, function (textoValor) {
  const subtotal = extrairValorMonetario(textoValor);
  pedido.definirItens(subtotal, true);
});

Given('um dos itens do carrinho teve seu estoque esgotado por outro comprador', function () {
  pedido.temEstoque = false;
});

// 4. Ações (Quando)
When('o cliente calcula os totais do pedido', function () {
  pedido.calcularTotais();
});

When('o cliente tenta prosseguir para a finalização do pedido', function () {
  pedido.calcularTotais();
});

// 5. Validações e Asserções (Então / E)
Then(/^o valor do frete cobrado deve ser de (R\$\s?[\d,.]+)$/, function (textoValor) {
  const freteEsperado = extrairValorMonetario(textoValor);
  assert.strictEqual(pedido.frete, freteEsperado);
});

Then(/^o valor do desconto aplicado deve ser de (R\$\s?[\d,.]+)$/, function (textoValor) {
  const descontoEsperado = extrairValorMonetario(textoValor);
  assert.strictEqual(pedido.desconto, descontoEsperado);
});

Then(/^o valor final total do pedido deve ser de (R\$\s?[\d,.]+)$/, function (textoValor) {
  const totalEsperado = extrairValorMonetario(textoValor);
  assert.strictEqual(pedido.total, totalEsperado);
});

Then('o sistema deve bloquear a finalização do pedido', function () {
  assert.strictEqual(pedido.bloqueado, true);
});

Then('exibir a mensagem {string}', function (mensagemEsperada) {
  assert.strictEqual(pedido.mensagemErro, mensagemEsperada);
});