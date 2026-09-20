// Funcionamento: Segunda a Sexta, das 7h00 às 11h30
document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('status-funcionamento');
    if (!el) return;

    function atualizarStatus() {
        const agora = new Date();
        const dia = agora.getDay(); // 0 = domingo ... 6 = sábado
        const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

        const abreMinutos = 7 * 60;        // 07:00
        const fechaMinutos = 11 * 60 + 30; // 11:30

        const diaUtil = dia >= 1 && dia <= 5; // segunda a sexta
        const dentroDoHorario = minutosAgora >= abreMinutos && minutosAgora < fechaMinutos;
        const aberto = diaUtil && dentroDoHorario;

        el.textContent = aberto
            ? '🟢 Aberto agora'
            : '🔴 Fechado agora — Seg a Sex, 7h às 11h30';

        el.classList.toggle('aberto', aberto);
        el.classList.toggle('fechado', !aberto);
    }

    atualizarStatus();
    setInterval(atualizarStatus, 60000); // reavalia a cada minuto, sem precisar recarregar a página
});
