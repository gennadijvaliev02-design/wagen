/**
 * WagenHof - Premium Auto Repair Landing Page Scripts
 * Interactive Quiz, Case Tabs, Modals, Leaflet Dark Map & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initQuizCalculator();
  initCaseTabs();
  initModals();
  initLeafletMap();
  initSmoothScroll();
});

/* ----------------------------------------------------
   1. STICKY HEADER & NAV SCROLL
---------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.matchMedia('(min-width: 768px)').matches && window.scrollY > 40) {
      header.classList.add('py-2.5', 'shadow-2xl');
      header.classList.remove('py-3.5');
    } else {
      header.classList.add('py-3.5');
      header.classList.remove('py-2.5', 'shadow-2xl');
    }
  });
}

/* ----------------------------------------------------
   2. MOBILE NAVIGATION DRAWER
---------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('opacity-0');
    setTimeout(() => {
      backdrop.classList.add('hidden');
      document.body.style.overflow = '';
    }, 300);
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ----------------------------------------------------
   3. INTERACTIVE QUIZ & COST/TIME ESTIMATOR
---------------------------------------------------- */
const carModels = {
  porsche: [
    { id: '911', name: 'Porsche 911 (992 / 991 / 997)' },
    { id: 'cayenne', name: 'Porsche Cayenne (E3 / 958)' },
    { id: 'macan', name: 'Porsche Macan (GTS / Turbo / Base)' },
    { id: 'panamera', name: 'Porsche Panamera (971 / 970)' },
    { id: 'taycan', name: 'Porsche Taycan (Cross / Sport Turismo)' },
    { id: '718', name: 'Porsche 718 Boxster / Cayman (GT4 / GTS)' }
  ],
  mercedes: [
    { id: 'amg-gt', name: 'Mercedes-AMG GT / GT Black Series' },
    { id: 'g-class', name: 'Mercedes-Benz G-Class (G63 AMG / G500)' },
    { id: 's-class', name: 'Mercedes-Benz S-Class (W223 / W222 / Maybach)' },
    { id: 'e-class', name: 'Mercedes-Benz E-Class (E63s / W213)' },
    { id: 'gle-gls', name: 'Mercedes-Benz GLE / GLS (63 AMG)' },
    { id: 'c-class', name: 'Mercedes-Benz C-Class (C63 / W205 / W206)' }
  ],
  lamborghini: [
    { id: 'huracan', name: 'Lamborghini Huracan (Evo / STO / Tecnica)' },
    { id: 'urus', name: 'Lamborghini Urus / Performante' },
    { id: 'aventador', name: 'Lamborghini Aventador (SVJ / S)' }
  ],
  other: [
    { id: 'supercar', name: 'Ferrari / McLaren / Aston Martin' },
    { id: 'audi-rs', name: 'Audi RS / BMW M-Performance' },
    { id: 'other-car', name: 'Другой премиальный автомобиль' }
  ]
};

const serviceData = {
  maintenance: { title: 'Регулярное ТО по регламенту', time: 'от 2.5 часов', badge: 'Дилерский регламент' },
  diagnostics: { title: 'Компьютерная диагностика PIWIS 3 / Star', time: '1 — 1.5 часа', badge: '100% точность' },
  turbos: { title: 'Ремонт и замена турбокомпрессоров', time: 'от 2 часов', badge: 'Оригинал в наличии' },
  suspension: { title: 'Ремонт подвески и тормозной системы', time: 'от 2 до 5 часов', badge: 'Калибровка углов' },
  cooling: { title: 'Система охлаждения и климат (печка)', time: 'от 3 часов', badge: 'Промывка без снятия торпедо' },
  squeaks: { title: 'Локализация и устранение «сверчков»', time: '1 рабочий день', badge: 'Премиум вибродемпферы' },
  difficult: { title: 'Исправление ошибок других СТО / Суперкары', time: 'Индивидуально', badge: 'Ювелирная слесарка' }
};

function initQuizCalculator() {
  const brandButtons = document.querySelectorAll('.quiz-brand-btn');
  const modelSelect = document.getElementById('quiz-model-select');
  const serviceOptions = document.querySelectorAll('.quiz-service-card');
  const conciergeCheckbox = document.getElementById('quiz-concierge-toggle');
  const phoneInput = document.getElementById('quiz-phone-input');
  
  const resBrand = document.getElementById('res-car');
  const resService = document.getElementById('res-service');
  const resTime = document.getElementById('res-time');
  const resConcierge = document.getElementById('res-concierge');
  
  const submitTelegramBtn = document.getElementById('quiz-submit-tg');
  const submitWhatsappBtn = document.getElementById('quiz-submit-wa');
  const submitDirectBtn = document.getElementById('quiz-submit-direct');

  if (!modelSelect) return;

  let state = {
    brand: 'porsche',
    brandName: 'Porsche',
    model: 'Porsche 911 (992 / 991 / 997)',
    service: 'maintenance',
    serviceTitle: 'Регулярное ТО по регламенту',
    time: 'от 2.5 часов',
    concierge: false
  };

  function updateModels(brandKey) {
    modelSelect.innerHTML = '';
    const models = carModels[brandKey] || carModels.porsche;
    models.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.name;
      opt.textContent = m.name;
      modelSelect.appendChild(opt);
    });
    state.model = models[0].name;
    updateSummary();
  }

  function updateSummary() {
    if (resBrand) resBrand.textContent = `${state.brandName} — ${state.model}`;
    if (resService) resService.textContent = state.serviceTitle;
    if (resTime) resTime.textContent = state.time;
    if (resConcierge) {
      resConcierge.textContent = state.concierge 
        ? '✓ Включена («Доставка в сервис и обратно»)' 
        : 'Самостоятельный визит на Марксистскую, 34с7';
      resConcierge.className = state.concierge 
        ? 'text-emerald-400 font-semibold' 
        : 'text-gray-400';
    }
  }

  brandButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      brandButtons.forEach(b => {
        b.classList.remove('border-blue-500', 'bg-blue-900/30', 'text-white');
        b.classList.add('border-white/10', 'text-gray-400');
      });
      btn.classList.add('border-blue-500', 'bg-blue-900/30', 'text-white');
      btn.classList.remove('border-white/10', 'text-gray-400');

      state.brand = btn.dataset.brand;
      state.brandName = btn.dataset.brandName || btn.textContent.trim();
      updateModels(state.brand);
    });
  });

  modelSelect.addEventListener('change', (e) => {
    state.model = e.target.value;
    updateSummary();
  });

  serviceOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      serviceOptions.forEach(o => {
        o.classList.remove('border-blue-500', 'bg-blue-900/20');
        o.classList.add('border-white/10');
      });
      opt.classList.add('border-blue-500', 'bg-blue-900/20');
      opt.classList.remove('border-white/10');

      const key = opt.dataset.service;
      const sData = serviceData[key] || serviceData.maintenance;
      state.service = key;
      state.serviceTitle = sData.title;
      state.time = sData.time;
      updateSummary();
    });
  });

  if (conciergeCheckbox) {
    conciergeCheckbox.addEventListener('change', (e) => {
      state.concierge = e.target.checked;
      updateSummary();
    });
  }

  function generateMessageText() {
    const phone = phoneInput ? phoneInput.value.trim() : '';
    let msg = `Здравствуйте, WagenHof! Хочу записаться на обслуживание:\n`;
    msg += `🚗 Автомобиль: ${state.brandName} (${state.model})\n`;
    msg += `🔧 Вид работ: ${state.serviceTitle}\n`;
    msg += `⏱ Ожидаемое время: ${state.time}\n`;
    msg += `🏎️ Консьерж-доставка: ${state.concierge ? 'Да, забрать и вернуть авто' : 'Приеду сам'}\n`;
    if (phone) msg += `📞 Контакт: ${phone}\n`;
    msg += `Подскажите свободные даты и точную смету!`;
    return encodeURIComponent(msg);
  }

  if (submitTelegramBtn) {
    submitTelegramBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = generateMessageText();
      window.open(`https://t.me/+79107068262?text=${text}`, '_blank');
      showToast('Переходим в Telegram шеф-мастера...');
    });
  }

  if (submitWhatsappBtn) {
    submitWhatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = generateMessageText();
      window.open(`https://wa.me/79164269546?text=${text}`, '_blank');
      showToast('Переходим в WhatsApp WagenHof...');
    });
  }

  if (submitDirectBtn) {
    submitDirectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = phoneInput ? phoneInput.value.trim() : '';
      if (!phone) {
        showToast('Пожалуйста, укажите телефон или @username для связи', 'error');
        if (phoneInput) phoneInput.focus();
        return;
      }
      showToast('Заявка принята! Мастер-приемщик свяжется с вами в течение 5 минут.');
      if (phoneInput) phoneInput.value = '';
    });
  }

  // Initial populate
  updateModels('porsche');
}

/* ----------------------------------------------------
   4. INTERACTIVE CASE STUDIES TABS
---------------------------------------------------- */
function initCaseTabs() {
  const tabs = document.querySelectorAll('.case-tab-btn');
  const panels = document.querySelectorAll('.case-tab-panel');

  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.target;

      tabs.forEach(t => {
        t.classList.remove('bg-blue-600', 'text-white', 'border-blue-500', 'shadow-lg');
        t.classList.add('bg-[#141822]', 'text-gray-400', 'border-white/10');
      });

      tab.classList.add('bg-blue-600', 'text-white', 'border-blue-500', 'shadow-lg');
      tab.classList.remove('bg-[#141822]', 'text-gray-400', 'border-white/10');

      panels.forEach(p => {
        if (p.id === targetId) {
          p.classList.remove('hidden');
          p.classList.add('animate-fade-in');
        } else {
          p.classList.add('hidden');
          p.classList.remove('animate-fade-in');
        }
      });
    });
  });
}

/* ----------------------------------------------------
   5. BOOKING & CONCIERGE MODALS
---------------------------------------------------- */
function initModals() {
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const modal = document.getElementById('booking-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalForm = document.getElementById('modal-booking-form');

  if (!modal) return;

  function openModal(serviceTitle = '') {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (serviceTitle) {
      const noteInput = document.getElementById('modal-service-note');
      if (noteInput) noteInput.value = serviceTitle;
    }
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.dataset.serviceName || '';
      openModal(service);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-name')?.value || '';
      const phone = document.getElementById('modal-phone')?.value || '';
      const car = document.getElementById('modal-car')?.value || '';

      if (!phone) {
        showToast('Пожалуйста, укажите ваш контактный номер', 'error');
        return;
      }

      closeModal();
      showToast(`Спасибо, ${name || 'заявка принята'}! Мастер WagenHof уже получил ваш запрос.`);
      modalForm.reset();
    });
  }
}

/* ----------------------------------------------------
   6. LEAFLET DARK MAP INITIALIZATION
---------------------------------------------------- */
function initLeafletMap() {
  const mapContainer = document.getElementById('workshop-map');
  if (!mapContainer || typeof L === 'undefined') return;

  // Exact coordinates for Moscow, Marksistskaya street, 34 bld 7
  const coords = [55.7335, 37.6675];

  const map = L.map('workshop-map', {
    center: coords,
    zoom: 15,
    scrollWheelZoom: false,
    zoomControl: true
  });

  // Keep Leaflet attribution with a Russian tricolor instead of its default flag.
  map.attributionControl.setPrefix(
    '<a href="https://leafletjs.com" title="A JavaScript library for interactive maps">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" role="img" aria-label="Россия" style="display:inline-block;vertical-align:middle">' +
    '<path fill="#fff" d="M0 0h12v8H0z"/>' +
    '<path fill="#0039a6" d="M0 2.6667h12v5.3333H0z"/>' +
    '<path fill="#d52b1e" d="M0 5.3333h12V8H0z"/></svg> Leaflet</a>'
  );

  // Dark Matter tiles by CartoDB
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Custom Glowing Marker Icon
  const customIcon = L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div class="custom-map-pin">
        <svg class="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -26]
  });

  const marker = L.marker(coords, { icon: customIcon }).addTo(map);

  const popupContent = `
    <div class="p-2 text-left">
      <div class="flex items-center gap-2 mb-1">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <h4 class="font-heading text-sm font-bold tracking-wide text-white">WAGENHOF</h4>
      </div>
      <p class="text-xs text-gray-300 font-medium mb-1">Марксистская ул., 34с7, Москва</p>
      <p class="text-[11px] text-gray-400 mb-2">м. Таганская / Марксистская (7 мин)</p>
      <div class="flex items-center gap-2 pt-1 border-t border-white/10">
        <a href="https://yandex.ru/maps/?rtext=~55.7335,37.6675" target="_blank" class="text-[11px] text-sky-400 hover:underline font-semibold flex items-center gap-1">
          Яндекс Навигатор &rarr;
        </a>
      </div>
    </div>
  `;

  marker.bindPopup(popupContent).openPopup();
}

/* ----------------------------------------------------
   7. SMOOTH SCROLL FOR ALL ANCHOR LINKS
---------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const header = document.getElementById('main-header');
        const headerHeight = header && getComputedStyle(header).position === 'sticky' ? header.offsetHeight : 0;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ----------------------------------------------------
   8. TOAST NOTIFICATION UTILITY
---------------------------------------------------- */
function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bgColor = type === 'error' ? 'bg-rose-950/90 border-rose-500/50 text-rose-200' : 'bg-slate-900/90 border-blue-500/50 text-white';
  const icon = type === 'error' ? '⚠️' : '✅';

  toast.className = `pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform translate-y-5 opacity-0 ${bgColor}`;
  toast.innerHTML = `
    <span class="text-base">${icon}</span>
    <span class="text-sm font-medium">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('translate-y-5', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
