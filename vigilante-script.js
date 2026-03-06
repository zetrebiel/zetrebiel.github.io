/* ═══════════════════════════════════════════════════
   VIGILANTE DIREITOS — script.js
   Dr. Gabriel | Direito do Trabalho
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════
     NAVBAR — scroll + mobile
  ══════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Fechar menu ao clicar em link
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ══════════════════════════
     SCROLL REVEAL
  ══════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  let revealDelay = 0;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Stagger siblings dentro do mesmo pai
        const siblings = Array.from(el.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
        const idx = siblings.indexOf(el);
        setTimeout(() => {
          el.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ══════════════════════════
     FAQ ACCORDION
  ══════════════════════════ */
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body      = btn.nextElementSibling;
      const isOpen    = body.classList.contains('open');
      const parentFaq = btn.closest('.faq-grid');

      // Fechar todos
      parentFaq.querySelectorAll('.faq-body.open').forEach(b => b.classList.remove('open'));
      parentFaq.querySelectorAll('.faq-btn.open').forEach(b => b.classList.remove('open'));

      // Abrir clicado (se estava fechado)
      if (!isOpen) {
        body.classList.add('open');
        btn.classList.add('open');
      }
    });
  });


  /* ══════════════════════════
     SIMULADOR / QUIZ
  ══════════════════════════ */
  const quiz = {
    step: 0,
    respostas: {},

    perguntas: [
      {
        id: 'arma',
        texto: 'Você trabalha ou trabalhava com arma de fogo?',
        opcoes: ['Sim', 'Não', 'Às vezes']
      },
      {
        id: 'escala',
        texto: 'Qual é a sua escala de trabalho?',
        opcoes: ['12x36', '8h/dia', 'Outro', 'Irregular']
      },
      {
        id: 'tempo',
        texto: 'Há quanto tempo está ou esteve nessa empresa?',
        opcoes: ['Menos de 1 ano', '1 a 3 anos', 'Mais de 3 anos', 'Fui demitido']
      },
      {
        id: 'situacao',
        texto: 'Qual é sua situação atual?',
        opcoes: ['Ainda empregado', 'Demitido recentemente', 'Pedi demissão', 'Contrato encerrado']
      }
    ],

    init() {
      this.renderPasso();
      this.renderProgress();
    },

    renderProgress() {
      const dots = document.querySelectorAll('.quiz-progress-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('done', i < this.step);
      });
    },

    renderPasso() {
      const container = document.getElementById('quiz-steps');
      if (!container) return;

      if (this.step >= this.perguntas.length) {
        this.mostrarResultado();
        return;
      }

      const q = this.perguntas[this.step];
      container.innerHTML = `
        <div class="quiz-step active">
          <p class="quiz-question">${q.texto}</p>
          <div class="quiz-options">
            ${q.opcoes.map(op => `
              <button class="quiz-opt" data-valor="${op}">${op}</button>
            `).join('')}
          </div>
        </div>
      `;

      container.querySelectorAll('.quiz-opt').forEach(btn => {
        btn.addEventListener('click', () => {
          this.respostas[q.id] = btn.dataset.valor;
          this.step++;
          this.renderProgress();
          this.renderPasso();
        });
      });
    },

    mostrarResultado() {
      const container = document.getElementById('quiz-steps');
      const { arma, escala, situacao } = this.respostas;

      let nivel = 'medio';
      let direitos = [];

      if (arma === 'Sim') {
        direitos.push('Adicional de Periculosidade');
        nivel = 'alto';
      }
      if (escala === '12x36' || escala === 'Irregular') {
        direitos.push('Verificação de Horas Extras');
        nivel = 'alto';
      }
      if (situacao === 'Demitido recentemente' || situacao === 'Contrato encerrado') {
        direitos.push('Verbas Rescisórias');
        nivel = 'alto';
      }
      if (direitos.length === 0) {
        direitos = ['Horas Extras', 'Adicional Noturno', 'FGTS'];
      }

      const msgs = {
        alto: {
          icon: '⚖️',
          titulo: 'Há indicativos importantes no seu caso.',
          texto: 'Com base nas suas respostas, identificamos questões que merecem uma análise detalhada por um advogado especialista em Direito do Trabalho. O próximo passo é uma conversa gratuita e sigilosa para entender sua situação com mais profundidade.'
        },
        medio: {
          icon: '🔍',
          titulo: 'Seu caso merece uma análise cuidadosa.',
          texto: 'Todo trabalhador tem direitos que muitas vezes não são completamente respeitados. Uma conversa gratuita com nosso advogado pode identificar situações que você nem sabia que tinha direito de questionar.'
        }
      };

      const msg = msgs[nivel];

      container.innerHTML = `
        <div class="quiz-resultado">
          <span class="resultado-icon">${msg.icon}</span>
          <h3 class="resultado-titulo">${msg.titulo}</h3>
          <p class="resultado-texto">${msg.texto}</p>
          <div class="resultado-tags">
            ${direitos.map(d => `<span class="resultado-tag">🔎 ${d}</span>`).join('')}
          </div>
          <a href="https://wa.me/5500000000000?text=Oi%2C+fiz+o+simulador+e+quero+analisar+meu+caso+gratuitamente" class="btn btn-gold btn-gold-lg" target="_blank">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Falar com Advogado Agora
          </a>
          <br>
          <button onclick="quiz.reiniciar()" style="background:none;border:none;color:var(--texto);font-size:13px;cursor:pointer;margin-top:12px;text-decoration:underline;">
            Refazer o simulador
          </button>
        </div>
      `;
    },

    reiniciar() {
      this.step = 0;
      this.respostas = {};
      this.renderProgress();
      this.renderPasso();
    }
  };

  window.quiz = quiz;
  quiz.init();


  /* ══════════════════════════
     FORMULÁRIO DE LEAD
  ══════════════════════════ */
  const form = document.getElementById('form-lead');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome     = form.querySelector('#nome').value.trim();
    const telefone = form.querySelector('#telefone').value.trim();
    const situacao = form.querySelector('#situacao-form').value;
    const msg      = form.querySelector('#mensagem').value.trim();

    if (!nome || !telefone) {
      showToast('Por favor, preencha nome e telefone.', 'erro');
      return;
    }

    // Montar mensagem WhatsApp
    const texto = encodeURIComponent(
      `Olá, me chamo *${nome}*.\n` +
      `📱 Telefone: ${telefone}\n` +
      `⚖️ Situação: ${situacao || 'Não informada'}\n` +
      (msg ? `📝 Mensagem: ${msg}\n` : '') +
      `\nVi o site e quero analisar meu caso gratuitamente.`
    );

    showToast('Redirecionando para o WhatsApp...', 'sucesso');

    setTimeout(() => {
      window.open(`https://wa.me/5500000000000?text=${texto}`, '_blank');
    }, 800);
  });

  // Máscara de telefone
  const telInput = document.getElementById('telefone');
  telInput?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 11);
    if (v.length >= 7) {
      v = v.length === 11
        ? v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        : v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (v.length >= 3) {
      v = v.replace(/(\d{2})(\d+)/, '($1) $2');
    }
    e.target.value = v;
  });


  /* ══════════════════════════
     TOAST NOTIFICATIONS
  ══════════════════════════ */
  function showToast(msg, tipo = 'sucesso') {
    const existing = document.querySelector('.toast-notif');
    existing?.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notif';
    toast.style.cssText = `
      position: fixed; bottom: 110px; right: 30px;
      background: ${tipo === 'sucesso' ? 'var(--cinza-card)' : '#3a1515'};
      border: 1px solid ${tipo === 'sucesso' ? 'var(--dourado-borda)' : 'rgba(184,50,39,0.4)'};
      color: var(--branco); font-family: var(--fonte-body);
      font-size: 14px; font-weight: 500;
      padding: 14px 20px; border-radius: var(--radius);
      box-shadow: var(--sombra-escura);
      z-index: 9999; max-width: 300px;
      animation: fadeUp 0.3s ease;
    `;
    toast.textContent = (tipo === 'sucesso' ? '✅ ' : '⚠️ ') + msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }


  /* ══════════════════════════
     SMOOTH SCROLL p/ âncoras
  ══════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 10 : 70;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });


  /* ══════════════════════════
     CONTADOR animado (stats)
  ══════════════════════════ */
  function animateCounter(el, end, duration = 1500) {
    const start = 0;
    const startTime = performance.now();
    const isPlus = el.dataset.suffix === '+';

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * ease);
      el.textContent = current + (isPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const end = parseInt(el.dataset.count);
        if (!isNaN(end)) animateCounter(el, end);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));


  /* ══════════════════════════
     EXIT INTENT popup
  ══════════════════════════ */
  let exitShown = false;

  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !exitShown) {
      exitShown = true;
      showExitPopup();
    }
  });

  function showExitPopup() {
    const overlay = document.createElement('div');
    overlay.id = 'exit-overlay';
    overlay.style.cssText = `
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.75);
      z-index: 10000; display: flex;
      align-items: center; justify-content: center;
      padding: 20px; backdrop-filter: blur(4px);
      animation: fadeIn 0.3s ease;
    `;

    overlay.innerHTML = `
      <div style="
        background: var(--cinza-card);
        border: 1px solid var(--dourado-borda);
        border-radius: 14px; padding: 52px 48px;
        max-width: 520px; width: 100%; text-align: center;
        position: relative; animation: fadeUp 0.4s ease;
        font-family: var(--fonte-body);
      ">
        <button id="exit-close" style="
          position: absolute; top: 16px; right: 20px;
          background: none; border: none; color: var(--texto);
          font-size: 22px; cursor: pointer; line-height: 1;
        ">✕</button>
        <p style="font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--dourado); margin-bottom: 16px;">⏳ Antes de sair</p>
        <h3 style="font-family: var(--fonte-serif); font-size: 28px; color: var(--branco); margin-bottom: 14px; line-height: 1.2; font-weight: 700;">
          Você pode estar deixando dinheiro na mesa.
        </h3>
        <p style="color: var(--texto); font-size: 15px; line-height: 1.7; margin-bottom: 28px;">
          Muitos vigilantes só descobrem que tinham direitos quando já é tarde demais. A análise é gratuita e leva menos de 10 minutos.
        </p>
        <a href="https://wa.me/5500000000000?text=Oi%2C+quero+analisar+meu+caso+gratuitamente" target="_blank" style="
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--dourado); color: var(--preto);
          padding: 15px 32px; border-radius: 4px;
          font-weight: 700; font-size: 15px; text-decoration: none;
          transition: all 0.2s;
        ">
          📱 Análise Gratuita pelo WhatsApp
        </a>
        <p style="font-size: 12px; color: var(--texto-2); margin-top: 14px;">Sem compromisso. Sem custo. 100% sigiloso.</p>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('exit-close')?.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  }


  /* ══════════════════════════
     HORÁRIO DE ATENDIMENTO
  ══════════════════════════ */
  const statusEl = document.getElementById('atendimento-status');
  if (statusEl) {
    const now    = new Date();
    const hora   = now.getHours();
    const dia    = now.getDay(); // 0 = domingo, 6 = sábado
    const aberto = dia >= 1 && dia <= 5 && hora >= 8 && hora < 18;

    statusEl.innerHTML = aberto
      ? `<span style="color: var(--verde);">● Estamos atendendo agora</span>`
      : `<span style="color: var(--texto);">● Respondemos em até 2h úteis</span>`;
  }

}); // end DOMContentLoaded
