# language: pt
Funcionalidade: Fechamento de pedido com regras de frete e desconto progressivo
  Como um cliente da loja virtual
  Quero que o sistema calcule automaticamente meus descontos e custos de frete
  Para que eu finalize minha compra com transparência sobre os valores

  Contexto:
    Dado que a loja virtual opera com frete padrão de R$ 20,00 para Sudeste e Centro-Oeste
    E a política de frete grátis é aplicada para compras a partir de R$ 200,00
    E a política de desconto progressivo concede 10% para compras a partir de R$ 300,00

  # 1. Cenário Principal (Caminho Feliz: Frete Grátis + Desconto 10%)
  Cenário: Fechamento de pedido de alto valor com desconto progressivo e frete grátis
    Dado que o cliente adicionou R$ 400,00 em produtos com estoque disponível
    E o endereço de entrega é na região "Centro-Oeste"
    Quando o cliente calcula os totais do pedido
    Então o valor do frete cobrado deve ser de R$ 0,00
    E o valor do desconto aplicado deve ser de R$ 40,00
    E o valor final total do pedido deve ser de R$ 360,00

  # 2. Cenário Alternativo (Frete Grátis sem Desconto Percentual)
  Cenário: Fechamento de pedido intermediário com frete grátis e sem desconto percentual
    Dado que o cliente adicionou R$ 250,00 em produtos com estoque disponível
    E o endereço de entrega é na região "Sudeste"
    Quando o cliente calcula os totais do pedido
    Então o valor do frete cobrado deve ser de R$ 0,00
    E o valor do desconto aplicado deve ser de R$ 0,00
    E o valor final total do pedido deve ser de R$ 250,00

  # 3. Cenários de Fronteira (Limites Numéricos de R$ 200,00 e R$ 300,00)
  Esquema do Cenário: Validação de limites de fronteira para frete e desconto
    Dado que o cliente adicionou <subtotal> em produtos com estoque disponível
    E o endereço de entrega é na região "Centro-Oeste"
    Quando o cliente calcula os totais do pedido
    Então o valor do frete cobrado deve ser de <frete_esperado>
    E o valor do desconto aplicado deve ser de <desconto_esperado>
    E o valor final total do pedido deve ser de <total_final>

    Exemplos:
      | subtotal  | frete_esperado | desconto_esperado | total_final |
      | R$ 199,99 | R$ 20,00       | R$ 0,00           | R$ 219,99   |
      | R$ 200,00 | R$ 0,00        | R$ 0,00           | R$ 200,00   |
      | R$ 299,99 | R$ 0,00        | R$ 0,00           | R$ 299,99   |
      | R$ 300,00 | R$ 0,00        | R$ 30,00          | R$ 270,00   |

  # 4. Cenário de Exceção (Esgotamento de Estoque)
  Cenário: Tentativa de fechamento com produto sem estoque suficiente
    Dado que o cliente possui produtos no carrinho no valor de R$ 350,00
    Mas um dos itens do carrinho teve seu estoque esgotado por outro comprador
    Quando o cliente tenta prosseguir para a finalização do pedido
    Então o sistema deve bloquear a finalização do pedido
    E exibir a mensagem "Item esgotado. Atualize seu carrinho para continuar."