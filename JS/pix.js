const PIX_CHAVE = '+5586999158038';
const PIX_NOME = 'MARIA MARLENE ARAUJO NORONHA'.slice(0, 25);
const PIX_CIDADE = 'TERESINA';

function tlv(id, valor) {
    const tamanho = String(valor.length).padStart(2, '0');
    return `${id}${tamanho}${valor}`;
}

function crc16(payload) {
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
            crc &= 0xFFFF;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function gerarPayloadPix(valor) {
    const merchantAccountInfo = tlv('00', 'br.gov.bcb.pix') + tlv('01', PIX_CHAVE);
    const additionalData = tlv('05', '***');

    let payload =
        tlv('00', '01') +
        tlv('26', merchantAccountInfo) +
        tlv('52', '0000') +
        tlv('53', '986') +
        tlv('54', valor.toFixed(2)) +
        tlv('58', 'BR') +
        tlv('59', PIX_NOME) +
        tlv('60', PIX_CIDADE) +
        tlv('62', additionalData) +
        '6304';

    return payload + crc16(payload);
}

document.addEventListener('DOMContentLoaded', () => {
    const btnPix = document.getElementById('btn-pix');
    const modal = document.getElementById('modal-pix');
    const fecharPix = document.getElementById('fechar-pix');
    const pixValorExibido = document.getElementById('pix-valor-exibido');
    const pixCopiaCola = document.getElementById('pix-copiacola');
    const btnCopiar = document.getElementById('btn-copiar-pix');
    const copiadoMsg = document.getElementById('copiado-msg');
    const qrcodeDiv = document.getElementById('qrcode-pix');

    function calcularTotal() {
        let total = 0;
        document.querySelectorAll('.item-cardapio').forEach(item => {
            const preco = parseFloat(item.dataset.preco);
            const qtd = parseInt(item.querySelector('.qtd-valor').textContent, 10);
            total += preco * qtd;
        });
        return total;
    }

    btnPix.addEventListener('click', () => {
        const total = calcularTotal();
        if (total <= 0) return;

        const payload = gerarPayloadPix(total);

        pixValorExibido.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        pixCopiaCola.value = payload;
        qrcodeDiv.innerHTML = '';

        try {
            if (typeof QRCode === 'undefined') {
                throw new Error('Biblioteca de QR Code não carregou');
            }
            new QRCode(qrcodeDiv, { text: payload, width: 200, height: 200 });
        } catch (erro) {
            qrcodeDiv.innerHTML = '<p class="qrcode-erro">Não foi possível gerar o QR Code agora (verifique sua internet). Use o código abaixo, copiando e colando no app do banco.</p>';
        }

        copiadoMsg.classList.add('oculto');
        modal.classList.remove('oculto');
    });

    fecharPix.addEventListener('click', () => modal.classList.add('oculto'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('oculto');
    });

    btnCopiar.addEventListener('click', () => {
        pixCopiaCola.select();
        navigator.clipboard.writeText(pixCopiaCola.value).then(() => {
            copiadoMsg.classList.remove('oculto');
        });
    });
});
