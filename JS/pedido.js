const WHATSAPP_NUMERO = '5586999158038';

document.addEventListener('DOMContentLoaded', () => {
    const btnPedido = document.getElementById('btn-pedido-whatsapp');

    function formatarPreco(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function montarMensagemPedido() {
        const linhas = [];
        let total = 0;

        document.querySelectorAll('.item-cardapio').forEach(item => {
            const qtd = parseInt(item.querySelector('.qtd-valor').textContent, 10);
            if (qtd > 0) {
                const preco = parseFloat(item.dataset.preco);
                const nome = item.dataset.nome;
                const subtotal = preco * qtd;
                total += subtotal;
                linhas.push(`${qtd}x ${nome} — ${formatarPreco(subtotal)}`);
            }
        });

        if (linhas.length === 0) return null;

        return 'Olá! Quero fazer o seguinte pedido:\n\n' +
            linhas.join('\n') +
            `\n\n*Total: ${formatarPreco(total)}*`;
    }

    btnPedido.addEventListener('click', () => {
        const mensagem = montarMensagemPedido();

        if (!mensagem) {
            alert('Escolha pelo menos um item no cardápio antes de enviar o pedido.');
            return;
        }

        const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    });
});
