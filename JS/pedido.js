const WHATSAPP_NUMERO = '5586999158038';

document.addEventListener('DOMContentLoaded', () => {
    const btnPedido = document.getElementById('btn-pedido-whatsapp');

    function formatarPreco(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function coletarPedido() {
        const linhas = [];
        let total = 0;

        document.querySelectorAll('.item-cardapio').forEach(item => {
            const qtd = parseInt(item.querySelector('.qtd-valor').textContent, 10);
            if (qtd > 0) {
                const subtotal = parseFloat(item.dataset.preco) * qtd;
                total += subtotal;
                linhas.push(`${qtd}x ${item.dataset.nome} — ${formatarPreco(subtotal)}`);
            }
        });

        return { linhas, total };
    }

    function horarioDoPedido() {
        const agora = new Date();
        const data = agora.toLocaleDateString('pt-BR');
        const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        return `${data} às ${hora}`;
    }

    function montarMensagemComprovante() {
        const { linhas, total } = coletarPedido();

        if (linhas.length === 0) {
            return `Olá! Já fiz meu pedido com a Tiazinha e vou pagar com Pix.\nHorário: ${horarioDoPedido()}\n\nSegue o comprovante:`;
        }

        return (
            'Olá! Fiz meu pedido pelo cardápio digital:\n\n' +
            linhas.join('\n') +
            `\n\n*Total: ${formatarPreco(total)}*` +
            `\nHorário do pedido: ${horarioDoPedido()}` +
            '\n\nPaguei com Pix, segue o comprovante:'
        );
    }

    btnPedido.addEventListener('click', () => {
        const mensagem = montarMensagemComprovante();
        const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    });
});