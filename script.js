// Aguarda o carregamento completo do DOM para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona todos os elementos importantes da página
    const itensCardapio = document.querySelectorAll('.cardapio-item');
    const valorTotalEl = document.getElementById('valor-total');
    const btnNovoPedido = document.getElementById('btn-novo-pedido');

    // Função para calcular e atualizar o valor total do pedido
    const atualizarTotal = () => {
        let total = 0;

        // Itera sobre cada item do cardápio
        itensCardapio.forEach(item => {
            const precoEl = item.querySelector('.produto-preco');
            const quantidadeEl = item.querySelector('.quantidade');
            
            // Pega o preço do atributo 'data-preco' e a quantidade do span
            const preco = parseFloat(precoEl.dataset.preco);
            const quantidade = parseInt(quantidadeEl.textContent);

            // Soma ao total o preço multiplicado pela quantidade
            total += preco * quantidade;
        });

        // Formata o valor total como moeda brasileira (BRL) e exibe no rodapé
        valorTotalEl.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    // Adiciona os eventos de clique para os botões de cada item
    itensCardapio.forEach(item => {
        const btnAdicionar = item.querySelector('.btn-adicionar');
        const btnSubtrair = item.querySelector('.btn-subtrair');
        const quantidadeEl = item.querySelector('.quantidade');

        // Evento para o botão de adicionar (+)
        btnAdicionar.addEventListener('click', () => {
            let quantidade = parseInt(quantidadeEl.textContent);
            quantidade++;
            quantidadeEl.textContent = quantidade;
            atualizarTotal(); // Recalcula o total
        });

        // Evento para o botão de subtrair (-)
        btnSubtrair.addEventListener('click', () => {
            let quantidade = parseInt(quantidadeEl.textContent);
            // Impede que a quantidade seja negativa
            if (quantidade > 0) {
                quantidade--;
                quantidadeEl.textContent = quantidade;
                atualizarTotal(); // Recalcula o total
            }
        });
    });

    // Evento para o botão "Novo Pedido"
    btnNovoPedido.addEventListener('click', () => {
        // Exibe uma caixa de confirmação
        const confirmar = confirm('Deseja realmente limpar o pedido atual?');

        if (confirmar) {
            // Zera a quantidade de todos os itens
            itensCardapio.forEach(item => {
                const quantidadeEl = item.querySelector('.quantidade');
                quantidadeEl.textContent = '0';
            });
            atualizarTotal(); // Atualiza o total para R$ 0,00
        }
    });

    // Garante que o total inicial seja R$ 0,00
    atualizarTotal();
});