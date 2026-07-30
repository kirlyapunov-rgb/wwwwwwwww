const screenEnterHandlers = {};
let cardBound = false;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.devnav-btn').forEach(b => {
    b.classList.toggle('current', b.dataset.goto === id);
  });
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.nav === id);
  });
  if (screenEnterHandlers[id]) screenEnterHandlers[id]();
}

document.querySelectorAll('.devnav-btn').forEach(btn => {
  btn.addEventListener('click', () => showScreen(btn.dataset.goto));
});
showScreen('screen-phone');

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

document.addEventListener('click', (e) => {
  const navTarget = e.target.closest('[data-nav]');
  if (navTarget) {
    showScreen(navTarget.dataset.nav);
    return;
  }
  const toastTarget = e.target.closest('[data-toast]');
  if (toastTarget) {
    showToast(toastTarget.dataset.toast);
  }
});

// --- Next prayer widget ---
const prayerTimes = [
  { name: 'Фаджр', time: '04:47' },
  { name: 'Зухр', time: '12:31' },
  { name: 'Аср', time: '16:47' },
  { name: 'Магриб', time: '19:38' },
  { name: 'Иша', time: '21:02' },
];

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function getNextPrayer() {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const next = prayerTimes.find(p => toMinutes(p.time) > nowMinutes);
  return next || prayerTimes[0];
}

function renderPrayerWidget() {
  const next = getNextPrayer();
  document.querySelectorAll('.prayer-label').forEach(el => {
    el.textContent = `${next.name} • ${next.time}`;
  });

  const list = document.getElementById('prayer-list');
  list.innerHTML = '';
  prayerTimes.forEach(p => {
    const li = document.createElement('li');
    const nameSpan = document.createElement('span');
    nameSpan.textContent = p.name;
    const timeSpan = document.createElement('span');
    timeSpan.textContent = p.time;
    li.appendChild(nameSpan);
    li.appendChild(timeSpan);
    if (p.name === next.name) li.classList.add('next');
    list.appendChild(li);
  });
}

renderPrayerWidget();

const prayerOverlay = document.getElementById('prayer-overlay');
const prayerCloseBtn = document.getElementById('prayer-close-btn');

document.querySelectorAll('.prayer-open-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    renderPrayerWidget();
    prayerOverlay.classList.add('show');
  });
});
prayerCloseBtn.addEventListener('click', () => prayerOverlay.classList.remove('show'));
prayerOverlay.addEventListener('click', (e) => {
  if (e.target === prayerOverlay) prayerOverlay.classList.remove('show');
});

// --- Home: stories row ---
const storiesData = {
  news: { badge: 'Новости', title: 'Приложение обновилось', text: 'Оформить рассрочку стало ещё быстрее — добавили подпись по СМС-коду и мгновенную привязку карты.' },
  ramadan: { badge: 'Рамадан', title: 'Специально к Рамадану', text: 'Дополнительная скидка 10% на все товары в рассрочку до конца месяца.' },
  cashback: { badge: 'Кэшбэк', title: 'Кэшбэк за платежи', text: 'Оплачивайте рассрочку вовремя и получайте до 2% кэшбэка баллами.' },
  guide: { badge: 'Гид', title: 'Как работает рассрочка', text: 'Никаких процентов — только фиксированная наценка, без скрытых комиссий и рибы.' },
  sale: { badge: 'Акции', title: 'Скидки недели', text: 'Смартфоны, ноутбуки и техника — скидки до 30% только на этой неделе.' },
};

const storyOverlay = document.getElementById('story-overlay');
const storyCloseBtn = document.getElementById('story-close-btn');

document.querySelectorAll('.story-item').forEach(item => {
  item.addEventListener('click', () => {
    const data = storiesData[item.dataset.story];
    document.getElementById('story-badge').textContent = data.badge;
    document.getElementById('story-title').textContent = data.title;
    document.getElementById('story-text').textContent = data.text;
    item.classList.add('viewed');
    storyOverlay.classList.add('show');
  });
});
storyCloseBtn.addEventListener('click', () => storyOverlay.classList.remove('show'));
storyOverlay.addEventListener('click', (e) => {
  if (e.target === storyOverlay) storyOverlay.classList.remove('show');
});

// --- Home: notifications bell ---
const notifOverlay = document.getElementById('notif-overlay');
const notifOpenBtn = document.getElementById('notif-open-btn');
const notifCloseBtn = document.getElementById('notif-close-btn');
const bellDot = document.getElementById('bell-dot');

notifOpenBtn.addEventListener('click', () => {
  notifOverlay.classList.add('show');
  bellDot.classList.add('hidden');
});
notifCloseBtn.addEventListener('click', () => notifOverlay.classList.remove('show'));
notifOverlay.addEventListener('click', (e) => {
  if (e.target === notifOverlay) notifOverlay.classList.remove('show');
});

// --- Home: product carousel -> "bind a card first" modal ---
const cardRequiredOverlay = document.getElementById('card-required-overlay');
const cardRequiredCloseBtn = document.getElementById('card-required-close-btn');
const cardRequiredCta = document.getElementById('card-required-cta');

document.querySelectorAll('[data-card-required]').forEach(card => {
  card.addEventListener('click', () => cardRequiredOverlay.classList.add('show'));
});
cardRequiredCloseBtn.addEventListener('click', () => cardRequiredOverlay.classList.remove('show'));
cardRequiredOverlay.addEventListener('click', (e) => {
  if (e.target === cardRequiredOverlay) cardRequiredOverlay.classList.remove('show');
});
cardRequiredCta.addEventListener('click', () => cardRequiredOverlay.classList.remove('show'));

// --- Home screen: toggle widgets by state ---
screenEnterHandlers['screen-home'] = () => {
  const emptyWidget = document.getElementById('empty-card-widget');
  const limitWidget = document.getElementById('limit-widget');
  const pendingWidget = document.getElementById('pending-widget');

  emptyWidget.style.display = 'none';
  limitWidget.classList.remove('show');
  pendingWidget.classList.remove('show');

  const clientReq = getClientRequest();
  if (clientReq && clientReq.status === 'processing') {
    pendingWidget.classList.add('show');
  } else if (cardBound) {
    limitWidget.classList.add('show');
  } else {
    emptyWidget.style.display = '';
  }
};

// --- Screen 2: form validation ---
const passportInput = document.getElementById('passport');
const dobInput = document.getElementById('dob');
const continueBtn1 = document.getElementById('btn-continue-1');

function formatDob(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  let out = digits;
  if (digits.length > 4) out = `${digits.slice(0,2)}.${digits.slice(2,4)}.${digits.slice(4)}`;
  else if (digits.length > 2) out = `${digits.slice(0,2)}.${digits.slice(2)}`;
  return out;
}

dobInput.addEventListener('input', () => {
  dobInput.value = formatDob(dobInput.value);
  validateIdForm();
});

function sanitizePassport(value) {
  const cleaned = value.toUpperCase().replace(/[^A-ZА-Я0-9]/g, '');
  const lettersMatch = cleaned.match(/^[A-ZА-Я]{0,2}/)[0];
  const rest = cleaned.slice(lettersMatch.length).replace(/\D/g, '');
  if (lettersMatch.length > 0) {
    return (lettersMatch + rest).slice(0, 9);
  }
  return rest.slice(0, 14);
}

passportInput.addEventListener('input', () => {
  const cursorAtEnd = passportInput.selectionStart === passportInput.value.length;
  passportInput.value = sanitizePassport(passportInput.value);
  if (cursorAtEnd) passportInput.setSelectionRange(passportInput.value.length, passportInput.value.length);
  validateIdForm();
});

function validateIdForm() {
  const id = passportInput.value.trim();
  const isPinfl = /^\d{14}$/.test(id);
  const isPassport = /^[A-ZА-Я]{2}\d{7}$/.test(id);
  const dobOk = /^\d{2}\.\d{2}\.\d{4}$/.test(dobInput.value.trim());
  continueBtn1.disabled = !((isPinfl || isPassport) && dobOk);
}

// --- Screen 3: biometric scan simulation ---
const scanRing = document.getElementById('scan-ring');
const scanStatus = document.getElementById('scan-status');
const scanBtn = document.getElementById('btn-scan');
const continueBtn2 = document.getElementById('btn-continue-2');

scanBtn.addEventListener('click', () => {
  scanBtn.disabled = true;
  scanRing.classList.add('scanning');
  scanStatus.textContent = 'Сканирование лица…';

  setTimeout(() => {
    scanRing.classList.remove('scanning');
    scanRing.classList.add('done');
    scanStatus.textContent = 'Личность подтверждена';
    scanStatus.classList.add('success');
    scanBtn.classList.add('btn-hidden');
    continueBtn2.classList.remove('btn-hidden');
  }, 2000);
});

screenEnterHandlers['screen-myid'] = () => {
  scanRing.classList.remove('scanning', 'done');
  scanStatus.textContent = 'Расположите лицо в кадре';
  scanStatus.classList.remove('success');
  scanBtn.disabled = false;
  scanBtn.classList.remove('btn-hidden');
  continueBtn2.classList.add('btn-hidden');
};

// --- Screen 4: offer scroll-to-bottom gate ---
const offerBox = document.getElementById('offer-box');
const scrollHint = document.getElementById('scroll-hint');
const offerConfirmBtn = document.getElementById('btn-offer-confirm');

offerBox.addEventListener('scroll', () => {
  const atBottom = offerBox.scrollTop + offerBox.clientHeight >= offerBox.scrollHeight - 8;
  if (atBottom) {
    offerConfirmBtn.disabled = false;
    scrollHint.classList.add('hidden');
  }
});

screenEnterHandlers['screen-offer'] = () => {
  offerBox.scrollTop = 0;
  offerConfirmBtn.disabled = true;
  scrollHint.classList.remove('hidden');
};

// --- Screen 5: phone number ---
const phoneInput = document.getElementById('phone');
const phoneConfirmBtn = document.getElementById('btn-phone-confirm');
const otpPhoneDisplay = document.getElementById('otp-phone-display');

function formatPhone(raw) {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  digits = digits.slice(0, 9);
  let out = '+998';
  if (digits.length > 0) out += ' ' + digits.slice(0, 2);
  if (digits.length > 2) out += ' ' + digits.slice(2, 5);
  if (digits.length > 5) out += ' ' + digits.slice(5, 7);
  if (digits.length > 7) out += ' ' + digits.slice(7, 9);
  return out;
}

phoneInput.addEventListener('input', () => {
  phoneInput.value = formatPhone(phoneInput.value);
  phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
  const digits = phoneInput.value.replace(/\D/g, '');
  phoneConfirmBtn.disabled = digits.length !== 12;
});

screenEnterHandlers['screen-phone'] = () => {
  if (!phoneInput.value) phoneInput.value = '+998';
};

document.getElementById('btn-phone-confirm').addEventListener('click', () => {
  otpPhoneDisplay.textContent = phoneInput.value;
});

// --- Screen 6: OTP input ---
const otpBoxes = Array.from(document.querySelectorAll('#otp-row .otp-box'));
const otpConfirmBtn = document.getElementById('btn-otp-confirm');
const resendBtn = document.getElementById('resend-btn');
let resendTimer = null;

function checkOtpComplete() {
  const filled = otpBoxes.every(b => b.value.trim().length === 1);
  otpConfirmBtn.disabled = !filled;
}

otpBoxes.forEach((box, i) => {
  box.addEventListener('input', () => {
    box.value = box.value.replace(/\D/g, '').slice(0, 1);
    if (box.value && otpBoxes[i + 1]) otpBoxes[i + 1].focus();
    checkOtpComplete();
  });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !box.value && otpBoxes[i - 1]) otpBoxes[i - 1].focus();
  });
});

function startResendTimer() {
  clearInterval(resendTimer);
  let seconds = 59;
  resendBtn.disabled = true;
  resendBtn.textContent = `Отправить повторно (0:${String(seconds).padStart(2, '0')})`;
  resendTimer = setInterval(() => {
    seconds -= 1;
    if (seconds <= 0) {
      clearInterval(resendTimer);
      resendBtn.disabled = false;
      resendBtn.textContent = 'Отправить повторно';
    } else {
      resendBtn.textContent = `Отправить повторно (0:${String(seconds).padStart(2, '0')})`;
    }
  }, 1000);
}

resendBtn.addEventListener('click', () => {
  if (resendBtn.disabled) return;
  showToast('Код отправлен повторно');
  startResendTimer();
});

screenEnterHandlers['screen-otp'] = () => {
  otpBoxes.forEach(b => (b.value = ''));
  otpConfirmBtn.disabled = true;
  otpBoxes[0].focus();
  startResendTimer();
};

// --- Screen 7: create password ---
const passwordInput = document.getElementById('password');
const passwordToggle = document.getElementById('password-toggle');
const passwordRepeatInput = document.getElementById('password-repeat');
const passwordRepeatToggle = document.getElementById('password-repeat-toggle');
const passwordConfirmBtn = document.getElementById('btn-password-confirm');
const reqLength = document.getElementById('req-length');
const reqLetters = document.getElementById('req-letters');
const reqDigits = document.getElementById('req-digits');
const reqUpper = document.getElementById('req-upper');
const reqMatch = document.getElementById('req-match');

passwordToggle.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';
  passwordToggle.classList.toggle('active', isPassword);
});

passwordRepeatToggle.addEventListener('click', () => {
  const isPassword = passwordRepeatInput.type === 'password';
  passwordRepeatInput.type = isPassword ? 'text' : 'password';
  passwordRepeatToggle.classList.toggle('active', isPassword);
});

function validatePassword() {
  const value = passwordInput.value;
  const lengthOk = value.length >= 6;
  const lettersOk = /[a-zA-Zа-яА-Я]/.test(value);
  const digitsOk = /\d/.test(value);
  const upperOk = /[A-ZА-Я]/.test(value);
  const matchOk = value.length > 0 && value === passwordRepeatInput.value;

  reqLength.classList.toggle('met', lengthOk);
  reqLetters.classList.toggle('met', lettersOk);
  reqDigits.classList.toggle('met', digitsOk);
  reqUpper.classList.toggle('met', upperOk);
  reqMatch.classList.toggle('met', matchOk);

  passwordConfirmBtn.disabled = !(lengthOk && lettersOk && digitsOk && upperOk && matchOk);
}

passwordInput.addEventListener('input', validatePassword);
passwordRepeatInput.addEventListener('input', validatePassword);

screenEnterHandlers['screen-password'] = () => {
  passwordInput.value = '';
  passwordRepeatInput.value = '';
  passwordInput.type = 'password';
  passwordRepeatInput.type = 'password';
  passwordToggle.classList.remove('active');
  passwordRepeatToggle.classList.remove('active');
  passwordConfirmBtn.disabled = true;
  [reqLength, reqLetters, reqDigits, reqUpper, reqMatch].forEach(el => el.classList.remove('met'));
};

// --- Screen card binding ---
const cardNumberInput = document.getElementById('card-number');
const cardExpiryInput = document.getElementById('card-expiry');
const cardCvvInput = document.getElementById('card-cvv');
const cardConfirmBtn = document.getElementById('btn-card-confirm');
const cardNumberPreview = document.getElementById('card-number-preview');
const cardExpiryPreview = document.getElementById('card-expiry-preview');

cardNumberInput.addEventListener('input', () => {
  const digits = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
  cardNumberInput.value = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  const groups = digits.padEnd(16, '•').match(/.{1,4}/g);
  cardNumberPreview.textContent = digits.length ? groups.join(' ') : '•••• •••• •••• ••••';
  validateCard();
});

cardExpiryInput.addEventListener('input', () => {
  const digits = cardExpiryInput.value.replace(/\D/g, '').slice(0, 4);
  cardExpiryInput.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  cardExpiryPreview.textContent = cardExpiryInput.value || 'ММ/ГГ';
  validateCard();
});

cardCvvInput.addEventListener('input', () => {
  cardCvvInput.value = cardCvvInput.value.replace(/\D/g, '').slice(0, 3);
  validateCard();
});

function validateCard() {
  const numOk = cardNumberInput.value.replace(/\D/g, '').length === 16;
  const expOk = /^\d{2}\/\d{2}$/.test(cardExpiryInput.value.trim());
  const cvvOk = cardCvvInput.value.trim().length === 3;
  cardConfirmBtn.disabled = !(numOk && expOk && cvvOk);
}

screenEnterHandlers['screen-card'] = () => {
  cardNumberInput.value = '';
  cardExpiryInput.value = '';
  cardCvvInput.value = '';
  cardNumberPreview.textContent = '•••• •••• •••• ••••';
  cardExpiryPreview.textContent = 'ММ/ГГ';
  cardConfirmBtn.disabled = true;
};

// --- Loader simulation ---
const loaderSpinner = document.getElementById('loader-spinner');
const loaderCheck = document.getElementById('loader-check');
const loaderText = document.getElementById('loader-text');
const loaderSub = document.getElementById('loader-sub');
const loaderDoneBtn = document.getElementById('btn-loader-done');

screenEnterHandlers['screen-loader'] = () => {
  loaderSpinner.style.display = 'flex';
  loaderCheck.classList.remove('show');
  loaderText.textContent = 'Оформляем ваш лимит…';
  loaderSub.textContent = 'Это займёт несколько секунд';
  loaderDoneBtn.classList.add('btn-hidden');

  clearTimeout(screenEnterHandlers._loaderTimeout);
  screenEnterHandlers._loaderTimeout = setTimeout(() => {
    loaderSpinner.style.display = 'none';
    loaderCheck.classList.add('show');
    loaderText.textContent = 'Лимит одобрен!';
    loaderSub.textContent = '7 000 000 сум доступно для покупок в рассрочку';
    cardBound = true;
    loaderDoneBtn.classList.remove('btn-hidden');
  }, 2200);
};

// --- Screen PIN: create app PIN code ---
const pinBoxes = Array.from({ length: 4 }, (_, i) => document.getElementById(`pin-${i}`));
const pinConfirmBtn = document.getElementById('btn-pin-confirm');
const pinTitle = document.getElementById('pin-title');
const pinSub = document.getElementById('pin-sub');
const pinError = document.getElementById('pin-error');
let pinStep = 'create';
let pinFirst = '';

function resetPinBoxes() {
  pinBoxes.forEach(b => (b.value = ''));
  pinBoxes[0].focus();
  pinConfirmBtn.disabled = true;
}

pinBoxes.forEach((box, i) => {
  box.addEventListener('input', () => {
    box.value = box.value.replace(/\D/g, '').slice(0, 1);
    if (box.value && pinBoxes[i + 1]) pinBoxes[i + 1].focus();
    const filled = pinBoxes.every(b => b.value.trim().length === 1);
    if (filled && pinStep === 'create') {
      pinFirst = pinBoxes.map(b => b.value).join('');
      pinStep = 'confirm';
      pinTitle.textContent = 'Повторите код-пароль';
      pinSub.textContent = 'Введите код ещё раз для подтверждения';
      pinError.style.visibility = 'hidden';
      resetPinBoxes();
    } else if (filled && pinStep === 'confirm') {
      pinConfirmBtn.disabled = false;
    }
  });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !box.value && pinBoxes[i - 1]) pinBoxes[i - 1].focus();
  });
});

pinConfirmBtn.addEventListener('click', (e) => {
  const entered = pinBoxes.map(b => b.value).join('');
  if (entered !== pinFirst) {
    e.stopImmediatePropagation();
    pinError.style.visibility = 'visible';
    pinStep = 'create';
    pinFirst = '';
    pinTitle.textContent = 'Придумайте код-пароль';
    pinSub.textContent = '4-значный код для быстрого входа в приложение';
    resetPinBoxes();
  }
});

screenEnterHandlers['screen-pin'] = () => {
  pinStep = 'create';
  pinFirst = '';
  pinTitle.textContent = 'Придумайте код-пароль';
  pinSub.textContent = '4-значный код для быстрого входа в приложение';
  pinError.style.visibility = 'hidden';
  resetPinBoxes();
};

// --- Data model: every merchant request, whether the client scanned a QR or the merchant typed it in themselves ---
let currentStore = 'Магазин — Чиланзар';
const REQUEST_TIMEOUT_MS = 15 * 60 * 1000;

let merchRequests = [];
let nextRequestId = 1;
let currentRequestId = null; // which request the open detail screen refers to
let merchHomeFilter = 'all'; // 'all' | 'self' | 'client'

function getCurrentRequest() {
  return merchRequests.find(r => r.id === currentRequestId) || null;
}

// The client app only ever cares about its own (QR-scanned) requests — pick the most recent one.
function getClientRequest() {
  const clientReqs = merchRequests.filter(r => r.origin === 'client');
  return clientReqs[clientReqs.length - 1] || null;
}

function createRequest(origin, phone) {
  const req = {
    id: nextRequestId++,
    origin, // 'client' | 'self'
    phone,
    appNumber: `№АМ-2026-${String(1000 + nextRequestId).slice(-4)}`,
    status: 'processing', // processing -> awaiting_client -> confirmed
    term: 6,
    productName: '',
    price: '',
    productPhoto: '',
    barcodePhoto: '',
    deadline: Date.now() + REQUEST_TIMEOUT_MS,
    shipped: false,
  };
  merchRequests.push(req);
  return req;
}

function removeRequest(id) {
  merchRequests = merchRequests.filter(r => r.id !== id);
}

function setPhotoEl(imgId, fallbackId, src) {
  const img = document.getElementById(imgId);
  if (!img) return;
  if (src) {
    img.src = src;
    img.style.display = 'block';
    if (fallbackId) {
      const fallback = document.getElementById(fallbackId);
      if (fallback) fallback.style.display = 'none';
    }
  } else {
    img.style.display = 'none';
    if (fallbackId) {
      const fallback = document.getElementById(fallbackId);
      if (fallback) fallback.style.display = '';
    }
  }
}

// --- Master tick: every request's countdown + auto-expiry, drives every screen that shows live requests ---
function expireOldRequests() {
  const now = Date.now();
  const before = merchRequests.length;
  merchRequests = merchRequests.filter(r => !(r.status === 'processing' && r.deadline && now >= r.deadline));
  return merchRequests.length !== before;
}

setInterval(() => {
  if (expireOldRequests()) showToast('Заявка отменена — магазин не принял её вовремя');
  renderInstallmentScreen();
  renderMerchHome();
  refreshMerchWaitingBanner();
}, 1000);

screenEnterHandlers['screen-qr'] = () => {
  // beam animation restarts automatically via CSS
};

// --- Product/barcode photo inputs (filled in by the merchant, see screen-merch-fill-info) ---
const productPhotoInput = document.getElementById('product-photo-input');
const barcodePhotoInput = document.getElementById('barcode-photo-input');
const productPhotoPreview = document.getElementById('product-photo-preview');
const barcodePhotoPreview = document.getElementById('barcode-photo-preview');
const productPhotoArea = document.getElementById('product-photo-area');
const barcodePhotoArea = document.getElementById('barcode-photo-area');
const productPhotoContent = document.getElementById('product-photo-content');
const barcodePhotoContent = document.getElementById('barcode-photo-content');

let productPhotoSet = false;
let barcodePhotoSet = false;

function handlePhotoInput(input, preview, content, area, setter) {
  input.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        preview.src = ev.target.result;
        preview.classList.add('show');
        content.style.display = 'none';
        area.classList.add('has-photo');
        setter(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });
}

// --- QR scan: request goes straight to the merchant, no client-side form ---
const btnQrNext = document.getElementById('btn-qr-next');
btnQrNext.addEventListener('click', () => {
  btnQrNext.disabled = true;
  btnQrNext.textContent = 'Отправляется…';
  setTimeout(() => {
    createRequest('client', phoneInput.value || '+998 90 ···· 4412');
    document.getElementById('pending-store-name').textContent = currentStore;
    btnQrNext.disabled = false;
    btnQrNext.textContent = 'Симулировать сканирование';
    showToast('Заявка отправлена в магазин. С вами скоро свяжутся');
    showScreen('screen-home');
  }, 1200);
});

// --- Sadaqa: category filter ---
document.querySelectorAll('.sadaqa-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.sadaqa-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.sadaqa-card').forEach(card => {
      if (cat === 'all' || card.dataset.cat === cat) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// --- Sadaqa: donate buttons ---
document.querySelectorAll('.sadaqa-donate-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    showToast(`Джазакаллаху хайран! Перевод в «${btn.dataset.donate}» отправлен`);
  });
});

// ════════════════════════════════════════
// INSTALLMENT: REQUESTS (pending) + ACTIVE STATE (client side)
// ════════════════════════════════════════
const RU_MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

function renderPaymentSchedule(term, priceDigits) {
  const container = document.getElementById('payment-schedule-rows');
  if (!container) return;
  const monthlyAmount = term > 0 ? Math.round(priceDigits / term) : 0;
  const monthlyLabel = `${formatPrice(String(monthlyAmount))} сум / мес`;
  document.getElementById('payment-schedule-term-label').textContent = monthlyLabel;

  container.innerHTML = '';
  let month = 7; // August (0-based index)
  let year = 2026;
  for (let i = 0; i < term; i++) {
    const row = document.createElement('div');
    row.className = 'payment-row';
    row.innerHTML = `<div><div class="payment-month">${RU_MONTHS[month]} ${year}</div><div class="payment-date">10.${String(month + 1).padStart(2, '0')}.${year}</div></div><div class="payment-amount">${formatPrice(String(monthlyAmount))} сум</div>`;
    container.appendChild(row);
    month++;
    if (month > 11) { month = 0; year++; }
  }
}

function formatCountdown(deadline) {
  const msLeft = Math.max(0, deadline - Date.now());
  const totalSec = Math.ceil(msLeft / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, '0')}`;
}

function renderInstallmentScreen() {
  const req = getClientRequest();
  const requestsSection = document.getElementById('installment-requests-section');
  const activeSection = document.getElementById('installment-active-section');
  const emptyDiv = document.getElementById('installment-empty');
  const merchantPendingRow = document.getElementById('inst-row-merchant-pending');
  const dealRow = document.getElementById('inst-row-deal');
  const dealSlotRequests = document.getElementById('inst-deal-slot-requests');
  const dealSlotActive = document.getElementById('inst-deal-slot-active');

  const waitingOnMerchant = !!req && req.status === 'processing';
  const waitingOnClient = !!req && req.status === 'awaiting_client';
  const isActive = !!req && req.status === 'confirmed';

  setPhotoEl('inst-product-photo', 'inst-product-icon-fallback', req ? req.productPhoto : '');

  merchantPendingRow.style.display = waitingOnMerchant ? '' : 'none';
  dealRow.style.display = (waitingOnClient || isActive) ? '' : 'none';
  if (waitingOnClient) dealSlotRequests.appendChild(dealRow);
  if (isActive) dealSlotActive.appendChild(dealRow);

  requestsSection.style.display = (waitingOnMerchant || waitingOnClient) ? '' : 'none';
  activeSection.style.display = isActive ? '' : 'none';
  emptyDiv.style.display = (!waitingOnMerchant && !waitingOnClient && !isActive) ? '' : 'none';

  if (waitingOnMerchant) {
    document.getElementById('inst-request-store').textContent = currentStore;
    document.getElementById('inst-list-request-store').textContent = currentStore;
    const text = formatCountdown(req.deadline);
    document.getElementById('inst-request-timer').textContent = text;
    document.getElementById('inst-list-timer').textContent = text;
  }

  if (waitingOnClient || isActive) {
    const badge = document.getElementById('installment-status-badge');
    const listBadge = document.getElementById('inst-list-badge');
    const confirmBtn = document.getElementById('btn-confirm-installment');
    const priceDigits = parseInt((req.price || '').replace(/\D/g, ''), 10) || 0;

    if (req.productName) {
      document.getElementById('inst-product-name').textContent = req.productName;
      document.getElementById('inst-list-name').textContent = req.productName;
    }
    document.getElementById('inst-price').textContent = req.price || '0';
    document.getElementById('inst-term-label').textContent = `сум · ${req.term} мес`;
    document.getElementById('inst-list-price').textContent = `${req.price || '0'} сум · ${req.term} мес`;
    renderPaymentSchedule(req.term, priceDigits);

    if (isActive) {
      badge.className = 'inst-status-badge active';
      badge.innerHTML = '<span class="inst-badge-dot"></span>Подтверждено вами';
      listBadge.className = 'inst-status-badge active';
      listBadge.innerHTML = '<span class="inst-badge-dot"></span>Подтверждено вами';
      confirmBtn.textContent = 'Принято ✓';
      confirmBtn.disabled = true;
      confirmBtn.style.background = 'linear-gradient(135deg, #14c99a, #0fa882)';
      confirmBtn.style.color = '#fff';
    } else {
      badge.className = 'inst-status-badge pending';
      badge.innerHTML = '<span class="inst-badge-dot"></span>Ответ получен';
      listBadge.className = 'inst-status-badge pending';
      listBadge.innerHTML = '<span class="inst-badge-dot"></span>Ответ получен';
      confirmBtn.textContent = 'Подтвердить условия рассрочки';
      confirmBtn.disabled = false;
      confirmBtn.style.background = '';
      confirmBtn.style.color = '';
    }
  }
}

screenEnterHandlers['screen-installment'] = renderInstallmentScreen;
screenEnterHandlers['screen-installment-request'] = renderInstallmentScreen;
screenEnterHandlers['screen-installment-active'] = renderInstallmentScreen;

document.getElementById('btn-confirm-installment').addEventListener('click', () => {
  const req = getClientRequest();
  if (!req) return;
  req.status = 'confirmed';
  showToast('Рассрочка подтверждена! Можете забрать товар в магазине');
  document.getElementById('merch-ship-push-banner').classList.add('show');
  showScreen('screen-installment');
});

// ════════════════════════════════════════
// MERCHANT APP
// ════════════════════════════════════════

// --- Merch history: only real deals shipped through this session, no placeholders ---
let merchHistory = [];

function renderMerchHistory() {
  const list = document.getElementById('merch-history-list');
  const empty = document.getElementById('merch-history-empty');
  list.innerHTML = '';
  empty.style.display = merchHistory.length ? 'none' : '';

  let totalRevenue = 0;
  merchHistory.forEach(deal => {
    totalRevenue += deal.amountDigits;
    const item = document.createElement('div');
    item.className = 'merch-app-item';
    item.innerHTML = `<div class="merch-app-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#0fa882" stroke-width="1.4"/><path d="M5.5 9.2L7.8 11.5L12.5 6.5" stroke="#0fa882" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="merch-app-info"><div class="merch-app-name">${deal.name}</div><div class="merch-app-meta">${deal.phone} · ${deal.date}</div></div><div class="merch-app-amount">${deal.amount}</div>`;
    list.appendChild(item);
  });

  document.getElementById('merch-history-count').textContent = merchHistory.length;
  document.getElementById('merch-history-revenue').textContent = formatPrice(String(totalRevenue));
}

screenEnterHandlers['screen-merch-history'] = renderMerchHistory;

// --- Merch home: one filterable vertical list of every request, self-initiated or client-initiated ---
const STATUS_LABEL = {
  processing: 'Оформление',
  awaiting_client: 'Ответ получен',
};

function openRequest(id) {
  currentRequestId = id;
  const req = merchRequests.find(r => r.id === id);
  if (!req) return;
  if (req.status === 'processing') showScreen('screen-merch-incoming');
  else if (req.status === 'awaiting_client') showScreen('screen-merch-waiting');
  else if (req.status === 'confirmed') showScreen('screen-merch-ready');
}

function renderMerchHome() {
  const list = document.getElementById('merch-requests-list');
  const empty = document.getElementById('merch-requests-empty');
  if (!list || !empty) return; // not on this screen's DOM yet during early init

  document.getElementById('merch-bell-dot').classList.toggle('hidden', !merchRequests.some(r => r.status === 'processing'));

  const filtered = merchRequests.filter(r => !r.shipped && (merchHomeFilter === 'all' || r.origin === merchHomeFilter));
  list.innerHTML = '';
  empty.style.display = filtered.length ? 'none' : '';

  filtered.slice().reverse().forEach(req => {
    const row = document.createElement('button');
    row.className = 'inst-list-item';
    row.style.cssText = 'width:100%;text-align:left;font-family:var(--font-body);cursor:pointer;';

    const originLabel = req.origin === 'self' ? 'От меня' : 'От клиента';
    const title = req.productName || req.phone;
    let rightHTML;
    if (req.status === 'processing') {
      rightHTML = `<span class="inst-list-timer">${formatCountdown(req.deadline)}</span>`;
    } else if (req.status === 'confirmed') {
      rightHTML = `<span class="inst-status-badge active"><span class="inst-badge-dot"></span>Ожидает отгрузки</span>`;
    } else {
      rightHTML = `<span class="inst-status-badge pending"><span class="inst-badge-dot"></span>${STATUS_LABEL[req.status]}</span>`;
    }

    row.innerHTML = `<div class="inst-list-icon"><svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#0fa882" stroke-width="1.4"/><path d="M5.5 9.2L7.8 11.5L12.5 6.5" stroke="#0fa882" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="inst-list-info"><div class="inst-list-title">${title}</div><div class="inst-list-sub">${originLabel} · ${req.phone}</div></div><div class="inst-list-right">${rightHTML}<span class="inst-list-arrow">›</span></div>`;
    row.addEventListener('click', () => openRequest(req.id));
    list.appendChild(row);
  });
}

screenEnterHandlers['screen-merch-home'] = renderMerchHome;

document.querySelectorAll('#merch-filter-row .merch-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#merch-filter-row .merch-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    merchHomeFilter = btn.dataset.filter;
    renderMerchHome();
  });
});

// Tap on bell → just a quick summary; the full list is already right there on the home screen
document.getElementById('merch-bell-btn').addEventListener('click', () => {
  const count = merchRequests.filter(r => r.status === 'processing').length;
  showToast(count > 0 ? `Заявок ждёт обработки: ${count}` : 'Нет новых заявок');
});

// --- Merch new application form (self-initiated: merchant enters a walk-in customer) ---
const merchPhoneInput = document.getElementById('merch-phone');
const btnMerchSubmit = document.getElementById('btn-merch-submit');
const merchProductPhotoInput = document.getElementById('merch-product-photo-input');
const merchBarcodePhotoInput = document.getElementById('merch-barcode-photo-input');
const merchProductPhotoPreview = document.getElementById('merch-product-photo-preview');
const merchBarcodePhotoPreview = document.getElementById('merch-barcode-photo-preview');
const merchProductPhotoContent = document.getElementById('merch-product-photo-content');
const merchBarcodePhotoContent = document.getElementById('merch-barcode-photo-content');
const merchProductPhotoArea = document.getElementById('merch-product-photo-area');
const merchBarcodePhotoArea = document.getElementById('merch-barcode-photo-area');
let merchProductPhotoSet = false;
let merchBarcodePhotoSet = false;

function validateMerchForm() {
  const digits = merchPhoneInput.value.replace(/\D/g, '');
  const phoneOk = digits.length === 12;
  btnMerchSubmit.disabled = !(phoneOk && merchProductPhotoSet && merchBarcodePhotoSet);
}

merchPhoneInput.addEventListener('input', () => {
  merchPhoneInput.value = formatPhone(merchPhoneInput.value);
  merchPhoneInput.setSelectionRange(merchPhoneInput.value.length, merchPhoneInput.value.length);
  validateMerchForm();
});

handlePhotoInput(
  merchProductPhotoInput, merchProductPhotoPreview,
  merchProductPhotoContent, merchProductPhotoArea,
  v => { merchProductPhotoSet = v; validateMerchForm(); }
);
handlePhotoInput(
  merchBarcodePhotoInput, merchBarcodePhotoPreview,
  merchBarcodePhotoContent, merchBarcodePhotoArea,
  v => { merchBarcodePhotoSet = v; validateMerchForm(); }
);

let _pendingSelfRequestId = null;

btnMerchSubmit.addEventListener('click', () => {
  btnMerchSubmit.textContent = 'Отправляется…';
  btnMerchSubmit.disabled = true;
  setTimeout(() => {
    const req = createRequest('self', merchPhoneInput.value);
    req.productPhoto = merchProductPhotoPreview.src;
    req.barcodePhoto = merchBarcodePhotoPreview.src;
    _pendingSelfRequestId = req.id;
    showToast('Заявка отправлена клиенту!');
    showScreen('screen-merch-new-pending');
  }, 1200);
});

screenEnterHandlers['screen-merch-new-form'] = () => {
  merchPhoneInput.value = '+998';
  merchProductPhotoSet = false;
  merchBarcodePhotoSet = false;
  merchProductPhotoPreview.classList.remove('show');
  merchBarcodePhotoPreview.classList.remove('show');
  merchProductPhotoContent.style.display = '';
  merchBarcodePhotoContent.style.display = '';
  merchProductPhotoArea.classList.remove('has-photo');
  merchBarcodePhotoArea.classList.remove('has-photo');
  btnMerchSubmit.textContent = 'Отправить заявку';
  btnMerchSubmit.disabled = true;
};

// --- Merch new-pending: simulate incoming push after delay ---
let _merchPushTimer = null;
const merchPushBanner = document.getElementById('merch-push-banner');

screenEnterHandlers['screen-merch-new-pending'] = () => {
  merchPushBanner.classList.remove('show');
  clearTimeout(_merchPushTimer);
  _merchPushTimer = setTimeout(() => {
    merchPushBanner.classList.add('show');
  }, 3000);
};

merchPushBanner.addEventListener('click', () => {
  merchPushBanner.classList.remove('show');
  clearTimeout(_merchPushTimer);
  currentRequestId = _pendingSelfRequestId;
  showScreen('screen-merch-incoming');
});

// --- Merch incoming: fill info / reject ---
screenEnterHandlers['screen-merch-incoming'] = () => {
  const req = getCurrentRequest();
  if (!req) return;
  document.getElementById('merch-incoming-phone').textContent = req.phone;
  document.getElementById('merch-incoming-name').textContent = req.origin === 'client' ? 'Олег' : '—';
  document.getElementById('merch-incoming-appnum').textContent = req.appNumber;
};

document.getElementById('btn-merch-fill-info').addEventListener('click', () => {
  showScreen('screen-merch-fill-info');
});

document.getElementById('btn-merch-reject-app').addEventListener('click', () => {
  if (currentRequestId) removeRequest(currentRequestId);
  showToast('Заявка отклонена');
  showScreen('screen-merch-home');
});

// --- Merch fill product info ---
const merchItemNameInput = document.getElementById('merch-item-name');
const merchItemCategoryInput = document.getElementById('merch-item-category');
const merchItemPriceInput = document.getElementById('merch-item-price');
const merchItemMarkingInput = document.getElementById('merch-item-marking');
const btnMerchFillSubmit = document.getElementById('btn-merch-fill-submit');

function formatPrice(val) {
  return val.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function validateMerchFillForm() {
  const nameOk = merchItemNameInput.value.trim().length > 0;
  const categoryOk = merchItemCategoryInput.value.trim().length > 0;
  const priceOk = merchItemPriceInput.value.replace(/\D/g, '').length > 0;
  const markingOk = merchItemMarkingInput.value.trim().length > 0;
  btnMerchFillSubmit.disabled = !(nameOk && categoryOk && priceOk && markingOk);
}

merchItemNameInput.addEventListener('input', validateMerchFillForm);
merchItemCategoryInput.addEventListener('input', validateMerchFillForm);
merchItemPriceInput.addEventListener('input', () => {
  merchItemPriceInput.value = formatPrice(merchItemPriceInput.value);
  validateMerchFillForm();
});
merchItemMarkingInput.addEventListener('input', validateMerchFillForm);

handlePhotoInput(productPhotoInput, productPhotoPreview, productPhotoContent, productPhotoArea, v => { productPhotoSet = v; validateMerchFillForm(); });
handlePhotoInput(barcodePhotoInput, barcodePhotoPreview, barcodePhotoContent, barcodePhotoArea, v => { barcodePhotoSet = v; validateMerchFillForm(); });

document.querySelectorAll('#term-select .term-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#term-select .term-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const req = getCurrentRequest();
    if (req) req.term = parseInt(btn.dataset.term, 10);
  });
});

function setFillInfoPhoto(preview, content, area, existingSrc, setter) {
  if (existingSrc) {
    preview.src = existingSrc;
    preview.classList.add('show');
    content.style.display = 'none';
    area.classList.add('has-photo');
    setter(true);
  } else {
    preview.classList.remove('show');
    content.style.display = '';
    area.classList.remove('has-photo');
    setter(false);
  }
}

screenEnterHandlers['screen-merch-fill-info'] = () => {
  const req = getCurrentRequest();
  merchItemNameInput.value = '';
  merchItemCategoryInput.value = '';
  merchItemPriceInput.value = '';
  merchItemMarkingInput.value = '';
  const term = req ? req.term : 6;
  document.querySelectorAll('#term-select .term-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.term, 10) === term));

  // If the merchant already attached photos themselves (self-initiated flow), keep them — otherwise require capture here.
  setFillInfoPhoto(productPhotoPreview, productPhotoContent, productPhotoArea, req ? req.productPhoto : '', v => { productPhotoSet = v; });
  setFillInfoPhoto(barcodePhotoPreview, barcodePhotoContent, barcodePhotoArea, req ? req.barcodePhoto : '', v => { barcodePhotoSet = v; });

  btnMerchFillSubmit.textContent = 'Подтвердить заявку';
  validateMerchFillForm();
};

btnMerchFillSubmit.addEventListener('click', () => {
  const req = getCurrentRequest();
  if (!req) return;
  btnMerchFillSubmit.textContent = 'Отправляется…';
  btnMerchFillSubmit.disabled = true;
  req.productName = merchItemNameInput.value.trim();
  req.price = merchItemPriceInput.value.trim();
  req.productPhoto = productPhotoSet ? productPhotoPreview.src : '';
  req.barcodePhoto = barcodePhotoSet ? barcodePhotoPreview.src : '';
  req.deadline = null; // merchant has acted — no longer at risk of auto-expiry
  setTimeout(() => {
    showScreen('screen-merch-scoring');
  }, 700);
});

// --- Scoring: re-check the client's limit before the deal becomes active ---
screenEnterHandlers['screen-merch-scoring'] = () => {
  const spinner = document.getElementById('merch-scoring-spinner');
  const check = document.getElementById('merch-scoring-check');
  const text = document.getElementById('merch-scoring-text');
  spinner.style.display = 'flex';
  check.classList.remove('show');
  text.textContent = 'Отправляем заявку на скоринг…';

  clearTimeout(screenEnterHandlers._scoringTimeout);
  screenEnterHandlers._scoringTimeout = setTimeout(() => {
    spinner.style.display = 'none';
    check.classList.add('show');
    text.textContent = 'Лимит подтверждён!';
    const req = getCurrentRequest();
    if (req) req.status = 'awaiting_client';

    clearTimeout(screenEnterHandlers._scoringDoneTimeout);
    screenEnterHandlers._scoringDoneTimeout = setTimeout(() => {
      showToast('Заявка подтверждена! Ожидаем клиента');
      showScreen('screen-merch-waiting');
    }, 900);
  }, 1800);
};

// --- Merch waiting: push banner when client accepts the terms ---
const merchShipPushBanner = document.getElementById('merch-ship-push-banner');

function refreshMerchWaitingBanner() {
  if (!document.getElementById('screen-merch-waiting').classList.contains('active')) return;
  const req = getCurrentRequest();
  merchShipPushBanner.classList.toggle('show', !!req && req.status === 'confirmed');
}

screenEnterHandlers['screen-merch-waiting'] = refreshMerchWaitingBanner;

merchShipPushBanner.addEventListener('click', () => {
  merchShipPushBanner.classList.remove('show');
  showScreen('screen-merch-ready');
});

// --- Merch ready to ship: handover photo + ship goods ---
const merchHandoverPhotoInput = document.getElementById('merch-handover-photo-input');
const merchHandoverPhotoPreview = document.getElementById('merch-handover-photo-preview');
const merchHandoverPhotoContent = document.getElementById('merch-handover-photo-content');
const merchHandoverPhotoArea = document.getElementById('merch-handover-photo-area');
const btnShipGoods = document.getElementById('btn-ship-goods');
let merchHandoverPhotoSet = false;

handlePhotoInput(merchHandoverPhotoInput, merchHandoverPhotoPreview, merchHandoverPhotoContent, merchHandoverPhotoArea, v => {
  merchHandoverPhotoSet = v;
  btnShipGoods.disabled = !v;
});

screenEnterHandlers['screen-merch-ready'] = () => {
  const req = getCurrentRequest();
  document.getElementById('merch-ready-item-name').textContent = (req && req.productName) || 'Товар';
  document.getElementById('merch-ready-item-price').textContent = `${(req && req.price) || '0'} сум`;
  setPhotoEl('merch-ready-product-photo', null, req ? req.productPhoto : '');
  setPhotoEl('merch-ready-barcode-photo', null, req ? req.barcodePhoto : '');
  merchHandoverPhotoSet = false;
  merchHandoverPhotoPreview.classList.remove('show');
  merchHandoverPhotoContent.style.display = '';
  merchHandoverPhotoArea.classList.remove('has-photo');
  btnShipGoods.disabled = true;
  btnShipGoods.textContent = 'Товар отгружен';
};

btnShipGoods.addEventListener('click', () => {
  btnShipGoods.textContent = 'Отгружается…';
  btnShipGoods.disabled = true;
  setTimeout(() => {
    const req = getCurrentRequest();
    if (req) {
      const now = new Date();
      const amountDigits = parseInt((req.price || '').replace(/\D/g, ''), 10) || 0;
      merchHistory.unshift({
        name: req.productName || 'Товар',
        phone: req.phone || '+998 90 ···· 4412',
        date: `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`,
        amount: req.price || '0',
        amountDigits,
      });
      // Mark shipped (drops off the merchant's live list) without deleting it — the client's
      // installment is still active and keeps showing under "Активные" until fully paid off.
      req.shipped = true;
    }
    showToast('Товар отгружен! Средства поступят в течение 1 рабочего дня');
    showScreen('screen-merch-done');
  }, 1000);
});
