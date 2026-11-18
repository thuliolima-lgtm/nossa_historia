
/* ==========================================================
   Nossa História: script.js
   ========================================================== */

const CONFIG = {
  inicio: new Date(2024, 5, 15, 21, 30, 0),
  senha: '',
  fotos: Array.from({ length: 40 }, (_, i) => ({
    src: `imagens/foto${i + 1}.jpeg`,
    legenda: `Nossa lembrança ${i + 1}`
  }))
};

function calcularTempo(inicio, agora) {
  if (agora < inicio) {
    return { anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0 };
  }

  let anos = agora.getFullYear() - inicio.getFullYear();
  let meses = agora.getMonth() - inicio.getMonth();
  let dias = agora.getDate() - inicio.getDate();
  let horas = agora.getHours() - inicio.getHours();
  let minutos = agora.getMinutes() - inicio.getMinutes();
  let segundos = agora.getSeconds() - inicio.getSeconds();

  if (segundos < 0) { segundos += 60; minutos--; }
  if (minutos < 0) { minutos += 60; horas--; }
  if (horas < 0) { horas += 24; dias--; }

  if (dias < 0) {
    dias += new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
    meses--;
  }

  if (meses < 0) {
    meses += 12;
    anos--;
  }

  return { anos, meses, dias, horas, minutos, segundos };
}

function iniciarSite() {
  'use strict';

  const $ = (seletor) => document.querySelector(seletor);
  const $$ = (seletor) => [...document.querySelectorAll(seletor)];

  /* ---------- Senha ---------- */

  function liberarSite() {
    document.body.classList.remove('bloqueado');
  }

  function lerSessao() {
    try {
      return sessionStorage.getItem('site-liberado') === '1';
    } catch (e) {
      return false;
    }
  }

  function salvarSessao() {
    try {
      sessionStorage.setItem('site-liberado', '1');
    } catch (e) {}
  }

  if (!CONFIG.senha || lerSessao()) {
    liberarSite();
  } else {
    const form = $('#form-senha');
    const campo = $('#campo-senha');
    const erro = $('#erro-senha');

    campo.focus();

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (campo.value === CONFIG.senha) {
        salvarSessao();
        liberarSite();
      } else {
        erro.hidden = false;
        campo.value = '';
        campo.focus();
      }
    });
  }

  /* ---------- Imagens ---------- */

  function vigiarImagem(img) {
    const pai = img.parentElement;

    img.addEventListener('error', () => {
      pai.classList.add('sem-imagem');
    });
  }

  $$('.arco img, .capa img').forEach(vigiarImagem);

  /* ---------- Player de música ---------- */

  const audio = $('#audio');
  const player = $('#player');
  const btnPlay = $('#btn-play');
  const btnAnterior = $('#btn-anterior');
  const btnProxima = $('#btn-proxima');
  const nomeMusica = $('#musica-nome');
  const artistaMusica = $('#musica-artista');
  const posicaoMusica = $('#posicao-musica');
  const barra = $('#barra');
  const tempoAtual = $('#tempo-atual');
  const tempoTotal = $('#tempo-total');
  const aviso = $('#aviso-audio');
  const capaImg = $('#capa-img');

  const musicas = [
    {
      titulo: 'Que Sorte a Nossa',
      artista: 'Matheus & Kauan',
      arquivo: './musica/musica1.mp3',
      capa: 'imagens/foto22.jpeg'
    },
    {
      titulo: 'Nosso Lugar',
      artista: 'MC Kevin',
      arquivo: './musica/musica2.mp3',
      capa: 'imagens/foto38.jpeg'
    },
    {
      titulo: 'Na Linha do Tempo',
      artista: 'Victor & Leo',
      arquivo: './musica/musica3.mp3',
      capa: 'imagens/foto40.jpeg'
    },
    {
      titulo: 'Escreve Aí',
      artista: 'Luan Santana',
      arquivo: './musica/musica4.mp3',
      capa: 'imagens/foto19.jpeg'
    }
  ];

  let indiceMusica = 0;

  function formatar(segundos) {
    if (!isFinite(segundos)) return '0:00';

    const m = Math.floor(segundos / 60);
    const s = Math.floor(segundos % 60);

    return m + ':' + String(s).padStart(2, '0');
  }

  function pintarBarra() {
    barra.style.setProperty('--preenchido', barra.value + '%');
  }

  function carregarMusica(indice, tocar = false) {
    indiceMusica = (indice + musicas.length) % musicas.length;

    const musica = musicas[indiceMusica];

    audio.pause();
    audio.src = musica.arquivo;
    audio.load();

    nomeMusica.textContent = musica.titulo;
    artistaMusica.textContent = musica.artista;
    posicaoMusica.textContent = `${indiceMusica + 1} de ${musicas.length}`;

    capaImg.src = musica.capa;
    capaImg.alt = 'Capa de ' + musica.titulo;

    barra.value = 0;
    pintarBarra();

    tempoAtual.textContent = '0:00';
    tempoTotal.textContent = '0:00';

    aviso.hidden = true;
    aviso.textContent = '';

    if (tocar) {
      audio.play().catch((erro) => {
        aviso.textContent = 'Não foi possível tocar. Confira o arquivo ' + musica.arquivo;
        aviso.hidden = false;
      });
    }
  }

  function proximaMusica(tocar = false) {
    carregarMusica(indiceMusica + 1, tocar);
  }

  function musicaAnterior(tocar = false) {
    carregarMusica(indiceMusica - 1, tocar);
  }

  btnPlay.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        aviso.textContent = 'Não foi possível tocar a música. Confira se o arquivo está na pasta musica.';
        aviso.hidden = false;
      });
    } else {
      audio.pause();
    }
  });

  btnAnterior.addEventListener('click', () => {
    const estavaTocando = !audio.paused;
    musicaAnterior(estavaTocando);
  });

  btnProxima.addEventListener('click', () => {
    const estavaTocando = !audio.paused;
    proximaMusica(estavaTocando);
  });

  audio.addEventListener('play', () => {
    player.classList.add('tocando');
    btnPlay.setAttribute('aria-label', 'Pausar música');
    aviso.hidden = true;
  });

  audio.addEventListener('pause', () => {
    player.classList.remove('tocando');
    btnPlay.setAttribute('aria-label', 'Tocar música');
  });

  audio.addEventListener('loadedmetadata', () => {
    tempoTotal.textContent = formatar(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;

    barra.value = (audio.currentTime / audio.duration) * 100;
    tempoAtual.textContent = formatar(audio.currentTime);
    pintarBarra();
  });

  barra.addEventListener('input', () => {
    if (!audio.duration) return;

    audio.currentTime = (barra.value / 100) * audio.duration;
    pintarBarra();
  });

  audio.addEventListener('ended', () => {
    proximaMusica(true);
  });

  audio.addEventListener('error', () => {
    const musica = musicas[indiceMusica];

    aviso.textContent =
      'Não foi possível carregar ' + musica.arquivo +
      '. Confira se o arquivo está dentro da pasta musica.';
    aviso.hidden = false;
  });

  carregarMusica(0);

  /* ---------- Navegação ---------- */

  const paginas = $$('.pagina');
  const links = $$('[data-pagina]');
  const menu = $('#menu');
  const menuBotao = $('#menu-botao');

  const nomes = paginas.map((p) => p.id.replace('pagina-', ''));

  let paginaAtual = null;

  function abrirMenu() {
    menu.classList.add('aberto');
    menuBotao.setAttribute('aria-expanded', 'true');
    menuBotao.setAttribute('aria-label', 'Fechar menu');
  }

  function fecharMenu() {
    menu.classList.remove('aberto');
    menuBotao.setAttribute('aria-expanded', 'false');
    menuBotao.setAttribute('aria-label', 'Abrir menu');
  }

  function mostrarPagina(nome) {
    if (!nomes.includes(nome)) {
      nome = 'inicio';
    }

    // Ao trocar de aba, para a música e seleciona a próxima.
    if (paginaAtual !== null && paginaAtual !== nome) {
      audio.pause();
      proximaMusica(false);
    }

    paginaAtual = nome;

    paginas.forEach((p) => {
      p.hidden = p.id !== 'pagina-' + nome;
    });

    links.forEach((l) => {
      const ativo = l.dataset.pagina === nome;

      l.classList.toggle('ativo', ativo);

      if (ativo) {
        l.setAttribute('aria-current', 'page');
      } else {
        l.removeAttribute('aria-current');
      }
    });

    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });

    fecharMenu();
  }

  function paginaDoHash() {
    return location.hash.replace('#', '') || 'inicio';
  }

  window.addEventListener('hashchange', () => {
    mostrarPagina(paginaDoHash());
  });

  menuBotao.addEventListener('click', () => {
    if (menu.classList.contains('aberto')) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('aberto')) return;

    if (!menu.contains(e.target) && !menuBotao.contains(e.target)) {
      fecharMenu();
    }
  });

  /* ---------- Galeria ---------- */

  const grade = $('#grade');
  const lightbox = $('#lightbox');
  const lbImg = $('#lb-img');
  const lbLegenda = $('#lb-legenda');

  let indiceAtual = 0;
  let botaoOrigem = null;

  CONFIG.fotos.forEach((foto, i) => {
    const botao = document.createElement('button');

    botao.type = 'button';
    botao.className = 'foto';
    botao.dataset.arquivo = foto.src;
    botao.setAttribute('aria-label', 'Ampliar foto: ' + foto.legenda);

    const img = document.createElement('img');

    img.src = foto.src;
    img.alt = foto.legenda;
    img.loading = 'lazy';

    botao.appendChild(img);

    botao.addEventListener('click', () => {
      abrirLightbox(i, botao);
    });

    grade.appendChild(botao);
    vigiarImagem(img);
  });

  function mostrarFoto(i) {
    const total = CONFIG.fotos.length;

    indiceAtual = (i + total) % total;

    const foto = CONFIG.fotos[indiceAtual];

    lbImg.style.display = '';
    lbImg.src = foto.src;
    lbImg.alt = foto.legenda;

    lbLegenda.textContent = foto.legenda;
  }

  lbImg.addEventListener('error', () => {
    lbImg.style.display = 'none';
    lbLegenda.textContent =
      'Imagem não encontrada: ' + CONFIG.fotos[indiceAtual].src;
  });

  function abrirLightbox(i, origem) {
    botaoOrigem = origem;
    mostrarFoto(i);

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';

    $('#lb-fechar').focus();
  }

  function fecharLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';

    if (botaoOrigem) {
      botaoOrigem.focus();
    }
  }

  $('#lb-fechar').addEventListener('click', fecharLightbox);

  $('#lb-anterior').addEventListener('click', () => {
    mostrarFoto(indiceAtual - 1);
  });

  $('#lb-proxima').addEventListener('click', () => {
    mostrarFoto(indiceAtual + 1);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      fecharLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!lightbox.hidden) {
        fecharLightbox();
      } else {
        fecharMenu();
      }
    }

    if (!lightbox.hidden) {
      if (e.key === 'ArrowLeft') mostrarFoto(indiceAtual - 1);
      if (e.key === 'ArrowRight') mostrarFoto(indiceAtual + 1);
    }
  });

  /* ---------- Contador ---------- */

  const campos = [
    'anos', 'meses', 'dias', 'horas', 'minutos', 'segundos'
  ];

  const singular = {
    anos: 'ano',
    meses: 'mês',
    dias: 'dia',
    horas: 'hora',
    minutos: 'minuto',
    segundos: 'segundo'
  };

  const plural = {
    anos: 'anos',
    meses: 'meses',
    dias: 'dias',
    horas: 'horas',
    minutos: 'minutos',
    segundos: 'segundos'
  };

  const dataTexto = CONFIG.inicio.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const horaTexto = CONFIG.inicio.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  $('#data-inicio-texto').textContent =
    'Desde ' + dataTexto + ', às ' + horaTexto + '.';

  function atualizarContador() {
    const t = calcularTempo(CONFIG.inicio, new Date());

    campos.forEach((c) => {
      const valor = t[c];

      const mostrar =
        (c === 'anos' || c === 'meses' || c === 'dias')
          ? String(valor)
          : String(valor).padStart(2, '0');

      $('#c-' + c).textContent = mostrar;
      $('#r-' + c).textContent =
        valor === 1 ? singular[c] : plural[c];
    });
  }

  atualizarContador();
  setInterval(atualizarContador, 1000);

  /* ---------- Início ---------- */

  mostrarPagina(paginaDoHash());
}

if (typeof document !== 'undefined') {
  iniciarSite();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calcularTempo };
}