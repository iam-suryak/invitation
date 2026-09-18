import { weddingConfig } from './config.js';

// Application State
const state = {
  currentStage: 0, // 0: Envelope Closed, 1: Envelope Unsealed, 2: Box Out, 3: Fully Unfolded Cards
  isPlayingMusic: false,
  guestName: 'Honored Guest',
  currentTab: 'wedding',
  wishes: JSON.parse(localStorage.getItem('wedding_wishes') || '[]'),
  rsvps: JSON.parse(localStorage.getItem('wedding_rsvps') || '[]')
};

// Audio Element
let bgAudio = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  parseGuestName();
  renderConfigData();
  setupAudio();
  initCountdown();
  setupEventListeners();
  renderWishes();
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
  createFallingPetals();
});

// 1. Parse guest name from URL ?guest=... or ?to=...
function parseGuestName() {
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('guest') || urlParams.get('to') || urlParams.get('name');
  if (guestParam) {
    state.guestName = decodeURIComponent(guestParam);
  }
}

// 2. Populate text content from config
function renderConfigData() {
  // Guest greetings
  const guestBadge = document.getElementById('guest-badge-name');
  const innerGuestGreeting = document.getElementById('inner-guest-greeting');
  if (guestBadge) guestBadge.textContent = state.guestName;
  if (innerGuestGreeting) innerGuestGreeting.textContent = state.guestName;

  // Couple Names & Parents
  document.querySelectorAll('.groom-name').forEach(el => el.textContent = weddingConfig.groomName);
  document.querySelectorAll('.bride-name').forEach(el => el.textContent = weddingConfig.brideName);
  document.querySelectorAll('.groom-full-name').forEach(el => el.textContent = weddingConfig.groomFullName);
  document.querySelectorAll('.bride-full-name').forEach(el => el.textContent = weddingConfig.brideFullName);
  document.querySelectorAll('.groom-parents').forEach(el => el.textContent = weddingConfig.groomParents);
  document.querySelectorAll('.bride-parents').forEach(el => el.textContent = weddingConfig.brideParents);
  document.querySelectorAll('.wedding-display-date').forEach(el => el.textContent = weddingConfig.displayDate);
  document.querySelectorAll('.wedding-display-time').forEach(el => el.textContent = weddingConfig.displayTime);
  document.querySelectorAll('.wedding-venue-name').forEach(el => el.textContent = weddingConfig.venueName);
  document.querySelectorAll('.wedding-venue-address').forEach(el => el.textContent = weddingConfig.venueAddress);

  const mapsBtn = document.getElementById('maps-link-btn');
  if (mapsBtn) mapsBtn.href = weddingConfig.googleMapsUrl;

  // Render Event Tabs
  renderEvents();
  // Render Couple Story Timeline
  renderStory();
}

// 3. Audio Setup
function setupAudio() {
  const initialUrl = weddingConfig.musicUrl || './assets/music/wedding.mp3';
  bgAudio = new Audio(initialUrl);
  bgAudio.loop = true;
  bgAudio.volume = 0.5;

  // Fallback to secondary track if local file is missing
  bgAudio.onerror = () => {
    if (weddingConfig.musicTracks && weddingConfig.musicTracks[1]) {
      const fallbackUrl = weddingConfig.musicTracks[1].url;
      if (bgAudio.src !== fallbackUrl) {
        bgAudio.src = fallbackUrl;
        if (state.isPlayingMusic) {
          bgAudio.play().catch(e => console.log('Audio play error:', e));
        }
      }
    }
  };

  const musicBtn = document.getElementById('music-toggle-btn');
  if (musicBtn) {
    musicBtn.addEventListener('click', toggleAudio);
  }
}

function toggleAudio() {
  const musicBtn = document.getElementById('music-toggle-btn');
  const iconOn = musicBtn.querySelector('.icon-volume-on');
  const iconOff = musicBtn.querySelector('.icon-volume-off');

  if (state.isPlayingMusic) {
    bgAudio.pause();
    state.isPlayingMusic = false;
    musicBtn.classList.remove('animate-pulse');
    if (iconOn && iconOff) {
      iconOn.classList.add('hidden');
      iconOff.classList.remove('hidden');
    }
  } else {
    bgAudio.play().then(() => {
      state.isPlayingMusic = true;
      musicBtn.classList.add('animate-pulse');
      if (iconOn && iconOff) {
        iconOn.classList.remove('hidden');
        iconOff.classList.add('hidden');
      }
    }).catch(err => {
      console.log('Autoplay prevented by browser:', err);
    });
  }
}

// 4. Live Countdown Timer
function initCountdown() {
  const targetDate = new Date(weddingConfig.weddingDate).getTime();

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('countdown-timer').innerHTML = `<div class="text-2xl gold-text font-serif">Today is the auspicious day! 🎉</div>`;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-mins');
    const secsEl = document.getElementById('count-secs');

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// 5. "One Inside One" Multi-Step Unfolding Animations
function setupEventListeners() {
  // Wax seal click
  const waxSeal = document.getElementById('wax-seal-btn');
  if (waxSeal) {
    waxSeal.addEventListener('click', openEnvelopeStage);
  }

  // Next/Unfold button on Box
  const openBoxBtn = document.getElementById('open-box-btn');
  if (openBoxBtn) {
    openBoxBtn.addEventListener('click', unfoldCardStage);
  }

  // RSVP Form Submit
  // const rsvpForm = document.getElementById('rsvp-form');
  // if (rsvpForm) {
  //   rsvpForm.addEventListener('submit', handleRSVPSubmit);
  // }

  // Wish Form Submit
  // const wishForm = document.getElementById('wish-form');
  // if (wishForm) {
  //   wishForm.addEventListener('submit', handleWishSubmit);
  // }

  // Page Navigation Listeners
  document.querySelectorAll('.page-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pageNum = e.currentTarget.getAttribute('data-page');
      switchPage(pageNum);
    });
  });

  document.querySelectorAll('.next-page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const nextPage = e.currentTarget.getAttribute('data-next');
      switchPage(nextPage);
    });
  });

  document.querySelectorAll('.prev-page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prevPage = e.currentTarget.getAttribute('data-prev');
      switchPage(prevPage);
    });
  });

  // Host Link Generator Modal
  const openLinkModal = document.getElementById('open-link-modal-btn');
  const closeLinkModal = document.getElementById('close-link-modal-btn');
  const generateBtn = document.getElementById('generate-guest-link-btn');

  if (openLinkModal) {
    openLinkModal.addEventListener('click', () => {
      document.getElementById('link-modal').classList.remove('hidden');
    });
  }

  if (closeLinkModal) {
    closeLinkModal.addEventListener('click', () => {
      document.getElementById('link-modal').classList.add('hidden');
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', generateCustomGuestLink);
  }

  // Add to Calendar Button
  const calBtn = document.getElementById('add-calendar-btn');
  if (calBtn) {
    calBtn.addEventListener('click', downloadICalendar);
  }
}

// STAGE 1: Break Wax Seal & Open Envelope Flap
function openEnvelopeStage() {
  const envelopeContainer = document.getElementById('envelope-container');
  const waxSeal = document.getElementById('wax-seal-btn');
  const sealInstruction = document.getElementById('seal-instruction');

  // Play audio on initial touch
  if (!state.isPlayingMusic) {
    toggleAudio();
  }

  // Trigger burst of gold confetti at seal position
  triggerConfettiAt(window.innerWidth / 2, window.innerHeight / 2);

  waxSeal.classList.add('scale-150', 'opacity-0');
  if (sealInstruction) sealInstruction.classList.add('opacity-0');

  setTimeout(() => {
    envelopeContainer.classList.add('envelope-open');
    envelopeContainer.style.transition = 'all 0.5s ease';
    envelopeContainer.style.opacity = '0';
    envelopeContainer.style.transform = 'scale(0.85)';
    
    // STAGE 2: Reveal the inner Velvet Card Box cleanly without any overlay
    setTimeout(() => {
      envelopeContainer.classList.add('hidden');
      slideBoxOutStage();
    }, 500);
  }, 300);
}

// STAGE 2: Reveal Velvet Card Box cleanly
function slideBoxOutStage() {
  const innerCardBox = document.getElementById('inner-card-box');
  if (!innerCardBox) return;

  innerCardBox.classList.remove('hidden');
  innerCardBox.style.opacity = '0';
  innerCardBox.style.transform = 'scale(0.85)';

  setTimeout(() => {
    innerCardBox.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    innerCardBox.style.opacity = '1';
    innerCardBox.style.transform = 'scale(1)';
  }, 50);
}

// STAGE 3: Unfold the 3D Accordion Cards Page by Page
function unfoldCardStage() {
  const envelopeContainer = document.getElementById('envelope-container');
  const innerCardBox = document.getElementById('inner-card-box');
  const nestedCardsView = document.getElementById('nested-cards-view');

  // Play grand celebration confetti shower
  triggerGrandConfetti();

  if (envelopeContainer) {
    envelopeContainer.style.opacity = '0';
    envelopeContainer.style.transform = 'scale(0.8)';
  }
  if (innerCardBox) {
    innerCardBox.classList.add('opacity-0', 'pointer-events-none', 'scale-110');
  }
  
  setTimeout(() => {
    if (envelopeContainer) envelopeContainer.classList.add('hidden');
    if (innerCardBox) innerCardBox.classList.add('hidden');
    
    if (nestedCardsView) {
      nestedCardsView.classList.remove('hidden');
      switchPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 500);
}

// Switch Page by Page Neatly
function switchPage(pageNum) {
  document.querySelectorAll('.card-page-content').forEach(el => el.classList.add('hidden'));
  const targetPage = document.getElementById(`card-page-${pageNum}`);
  if (targetPage) {
    targetPage.classList.remove('hidden');
  }

  // Update Page Tab Button Styles
  document.querySelectorAll('.page-tab-btn').forEach(btn => {
    if (btn.getAttribute('data-page') === String(pageNum)) {
      btn.className = 'page-tab-btn px-4 py-2 rounded-xl text-xs font-serif text-royal-lightgold bg-royal-maroon border border-royal-gold/50 shadow-md font-semibold whitespace-nowrap transition-all';
    } else {
      btn.className = 'page-tab-btn px-4 py-2 rounded-xl text-xs font-serif text-gray-300 hover:text-royal-lightgold hover:bg-royal-maroon/50 whitespace-nowrap transition-all';
    }
  });

  const nestedView = document.getElementById('nested-cards-view');
  if (nestedView) {
    nestedView.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// 6. Render Events Schedule
function renderEvents() {
  const container = document.getElementById('events-container');
  if (!container) return;

  container.innerHTML = weddingConfig.events.map((evt, idx) => `
    <div class="glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-[1.02] border border-royal-gold/30">
      <div class="absolute -right-4 -bottom-4 opacity-10 text-royal-gold">
        <i data-lucide="${evt.icon}" class="w-32 h-32"></i>
      </div>
      <div class="flex items-center gap-3 mb-2">
        <span class="px-3 py-1 bg-royal-gold/20 text-royal-lightgold text-xs font-semibold rounded-full border border-royal-gold/40">
          Event ${idx + 1}
        </span>
        <h4 class="text-xl font-serif text-royal-lightgold">${evt.title}</h4>
      </div>
      <p class="text-xs text-royal-rose font-cursive text-lg mb-4">${evt.subTitle}</p>
      
      <div class="space-y-2 text-sm text-gray-200 mb-4">
        <div class="flex items-center gap-2">
          <i data-lucide="calendar" class="w-4 h-4 text-royal-gold"></i>
          <span>${evt.date}</span>
        </div>
        <div class="flex items-center gap-2">
          <i data-lucide="clock" class="w-4 h-4 text-royal-gold"></i>
          <span>${evt.time}</span>
        </div>
        <div class="flex items-center gap-2">
          <i data-lucide="map-pin" class="w-4 h-4 text-royal-gold"></i>
          <span>${evt.venue}</span>
        </div>
        <div class="flex items-center gap-2 text-royal-lightgold font-medium">
          <i data-lucide="sparkles" class="w-4 h-4 text-royal-gold"></i>
          <span>Dress Code: ${evt.dressCode}</span>
        </div>
      </div>
      <p class="text-xs text-gray-300 leading-relaxed italic bg-royal-deepmaroon/50 p-3 rounded-lg border border-royal-gold/10">
        "${evt.description}"
      </p>
    </div>
  `).join('');
}

// 7. Render Story Timeline
function renderStory() {
  const container = document.getElementById('story-container');
  if (!container) return;

  container.innerHTML = weddingConfig.story.map(item => `
    <div class="relative pl-6 border-l-2 border-royal-gold/40 space-y-1">
      <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-royal-gold border-2 border-royal-maroon"></div>
      <span class="text-xs font-bold text-royal-gold tracking-widest">${item.year}</span>
      <h5 class="text-base font-serif text-white">${item.title}</h5>
      <p class="text-xs text-gray-300">${item.desc}</p>
    </div>
  `).join('');
}

// 8. RSVP Submission Handler
// function handleRSVPSubmit(e) {
//   e.preventDefault();
//   const name = document.getElementById('rsvp-name').value;
//   const count = document.getElementById('rsvp-guests').value;
//   const status = document.getElementById('rsvp-status').value;
//   const dietary = document.getElementById('rsvp-dietary').value;

//   const newRSVP = { name, count, status, dietary, time: new Date().toLocaleDateString() };
//   state.rsvps.push(newRSVP);
//   localStorage.setItem('wedding_rsvps', JSON.stringify(state.rsvps));

//   triggerGrandConfetti();

//   const successMsg = document.getElementById('rsvp-success-msg');
//   if (successMsg) {
//     successMsg.classList.remove('hidden');
//     document.getElementById('rsvp-form').reset();
//   }
// }

// 9. Wishes Wall Submission Handler
// function handleWishSubmit(e) {
//   e.preventDefault();
//   const author = document.getElementById('wish-author').value;
//   const message = document.getElementById('wish-message').value;

//   if (!author || !message) return;

//   const newWish = { author, message, time: 'Just now' };
//   state.wishes.unshift(newWish);
//   localStorage.setItem('wedding_wishes', JSON.stringify(state.wishes));

//   renderWishes();
//   triggerConfettiAt(window.innerWidth / 2, window.innerHeight * 0.8);
//   document.getElementById('wish-form').reset();
// }

// function renderWishes() {
//   const wall = document.getElementById('wishes-wall');
//   if (!wall) return;

//   if (state.wishes.length === 0) {
//     wall.innerHTML = `<p class="text-xs text-gray-400 italic text-center py-4">Be the first to leave your warm blessings for the couple! ✨</p>`;
//     return;
//   }

//   wall.innerHTML = state.wishes.slice(0, 6).map(w => `
//     <div class="bg-royal-deepmaroon/80 border border-royal-gold/20 p-4 rounded-xl text-left shadow-md">
//       <div class="flex items-center justify-between mb-2">
//         <span class="text-sm font-serif text-royal-lightgold font-semibold">${w.author}</span>
//         <span class="text-[10px] text-gray-400">${w.time}</span>
//       </div>
//       <p class="text-xs text-gray-200 leading-relaxed">"${w.message}"</p>
//     </div>
//   `).join('');
// }

// 10. Generate Custom Guest Link
function generateCustomGuestLink() {
  const nameInput = document.getElementById('custom-guest-name-input').value;
  if (!nameInput) return;

  const encodedName = encodeURIComponent(nameInput.trim());
  const baseUrl = window.location.origin + window.location.pathname;
  const generatedUrl = `${baseUrl}?guest=${encodedName}`;

  const resultContainer = document.getElementById('generated-link-container');
  const inputEl = document.getElementById('generated-url-input');

  inputEl.value = generatedUrl;
  resultContainer.classList.remove('hidden');

  navigator.clipboard.writeText(generatedUrl);
  alert(`Invitation link created & copied to clipboard!\n\nLink: ${generatedUrl}`);
}

// 11. Add to Calendar (.ics download)
function downloadICalendar() {
  const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Marriage Invitation//NONSGML v1.0//EN
BEGIN:VEVENT
SUMMARY:${weddingConfig.groomName} & ${weddingConfig.brideName}'s Wedding Ceremony
DESCRIPTION:${weddingConfig.tagline}. Venue: ${weddingConfig.venueName}
LOCATION:${weddingConfig.venueAddress}
DTSTART:20261128T130000Z
DTEND:20261128T180000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${weddingConfig.groomName}_${weddingConfig.brideName}_Wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Celebration FX
function triggerConfettiAt(x, y) {
  if (typeof window.confetti === 'function') {
    window.confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: ['#D4AF37', '#F3E5AB', '#AA7C11', '#E8A598']
    });
  }
}

function triggerGrandConfetti() {
  if (typeof window.confetti !== 'function') return;
  const end = Date.now() + 2 * 1000;
  const colors = ['#D4AF37', '#F3E5AB', '#AA7C11', '#FFFDD0', '#E8A598'];

  (function frame() {
    window.confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    window.confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// 12. Floating Petals Animation Effect
function createFallingPetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  const numPetals = 15;
  for (let i = 0; i < numPetals; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${6 + Math.random() * 6}s`;
    petal.style.animationDelay = `${Math.random() * 5}s`;
    petal.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="#D4AF37" opacity="0.4"><path d="M12 2C12 2 4 8 4 14C4 18.4 7.6 22 12 22C16.4 22 20 18.4 20 14C20 8 12 2 12 2Z"/></svg>`;
    container.appendChild(petal);
  }
}
