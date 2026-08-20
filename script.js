// Aguarda o carregamento completo do DOM para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona todos os elementos importantes da página
    const itensCardapio = document.querySelectorAll('.cardapio-item');
    const valorTotalEl = document.getElementById('valor-total');
    const btnFinalizarPedido = document.getElementById('btn-finalizar-pedido');
    const menuPrincipal = document.getElementById('menu-principal');
    const resumoPedido = document.getElementById('resumo-pedido');
    const listaResumo = document.getElementById('lista-resumo');
    const btnVoltar = document.getElementById('btn-voltar');
    const btnLimparPedido = document.getElementById('btn-limpar-pedido');
    const toast = document.getElementById('toast');

    // Função para mostrar a notificação (Toast)
    const mostrarToast = (mensagem) => {
        toast.textContent = mensagem;
        toast.classList.add('mostrar');
        
        // Remove a notificação após 2 segundos
        setTimeout(() => {
            toast.classList.remove('mostrar');
        }, 2000);
    };

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

        // Adiciona ou remove animação do botão de Ver Resumo
        if (total > 0) {
            btnFinalizarPedido.classList.add('botao-destaque-animado');
        } else {
            btnFinalizarPedido.classList.remove('botao-destaque-animado');
        }
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
            
            const nomeItem = item.querySelector('h3').textContent;
            mostrarToast(`${nomeItem} adicionado!`);
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

    // Evento para o botão "Ver Resumo" no rodapé
    btnFinalizarPedido.addEventListener('click', () => {
        let total = 0;
        listaResumo.innerHTML = '';
        
        itensCardapio.forEach(item => {
            const quantidade = parseInt(item.querySelector('.quantidade').textContent);
            if (quantidade > 0) {
                const nome = item.querySelector('h3').textContent;
                const preco = parseFloat(item.querySelector('.produto-preco').dataset.preco);
                const subtotal = preco * quantidade;
                total += subtotal;
                
                const li = document.createElement('li');
                li.innerHTML = `<span>${quantidade}x ${nome}</span> <span>${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>`;
                listaResumo.appendChild(li);
            }
        });

        if (total === 0) {
            alert('Por favor, adicione pelo menos um item ao seu pedido.');
            return;
        }

        // Adiciona linha do total no resumo
        const liTotal = document.createElement('li');
        liTotal.classList.add('total-resumo');
        liTotal.innerHTML = `<span>TOTAL</span> <span>${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>`;
        listaResumo.appendChild(liTotal);

        // Esconde menu e mostra resumo
        menuPrincipal.classList.add('escondido');
        menuPrincipal.classList.remove('animacao-tela');
        
        resumoPedido.classList.remove('escondido');
        resumoPedido.classList.add('animacao-tela');
        
        // Esconde o footer original
        document.querySelector('footer').classList.add('escondido');
    });

    // Evento para voltar e editar o pedido
    btnVoltar.addEventListener('click', () => {
        resumoPedido.classList.add('escondido');
        resumoPedido.classList.remove('animacao-tela');
        
        menuPrincipal.classList.remove('escondido');
        menuPrincipal.classList.add('animacao-tela');
        
        document.querySelector('footer').classList.remove('escondido');
    });

    // Evento para limpar o pedido
    btnLimparPedido.addEventListener('click', () => {
        const confirmar = confirm('Deseja realmente limpar o pedido atual?');
        if (confirmar) {
            itensCardapio.forEach(item => {
                item.querySelector('.quantidade').textContent = '0';
            });
            atualizarTotal();
            
            // Volta para a tela inicial
            menuPrincipal.classList.remove('escondido');
            resumoPedido.classList.add('escondido');
            document.querySelector('footer').classList.remove('escondido');
        }
    });

    // Garante que o total inicial seja R$ 0,00
    atualizarTotal();
});