# Pharmil: posicionamento e página /original

Data: 2026-09-24. Aprovado em conversa com o dono do negócio.

Este documento fixa o posicionamento da Pharmil para o funil pago e para os
criativos de UGC, e descreve a página `/original` que recebe esse tráfego.

## Posicionamento

### Nicho

Peptídeos injetáveis para emagrecimento, com foco em Tirzepatida, vendidos
pelo WhatsApp a consumidor final no Brasil. A operação é paraguaia, com
registro na DINAVISA, e a dispensação é feita por farmácia parceira habilitada.

### Público

Consumidor final que quer emagrecer, na maioria dos casos usando GLP-1 pela
primeira vez. Não é revendedor nem profissional de saúde. Chega pelo celular,
compra para si e decide sozinha, sem médico acompanhando o pedido.

### Dor principal

Medo de injetar produto falsificado. É a objeção que mais derruba venda no
WhatsApp, e ela tem fundamento: há muita ampola falsa no mercado e a pessoa
sabe disso. Preço, dúvida de uso e desconfiança do canal aparecem, mas vêm
depois.

### Mecanismo único

O Valiq (`valiq.app`). Cada caixa com o QR pode ser conferida pela própria
cliente: ela aponta a câmera e a verificação consulta o laboratório fabricante
e o registro na DINAVISA. A prova sai da fonte, e a Pharmil não precisa ser
acreditada. A ferramenta soma mais de 89 mil verificações.

Nenhum concorrente conhecido oferece isso. A maioria pede confiança.

### Big idea

"Não precisa confiar na gente. Confira com quem fabricou."

A comunicação inteira abre mão de convencer e entrega a conferência. O Valiq
é o centro da mensagem. A frase se apoia no slogan que a ferramenta já usa,
"Antes de confiar, Valiq".

### Caminhos descartados

"O falso não avisa", que lideraria pelo medo, foi descartado porque converte
por susto, contraria o PRODUCT.md ("nunca em exagero promocional") e atrai
atenção regulatória. "A caixa que se explica", focado no produto, foi
descartado por não render formato de vídeo.

## Página /original

Recebe o tráfego dos criativos de UGC e leva ao WhatsApp. Fica separada da
home, que é catálogo, e da `/grupo`, que é sorteio. Não tem navegação de
seção porque cada link numa página de tráfego pago é uma saída. Está marcada
como `noindex`, como a `/grupo`.

### Dobras

1. Hero com a big idea e a caixa do T.G. 15 flutuando dentro de um visor de
   câmera, para mostrar o gesto de escanear sem simular uma tela de resultado
   que a pessoa não vai ver igual no aparelho dela.
2. Seção curta reconhecendo o medo, sem estatística de terror nem imagem de
   ampola falsa.
3. Como conferir, em três passos. É uma sequência real, então os números
   descrevem ordem de fato.
4. O número de verificações, em tipografia grande.
5. O que mais a cliente pode conferir: laudo do lote, temperatura, rastreio e
   dispensação habilitada.
6. Dúvidas que travam a compra.
7. CTA final no WhatsApp.

### O que fica de fora

Preço e catálogo ficam para o WhatsApp, porque quem chega com medo está
decidindo de quem comprar, não quanto pagar. O sorteio fica na `/grupo`,
porque atrai um público que quer o produto de graça, e a verificação atrai
quem quer segurança. Depoimento inventado não entra.

### Copy

Revisada com o skill `humanizer`. O contraste "não precisa confiar na gente"
aparece só no título, onde é a big idea. O selo diz "Verificação na fonte" e
não "independente", porque a independência vem do fabricante e do órgão
regulador, não da ferramenta. O passo 2 não cita a Indufar pelo nome, porque
ela fabrica o T.G. e não a Lipoless.

### Implementação

Reaproveita os estilos `lp-*` da `/grupo` e os componentes do design system.
Os estilos próprios da página ficam em `styles/original.css`, com todo valor
vindo de token.

## Roteiros de UGC

Os três seguem o mesmo esqueleto: cliente cética, escaneia a caixa, reage ao
resultado, sente alívio. O escaneamento acontece de verdade na gravação. Os
roteiros não prometem emagrecimento nem resultado clínico.

Quem grava precisa ter comprado e escaneado de fato. O anúncio precisa marcar
a parceria paga, como exigem Meta e TikTok.

### 1. A cética

Primeira compra, público mais frio.

- 0 a 3 s: "Eu quase não comprei, porque achei que ia ser falso."
- 3 a 10 s: "Tirzepatida tá em todo lugar e muita coisa é falsificada. Eu não
  ia injetar qualquer coisa."
- 10 a 18 s, câmera na caixa: "Aí eles me falaram: não acredita na gente,
  escaneia a caixa."
- 18 a 25 s, tela do Valiq: lê em voz alta o que aparece.
- 25 a 30 s: "Foi a primeira vez que eu não precisei acreditar em ninguém."
  Chamada para o link.

### 2. O teste

Demonstração quase sem fala, para público que já pesquisou.

- 0 a 3 s: "Vou testar se essa caixa é original, agora."
- 3 a 15 s: tira a caixa da térmica, mostra o lacre, aponta a câmera.
- 15 a 25 s: a verificação aparece e a pessoa lê o resultado.
- 25 a 30 s: "Pronto. Quem confirmou foi quem fabricou." Chamada para o link.

### 3. A comparação

Público que já comprou de outro vendedor.

- 0 a 3 s: "Da última vez que eu comprei, não tinha como saber se era
  original."
- 3 a 12 s: conta que pagou, recebeu e ficou na dúvida se usava.
- 12 a 22 s: escaneia a caixa da Pharmil na câmera.
- 22 a 30 s: "Dessa vez eu sei o que tô injetando." Chamada para o link.

### Sobre o pacote Novoads

As skills em `github.com/novoads/agent-skills` geram e clonam anúncios em vídeo
pela API da Novoads, que exige chave paga (planos a partir de US$ 49/mês). Os
roteiros acima servem para gravação com criador real e também como base para
a skill `clone-video-ad`, se a conta for criada.

## Riscos

O QR precisa ler sempre. Um scan que falha na frente da cliente derruba a
promessa inteira.

Falta confirmar quais produtos trazem o QR do Valiq. A página não afirma que
toda caixa tem, e não deve afirmar até essa resposta.

O criativo do sorteio na `/grupo` traz data estampada e exige troca a cada
sorteio.
