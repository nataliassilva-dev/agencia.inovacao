/* -----------------------------------------------
   DADOS DOS PROJETOS
   Array com todos os ativos. Cada item tem:
   tipo, status, título, descrição, ref, imagem.
   Filtros e paginação operam sobre este array.
----------------------------------------------- */
const PROJECTS = [
  {
    tipo:'patente', status:'green', statusLabel:'Disponível para Licenciamento',
    titulo:'Sistema de Purificação de Águas Residuais por Microalgas',
    desc:'Processo biotecnológico inovador que utiliza linhagens específicas de microalgas para...',
    ref:'BR 10 2023 0145-2',
    img:'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=70'
  },
  {
    tipo:'software', status:'blue', statusLabel:'Em Homologação',
    titulo:'EduData Analytics: IA para Gestão de Permanência Escolar',
    desc:'Algoritmo de machine learning preditivo para identificação precoce de risco de evasão no...',
    ref:'SW 2024 0089-1',
    img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=70'
  },
  {
    tipo:'desenho', status:'green', statusLabel:'Disponível para Licenciamento',
    titulo:'Módulo Compacto para Sensores de Precisão em Drones',
    desc:'Design ergonômico e aerodinâmico para encapsulamento de sensores multiespectrais...',
    ref:'DI 30 2023 0012-0',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70'
  },
  {
    tipo:'patente', status:'green', statusLabel:'Disponível para Licenciamento',
    titulo:'Geometria Avançada para Painéis Térmicos Solares',
    desc:'Nova geometria para painéis térmicos solares que aumenta a captação energética em até 35%...',
    ref:'BR 10 2023 0556-4',
    img:'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=70'
  },
  {
    tipo:'software', status:'yellow', statusLabel:'Em Desenvolvimento',
    titulo:'SurgSim AR: Simulador Cirúrgico com Realidade Aumentada',
    desc:'Software de simulação que utiliza óculos AR para treinamento tátil de residentes médicos e...',
    ref:'SW 2023 0122-8',
    img:'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=70'
  },
  {
    tipo:'patente', status:'green', statusLabel:'Disponível para Licenciamento',
    titulo:'Extrato Vegetal Antioxidante de Flora do Cerrado Baiano',
    desc:'Composto natural com propriedades antioxidantes superiores e...',
    ref:'BR 10 2024 0092-9',
    img:'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=70'
  },
];
 
const ITEMS_PER_PAGE = 6;
let currentFilter = 'todos';
let currentPage   = 1;
let filteredData  = [...PROJECTS];
 
/* -----------------------------------------------
   renderProjects()
   Filtra os dados pelo tipo selecionado,
   fatia pelo número de página atual e
   insere os cards no DOM.
----------------------------------------------- */
function renderProjects() {
  filteredData = currentFilter === 'todos'
    ? [...PROJECTS]
    : PROJECTS.filter(p => p.tipo === currentFilter);
 
  const total = filteredData.length;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const slice = filteredData.slice(start, start + ITEMS_PER_PAGE);
 
  /* Atualiza o texto "Exibindo X de Y" */
  document.getElementById('pageInfo').textContent =
    `Exibindo ${Math.min(ITEMS_PER_PAGE, total)} de ${total} ativos`;
 
  /* Renderiza os cards */
  document.getElementById('projectsGrid').innerHTML = slice.map(p => `
    <div class="project-card">
      <img class="project-card-img" src="${p.img}" alt="${p.titulo}" loading="lazy">
      <div class="project-card-body">
        <div class="project-card-meta">
          <span class="type-badge">${p.tipo.toUpperCase()}</span>
          <span class="status-dot status-dot--${p.status}"></span>
          <span class="status-text status-text--${p.status}">${p.statusLabel}</span>
        </div>
        <div class="project-card-title">${p.titulo}</div>
        <div class="project-card-desc">${p.desc}</div>
        <div class="project-card-footer">
          <span class="project-ref">Ref: ${p.ref}</span>
          <a href="#" class="link-details">
            Detalhes
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </div>
  `).join('');
 
  renderPagination(total);
}
 
/* -----------------------------------------------
   renderPagination(total)
   Gera os botões de paginação dinamicamente.
   Mostra: ← | 1 | 2 | 3 | … | →
----------------------------------------------- */
function renderPagination(total) {
  const pages = Math.ceil(total / ITEMS_PER_PAGE);
  const el    = document.getElementById('pagination');
  if (pages <= 1) { el.innerHTML = ''; return; }
 
  let html = `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>←</button>`;
 
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - currentPage) <= 1) {
      html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 2) {
      html += `<button class="page-btn" disabled>…</button>`;
    }
  }
 
  html += `<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===pages?'disabled':''}>→</button>`;
  el.innerHTML = html;
}
 
/* Vai para a página N */
function goPage(n) {
  const pages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  if (n < 1 || n > pages) return;
  currentPage = n;
  renderProjects();
  document.querySelector('.projects-header').scrollIntoView({ behavior:'smooth' });
}
 
/* -----------------------------------------------
   Filtros — chips de categoria
   Ao clicar em um chip, atualiza a classe
   .active e re-renderiza os projetos.
----------------------------------------------- */
document.getElementById('filterChips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  currentFilter = chip.dataset.filter;
  currentPage   = 1;
  renderProjects();
});
 
/* -----------------------------------------------
   Busca em tempo real
   Filtra os projetos pelo texto digitado
   comparando título e descrição.
----------------------------------------------- */
document.getElementById('searchInput').addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  if (query.length === 0) {
    filteredData = currentFilter === 'todos' ? [...PROJECTS] : PROJECTS.filter(p => p.tipo === currentFilter);
  } else {
    filteredData = PROJECTS.filter(p =>
      p.titulo.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query)
    );
  }
  currentPage = 1;
  const total = filteredData.length;
  document.getElementById('pageInfo').textContent = `Exibindo ${Math.min(ITEMS_PER_PAGE, total)} de ${total} ativos`;
  document.getElementById('projectsGrid').innerHTML = filteredData.slice(0, ITEMS_PER_PAGE).map(p => `
    <div class="project-card">
      <img class="project-card-img" src="${p.img}" alt="${p.titulo}" loading="lazy">
      <div class="project-card-body">
        <div class="project-card-meta">
          <span class="type-badge">${p.tipo.toUpperCase()}</span>
          <span class="status-dot status-dot--${p.status}"></span>
          <span class="status-text status-text--${p.status}">${p.statusLabel}</span>
        </div>
        <div class="project-card-title">${p.titulo}</div>
        <div class="project-card-desc">${p.desc}</div>
        <div class="project-card-footer">
          <span class="project-ref">Ref: ${p.ref}</span>
          <a href="#" class="link-details">Detalhes →</a>
        </div>
      </div>
    </div>
  `).join('');
  renderPagination(total);
});
 
/* -----------------------------------------------
   navigate(event, page)
   Troca entre as páginas Home e Projetos
   sem recarregar o browser (SPA simples).
   - Esconde todas as .page
   - Exibe a .page correta com .page--active
   - Atualiza os links .active da navbar
   - Mostra/esconde a barra de busca
----------------------------------------------- */
function navigate(event, page) {
  if (event) event.preventDefault();
 
  /* Esconde todas as páginas */
  document.querySelectorAll('.page').forEach(p => p.classList.remove('page--active'));
 
  /* Exibe a página alvo */
  document.getElementById('page-' + page).classList.add('page--active');
 
  /* Atualiza links ativos na navbar */
  document.querySelectorAll('.navbar-links a[data-target]').forEach(a => {
    a.classList.toggle('active', a.dataset.target === page);
  });
 
  /* Barra de busca aparece apenas em Projetos */
  document.getElementById('navSearch').classList.toggle('visible', page === 'projetos');
 
  /* Fecha menu mobile se estiver aberto */
  document.getElementById('navLinks').classList.remove('open');
 
  /* Rola para o topo */
  window.scrollTo({ top: 0, behavior: 'smooth' });
 
  /* Inicializa projetos ao entrar na página */
  if (page === 'projetos') renderProjects();
}
 
/* -----------------------------------------------
   toggleMenu()
   Abre/fecha o menu hamburguer no mobile.
----------------------------------------------- */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
 
/* -----------------------------------------------
   Animação de scroll (Intersection Observer)
   Observa elementos com .animate e adiciona
   .visible quando entram no viewport, ativando
   a transição CSS definida anteriormente.
----------------------------------------------- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target); // anima só uma vez
    }
  });
}, { threshold: 0.15 });
 
document.querySelectorAll('.animate').forEach(el => observer.observe(el));