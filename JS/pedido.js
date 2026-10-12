const WHATSAPP_NUMERO = '5586999158038';

document.addEventListener('DOMContentLoaded', () => {
    const btnPedido = document.getElementById('btn-pedido-whatsapp');

    function formatarPreco(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function calcularTotal() {
        let total = 0;
        document.querySelectorAll('.item-cardapio').forEach(item => {
            const qtd = parseInt(item.querySelector('.qtd-valor').textContent, 10);
            if (qtd > 0) {
                total += parseFloat(item.dataset.preco) * qtd;
            }
        });
        return total;
    }

    function montarMensagemComprovante() {
        const total = calcularTotal();

        if (total <= 0) {
            return 'Olá! Já fiz meu pedido com a Tiazinha e vou pagar com Pix. Segue o comprovante:';
        }

        return `Olá! Já fiz meu pedido com a Tiazinha (Total: ${formatarPreco(total)}) e paguei com Pix. Segue o comprovante:`;
    }

    btnPedido.addEventListener('click', () => {
        const mensagem = montarMensagemComprovante();
        const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    });
});
