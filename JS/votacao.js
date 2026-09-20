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
        const resposta = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(true)
        });
        if (!resposta.ok) {
            throw new Error('Firebase respondeu com erro ao registrar o voto');
        }
    }

    function obterFotoDoItem(nome) {
        const card = document.querySelector(`.voto-card[data-item="${CSS.escape(nome)}"]`);
        const img = card ? card.querySelector('img') : null;
        return img ? img.getAttribute('src') : null;
    }

    async function carregarRanking() {
        try {
            const resposta = await fetch(`${FIREBASE_URL}/votos.json`);
            if (!resposta.ok) {
                throw new Error('Firebase respondeu com erro ao carregar os votos');
            }
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
                const fotoSrc = obterFotoDoItem(nome);
                const fotoHtml = fotoSrc
                    ? `<span class="ranking-foto"><img src="${fotoSrc}" alt="${nome}" onerror="this.parentElement.style.display='none';"></span>`
                    : '';
                li.innerHTML = `
                    <span class="ranking-posicao">${index + 1}º</span>
                    ${fotoHtml}
                    <span class="ranking-nome">${nome}</span>
                    <span class="ranking-votos">${votos} voto${votos === 1 ? '' : 's'}</span>
                `;
                rankingLista.appendChild(li);
            });
        } catch (erro) {
            rankingLista.innerHTML = '<li>Não foi possível carregar o ranking agora. Tente novamente em instantes.</li>';
        }
    }

    if (localStorage.getItem(CHAVE_VOTO_LOCAL)) {
        cards.forEach(card => card.disabled = true);
        votoMsg.textContent = 'Você já votou! Aqui está o ranking atual 👇';
        votoMsg.classList.remove('oculto');
    }

    cards.forEach(card => {
        card.addEventListener('click', async () => {
            if (localStorage.getItem(CHAVE_VOTO_LOCAL)) return;

            const item = card.dataset.item;
            cards.forEach(c => c.disabled = true);

            try {
                await registrarVoto(item);
                localStorage.setItem(CHAVE_VOTO_LOCAL, item);

                votoMsg.textContent = `Voto em "${item}" registrado! Obrigado 🎉`;
                votoMsg.classList.remove('oculto');

                await carregarRanking();
                rankingSecao.classList.remove('oculto');
                rankingSecao.scrollIntoView({ behavior: 'smooth' });
            } catch (erro) {
                cards.forEach(c => c.disabled = false);
                votoMsg.textContent = 'Não foi possível registrar seu voto agora. Verifique sua internet e tente novamente.';
                votoMsg.classList.remove('oculto');
            }
        });
    });

    btnVerRanking.addEventListener('click', async () => {
        await carregarRanking();
        rankingSecao.classList.remove('oculto');
        rankingSecao.scrollIntoView({ behavior: 'smooth' });
    });
});
