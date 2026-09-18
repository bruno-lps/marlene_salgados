document.addEventListener('DOMContentLoaded', () => {
    if (window.__carrinhoJaIniciado) return; // evita ligar tudo 2x se o script for incluído por engano mais de uma vez
    window.__carrinhoJaIniciado = true;

    const itens = document.querySelectorAll('.item-cardapio');
    const elItens = document.getElementById('carrinho-itens');
    const elTotal = document.getElementById('carrinho-total');

    function formatarPreco(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function atualizarResumo() {
        let totalItens = 0;
        let totalValor = 0;

        itens.forEach(item => {
            const preco = parseFloat(item.dataset.preco);
            const qtd = parseInt(item.querySelector('.qtd-valor').textContent, 10);
            totalItens += qtd;
            totalValor += preco * qtd;
        });

        elItens.textContent = totalItens === 1 ? '1 item' : `${totalItens} itens`;
        elTotal.textContent = formatarPreco(totalValor);
    }

    itens.forEach(item => {
        const qtdValor = item.querySelector('.qtd-valor');
        const btnMenos = item.querySelector('[data-acao="menos"]');
        const btnMais = item.querySelector('[data-acao="mais"]');

        btnMais.addEventListener('click', () => {
            qtdValor.textContent = parseInt(qtdValor.textContent, 10) + 1;
            atualizarResumo();
        });

        btnMenos.addEventListener('click', () => {
            const atual = parseInt(qtdValor.textContent, 10);
            if (atual > 0) {
                qtdValor.textContent = atual - 1;
                atualizarResumo();
            }
        });
    });

    atualizarResumo();
});
