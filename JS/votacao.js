const FIREBASE_URL = 'https://marlene-sagados-default-rtdb.firebaseio.com';
const CHAVE_VOTO_LOCAL = 'tiazinha_ja_votou';

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.voto-card');
    const rankingLista = document.getElementById('ranking-lista');
    const rankingSecao = document.getElementById('ranking-secao');
    const votoMsg = document.getElementById('voto-msg');
    const btnVerRanking = document.getElementById('btn-ver-ranking');

    async function registrarVoto(item) {
        const url = `${FIREBASE_URL}/votos/${encodeURIComponent(item)}.json`;
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(true)
        });
    }

    async function carregarRanking() {
        const url = `${FIREBASE_URL}/votos.json`;
        const resposta = await fetch(url);
        const dados = await resposta.json();

        const contagem = {};
        if (dados) {
            Object.keys(dados).forEach(item => {
                contagem[item] = Object.keys(dados[item] || {}).length;
            });
        }

        const ranking = Object.entries(contagem).sort((a, b) => b[1] - a[1]);

        rankingLista.innerHTML = '';
        if (ranking.length === 0) {
            rankingLista.innerHTML = '<li>Ainda não há votos. Seja o primeiro!</li>';
            return;
        }

        ranking.forEach(([nome, votos], index) => {
            const li = document.createElement('li');
            li.className = 'ranking-item';
            li.innerHTML = `
                <span class="ranking-posicao">${index + 1}º</span>
                <span class="ranking-nome">${nome}</span>
                <span class="ranking-votos">${votos} voto${votos === 1 ? '' : 's'}</span>
            `;
            rankingLista.appendChild(li);
        });
    }

    function bloquearVotoNovamente() {
        cards.forEach(card => card.disabled = true);
    }

    if (localStorage.getItem(CHAVE_VOTO_LOCAL)) {
        bloquearVotoNovamente();
        votoMsg.textContent = 'Você já votou! Aqui está o ranking atual 👇';
        votoMsg.classList.remove('oculto');
    }

    cards.forEach(card => {
        card.addEventListener('click', async () => {
            if (localStorage.getItem(CHAVE_VOTO_LOCAL)) return;

            const item = card.dataset.item;
            bloquearVotoNovamente();
            localStorage.setItem(CHAVE_VOTO_LOCAL, item);

            await registrarVoto(item);

            votoMsg.textContent = `Voto em "${item}" registrado! Obrigado 🎉`;
            votoMsg.classList.remove('oculto');

            await carregarRanking();
            rankingSecao.classList.remove('oculto');
            rankingSecao.scrollIntoView({ behavior: 'smooth' });
        });
    });

    btnVerRanking.addEventListener('click', async () => {
        await carregarRanking();
        rankingSecao.classList.remove('oculto');
        rankingSecao.scrollIntoView({ behavior: 'smooth' });
    });
});
