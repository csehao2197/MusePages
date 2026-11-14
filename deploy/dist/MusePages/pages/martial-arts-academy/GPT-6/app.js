'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const programs = {
  bjj: { name: 'Brazilian Jiu-Jitsu', kicker: 'CONTROL. PATIENCE. POSSIBILITY.', title: 'LEVERAGE OVER FORCE.', image: 'pads.jpg', alt: 'Stock detail of a martial arts uniform and red belt', caption: 'THE PRACTICE OF SHOWING UP · STOCK UNIFORM DETAIL',
    description: 'The gentle art of leverage and control. Explore a technical practice, from your first fundamentals class to competition-level training. Patient coaching. Purposeful practice. Room for every starting point.',
    results: 'Fictional team record: 23 IBJJF medals in 2025 · 4 state champions. No affiliation or results verified.',
    classes: [['Fundamentals', 'Mon/Wed/Fri 6 PM', 'Core concepts and guided practice for a strong foundation.', 'White–Blue belt'], ['Advanced', 'Tue/Thu 7 PM', 'Competition-focused practice and strategy.', 'Blue belt+'], ['No-Gi Grappling', 'Sat 10 AM', 'A different format, without the traditional kimono.', 'Adults'], ['Kids BJJ', 'Mon/Wed 4:30 PM', 'A playful introduction to movement, discipline, and teamwork.', 'Ages 5–12']] },
  muay: { name: 'Muay Thai', kicker: 'FOCUS. RHYTHM. RESPECT.', title: 'FIND YOUR RHYTHM.', image: 'training.jpg', alt: 'Stock photograph of boxing gloves resting on a gym mat', caption: 'EQUIPMENT, NOT AN ENDORSEMENT · STOCK PHOTO',
    description: 'The art of eight limbs. A coached striking practice built around technique, focus, and consistency. Start with foundations, explore pad sessions, or enjoy a non-contact cardio class. All experience levels are welcome.',
    results: 'Fictional team record: 8 amateur fighters · 3 regional champions · 28–4 combined record. Illustrative only.',
    classes: [['Foundations', 'Mon/Wed 5 PM', 'An introduction to the sport in a coached setting.', 'Beginners'], ['All Levels', 'Tue/Thu 6 PM', 'Technical practice and guided pad sessions.', 'All experience levels'], ['Fight Team', 'Fri 5:30 PM', 'Coach-led preparation for experienced competitors.', 'By coach assessment'], ['Cardio Kickboxing', 'Sat 9 AM', 'A non-contact, bag-based movement class.', 'All fitness levels']] },
  mma: { name: 'MMA', kicker: 'CONNECT THE DISCIPLINES.', title: 'A MORE COMPLETE PRACTICE.', image: 'hero.jpg', alt: 'Stock photograph of a boxer practicing with a heavy bag', caption: 'ILLUSTRATIVE STRIKING PHOTO · NOT OUR ACADEMY',
    description: 'Bring the disciplines together. Our concept MMA program connects striking, wrestling, and grappling in a structured, coach-led environment. Build familiarity at your own pace, with separate pathways for beginners and experienced athletes.',
    results: 'Fictional roster: 12 active amateur fighters · 2 professional fighters. Not verified athletes or employment.',
    classes: [['MMA Fundamentals', 'Tue/Thu 5 PM', 'An introduction to connecting disciplines.', 'Beginners'], ['Advanced MMA', 'Mon/Wed 7:30 PM', 'Competition strategy and coach-led practice.', 'Experienced athletes'], ['Open Mat', 'Sun 11 AM', 'Independent practice with coach supervision available.', 'All disciplines']] }
};
const coaches = [
  { name: 'Marcus Torres', role: 'Head BJJ Instructor', rank: '3rd-degree Black Belt', bio: 'A patient guide to the details that make a difference.', detail: 'Fictional profile: 15 years teaching; IBJJF World Masters gold medalist; 28 black belts promoted. These credentials and affiliations are invented for this website concept, not verified.', initials: 'MT', color: '#c3c8cc', skin: '#9b6b50', gi: '#f0f0eb' },
  { name: 'Sana Patel', role: 'Head Muay Thai Coach', rank: 'Kru rank', bio: 'Intentional practice, a sharp eye, and a welcoming corner.', detail: 'Fictional profile: former WBC Muay Thai ranked fighter with a 24–3 record; trained in Bangkok. The instructor, rank, record, and affiliation are fictional.', initials: 'SP', color: '#b7c1bc', skin: '#a66f4c', gi: '#293440' },
  { name: 'Jake Brennan', role: 'MMA Coach', rank: 'BJJ Brown Belt', bio: 'Connecting the dots, one thoughtful session at a time.', detail: 'Fictional profile: 8–2 professional MMA record; leads wrestling, strategy, and an amateur team. No professional record or employment is claimed.', initials: 'JB', color: '#b9c2ca', skin: '#d3a68a', gi: '#182331' },
  { name: 'Adrienne Cole', role: 'Kids Program Director', rank: 'BJJ Black Belt', bio: 'Making room for questions, discovery, and a little fun.', detail: 'Fictional profile: former elementary teacher and youth curriculum director. Credentials and employment are fictional. Youth participation requires a parent or guardian; individual outcomes vary.', initials: 'AC', color: '#cbc2b9', skin: '#825b45', gi: '#e9e9e4' }
];
let activeProgram = 'bjj';
let selectedPlan = '';
let offerApplied = false;
const menu = $('#mobile-menu');
const info = $('#info-dialog');
function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function setProgram(key, focus = false) {
  const p = programs[key];
  if (!p) return;
  activeProgram = key;
  $$('[role=tab]').forEach(tab => {
    const active = tab.dataset.program === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  $('#program-panel').setAttribute('aria-labelledby', `tab-${key}`);
  $('#program-select').value = key;
  $('#program-kicker').textContent = p.kicker;
  $('#program-title').textContent = p.title;
  $('#program-description').textContent = p.description;
  $('#competition').textContent = p.results;
  $('#program-image').src = `assets/${p.image}`;
  $('#program-image').alt = p.alt;
  $('#program-caption').textContent = p.caption;
  $('#class-grid').replaceChildren(...p.classes.map(([title, time, description, level]) => {
    const card = el('article', undefined, 'class-card');
    card.append(el('h4', title), el('p', time, 'class-time'), el('p', description), el('small', level));
    return card;
  }));
}
$$('[role=tab]').forEach(tab => {
  tab.addEventListener('click', () => setProgram(tab.dataset.program));
  tab.addEventListener('keydown', event => {
    const keys = Object.keys(programs);
    let index = keys.indexOf(activeProgram);
    if (event.key === 'ArrowRight') index = (index + 1) % keys.length;
    else if (event.key === 'ArrowLeft') index = (index + keys.length - 1) % keys.length;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = keys.length - 1;
    else return;
    event.preventDefault();
    setProgram(keys[index], true);
  });
});
$('#program-select').addEventListener('change', event => setProgram(event.target.value));
function chooseTrial(key) {
  $('#trial-form').elements.program.value = key;
  $('#trial').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
$('#program-trial').addEventListener('click', () => chooseTrial(activeProgram));
function renderSchedule(filter) {
  const rows = Object.entries(programs).filter(([key]) => filter === 'all' || filter === key).flatMap(([key, p]) => p.classes.map(([title, time, , level]) => {
    const row = el('article', undefined, 'schedule-row');
    const text = el('div');
    text.append(el('h4', title), el('p', `${time} · ${level} · ${p.name}`));
    const button = el('button', 'Try class →');
    button.setAttribute('aria-label', `Try ${title}`);
    button.addEventListener('click', () => chooseTrial(key));
    row.append(text, button);
    return row;
  }));
  $('#schedule-list').replaceChildren(...rows);
  $('#schedule-count').textContent = `${rows.length} example class types · Weekly, Eastern Time`;
}
$('#schedule-filter').addEventListener('change', event => renderSchedule(event.target.value));
function openInfo(title, text) {
  $('#info-title').textContent = title;
  $('#info-body').textContent = text;
  info.showModal();
}
const resources = {
  beginner: ['Your first class', 'Arrive a little early, introduce yourself, and let the coach know you are new. Observe, ask questions, and take breaks whenever you need. Classes in this concept are supervised; this page is not a training tutorial.\n\nThis is a fictional academy. The form only creates a local preview.'],
  expect: ['What to expect', 'A welcome, an introduction to the space, and a coach-led session matched to experience. Discuss any participation questions with a qualified professional. No outcome or risk-free participation is promised.'],
  gear: ['Pack light', 'For a first visit, comfortable gym clothes and water are the starting point. Our concept includes loan equipment. A real academy would confirm clothing, hygiene, and equipment requirements before your visit. No equipment is sold here.'],
  faq: ['Good questions', 'New to martial arts? Beginners are welcome in this fictional concept.\n\nCan children attend? Kids BJJ is designed for ages 5–12; a parent or guardian handles inquiries.\n\nIs a class booked here? No. The form is a browser-only preview, with no live availability.\n\nAre memberships real? No. Prices and the discount code are illustrative.'],
  kids: ['Kids program', 'Ages 5–12 · Example classes Monday and Wednesday, 4:30 PM.\nA fictional, coach-led introduction to movement and teamwork. Parent or guardian participation in any real inquiry is required. No anti-bullying or safety outcome is promised.'],
  cardio: ['Cardio kickboxing', 'Example class: Saturday, 9 AM. A non-contact, bag-based movement session. This is a local concept only, with no live enrollment or fitness promises.'],
  private: ['Private lessons', 'A concept for individual coaching, arranged with an instructor. This demo has no lesson inventory, contact service, or purchasing system.'],
  team: ['Competition team', 'An illustrative pathway for experienced athletes following coach assessment. All records, medals, roster sizes, affiliations, and instructor credentials shown on this site are fictional.'],
  contact: ['Contact details are fictional', 'Iron Path Academy is a website concept, not an operating academy at this address. The phone number, email, opening hours, and Charlotte address are demo details. No call or message is placed. Please use fictional information in the local preview.'],
  social: ['Off-platform, not connected', 'This fictional academy has no verified social profiles. This demo does not open a social network, send information, or claim an affiliation.']
};
$$('[data-info]').forEach(button => button.addEventListener('click', () => openInfo(...resources[button.dataset.info])));
$('#close-info').addEventListener('click', () => info.close());
$('#info-done').addEventListener('click', () => info.close());
$('.menu-button').addEventListener('click', () => { menu.showModal(); $('.menu-button').setAttribute('aria-expanded', 'true'); });
function closeMenu() {
  $('.menu-button').setAttribute('aria-expanded', 'false');
  menu.close();
}
$('.close-menu').addEventListener('click', closeMenu);
menu.addEventListener('close', () => $('.menu-button').setAttribute('aria-expanded', 'false'));
$$('nav a', menu).forEach(link => link.addEventListener('click', closeMenu));
$$('[data-footer-program]').forEach(button => button.addEventListener('click', () => { setProgram(button.dataset.footerProgram); $('#programs').scrollIntoView(); }));
coaches.forEach((coach, index) => {
  const card = el('article', undefined, 'coach-card');
  const portrait = el('div', undefined, 'coach-portrait');
  const image = el('img');
  image.src = `assets/coach-${index + 1}.svg`;
  image.alt = `Original illustrated portrait representing fictional coach ${coach.name}`;
  image.loading = 'lazy';
  portrait.append(image, el('span', 'ILLUSTRATED PROFILE'));
  const content = el('div', undefined, 'coach-content');
  const bio = el('button', `View bio: ${coach.name} ↗`, 'text-link');
  bio.addEventListener('click', () => openInfo(coach.name, `${coach.role} · ${coach.rank}\n\n${coach.detail}`));
  content.append(el('h3', coach.name.toUpperCase()), el('p', coach.role, 'coach-role'), el('p', coach.rank, 'coach-rank'), el('p', coach.bio), bio);
  card.append(portrait, content);
  $('#coach-grid').append(card);
});
$$('[data-plan]').forEach(button => button.addEventListener('click', () => {
  selectedPlan = button.dataset.plan;
  $('#plan-status').textContent = `${selectedPlan} selected · ${offerApplied ? 'Demo code IRONPATH50 applied.' : 'Preview a free class first.'} No enrollment occurs.`;
  $('#trial').scrollIntoView();
}));
$('#offer-button').addEventListener('click', () => {
  offerApplied = true;
  $('#offer-status').textContent = 'Demo code IRONPATH50 applied to your local preview: 50% off an illustrative first month. No payment or purchase.';
  $('#plan-status').textContent = `${selectedPlan || 'No plan chosen'} · Demo code IRONPATH50 applied. No purchase occurs.`;
  $('#offer-button').setAttribute('aria-pressed', 'true');
});
const spaces = [
  ['The Mat Room', '3,000 sq ft concept · mats, mirrors, flag display'],
  ['The Training Cage', 'Concept octagon · padded fence'],
  ['Heavy Bag Area', '12-bag concept · speed & double-end bags'],
  ['Strength Corner', 'Rack, kettlebells, ropes & boxes'],
  ['Recovery Lounge', 'Stretch space, water station & cubbies'],
  ['The Pro Shop', 'Concept gis, gloves, wraps & academy gear']
];
spaces.forEach(([title, caption], index) => {
  const figure = el('figure');
  const image = el('img');
  image.src = `assets/space-${index + 1}.svg`;
  image.alt = `Original architectural concept illustration: ${title}`;
  image.loading = 'lazy';
  const figcaption = el('figcaption');
  figcaption.append(el('h3', title.toUpperCase()), el('p', caption));
  figure.append(image, figcaption);
  $('#tour').append(figure);
});
let tourIndex = 0;
let tourTimer;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
function moveTour(direction) {
  tourIndex = (tourIndex + direction + spaces.length) % spaces.length;
  const tour = $('#tour');
  tour.scrollTo({ left: tour.children[tourIndex].offsetLeft - tour.children[0].offsetLeft, behavior: reduced.matches ? 'instant' : 'smooth' });
  $('#tour-status').textContent = `View ${tourIndex + 1} of 6 · ${spaces[tourIndex][0]} · Concept illustration`;
}
function stopTour() { clearInterval(tourTimer); tourTimer = undefined; $('#tour-pause').textContent = 'Play tour'; }
$('#tour-prev').addEventListener('click', () => { stopTour(); moveTour(-1); });
$('#tour-next').addEventListener('click', () => { stopTour(); moveTour(1); });
$('#tour-pause').addEventListener('click', () => {
  if (tourTimer) stopTour();
  else { $('#tour-pause').textContent = 'Pause tour'; tourTimer = setInterval(() => moveTour(1), 4500); }
});
$('#tour').addEventListener('pointerdown', stopTour);
$('#tour').addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); stopTour(); moveTour(event.key === 'ArrowRight' ? 1 : -1); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) stopTour(); });
reduced.addEventListener('change', () => { if (reduced.matches) stopTour(); });
const trialForm = $('#trial-form');
function localToday() { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
trialForm.elements.date.min = localToday();
['name', 'email', 'phone', 'date'].forEach(name => trialForm.elements[name].addEventListener('input', () => { trialForm.elements[name].setCustomValidity(''); $('#form-error').textContent = ''; $('#booking-result').hidden = true; }));
trialForm.addEventListener('submit', event => {
  event.preventDefault();
  $('#booking-result').hidden = true;
  $('#form-error').textContent = '';
  const name = trialForm.elements.name.value.trim();
  const email = trialForm.elements.email.value.trim();
  const phone = trialForm.elements.phone.value.trim();
  const digits = phone.replace(/\D/g, '');
  const date = trialForm.elements.date.value;
  let invalid;
  let message;
  if (!name) { invalid = trialForm.elements.name; message = 'Please enter a name, not just spaces.'; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { invalid = trialForm.elements.email; message = 'Enter a complete example email address.'; }
  else if (!/^[+\d\s().-]+$/.test(phone) || digits.length < 10 || digits.length > 15) { invalid = trialForm.elements.phone; message = 'Enter an example phone number with 10–15 digits.'; }
  else if (!date || date < localToday()) { invalid = trialForm.elements.date; message = 'Choose today or a future date for the demo.'; }
  if (invalid) {
    invalid.setCustomValidity(message);
    $('#form-error').textContent = message;
    invalid.reportValidity();
    return;
  }
  const p = trialForm.elements.program.value;
  const label = programs[p]?.name || 'Program to be decided';
  const readableDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(`${date}T12:00:00`));
  $('#booking-text').textContent = `${name} — ${label} on ${readableDate}. ${selectedPlan ? `Interested in ${selectedPlan}. ` : ''}${offerApplied ? 'Demo offer IRONPATH50 selected. ' : ''}Preferred date only; no class availability checked. Email and phone are not sent or retained.`;
  $('#booking-result').hidden = false;
  trialForm.elements.email.value = '';
  trialForm.elements.phone.value = '';
});
$('#clear-preview').addEventListener('click', () => {
  trialForm.reset();
  $('#booking-text').textContent = '';
  $('#booking-result').hidden = true;
  $('#form-error').textContent = '';
  ['name', 'email', 'phone', 'date'].forEach(name => trialForm.elements[name].setCustomValidity(''));
  selectedPlan = '';
  $('#plan-status').textContent = "Let's find a class that fits.";
});
setProgram('bjj');
renderSchedule('all');
$('#trial-form button[type=submit]').disabled = false;
// The static Lucide sprite keeps every icon local without a runtime library.
$$('[data-icon]').forEach(placeholder => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `assets/lucide.svg#${placeholder.dataset.icon}`);
  svg.append(use);
  placeholder.replaceWith(svg);
});
