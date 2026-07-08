const screenEnterHandlers = {};

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

// --- Ayat of the day modal ---
const ayatOverlay = document.getElementById('ayat-overlay');
const ayatOpenBtn = document.getElementById('ayat-open-btn');
const ayatCloseBtn = document.getElementById('ayat-close-btn');

ayatOpenBtn.addEventListener('click', () => ayatOverlay.classList.add('show'));
ayatCloseBtn.addEventListener('click', () => ayatOverlay.classList.remove('show'));
ayatOverlay.addEventListener('click', (e) => {
  if (e.target === ayatOverlay) ayatOverlay.classList.remove('show');
});

// --- Next prayer widget (static Tashkent-style schedule for the prototype) ---
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
  news: { badge: 'Новости', title: 'Аманат обновился', text: 'Оформить рассрочку стало ещё быстрее — добавили подпись по СМС-коду и мгновенную привязку карты.' },
  ramadan: { badge: 'Рамадан', title: 'Специально к Рамадану', text: 'Дополнительная скидка 10% на все товары в рассрочку до конца месяца.' },
  cashback: { badge: 'Кэшбэк', title: 'Кэшбэк за платежи', text: 'Оплачивайте рассрочку вовремя и получайте до 2% кэшбэка баллами Аманат.' },
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
  validateForm();
});

function sanitizePassport(value) {
  const cleaned = value.toUpperCase().replace(/[^A-ZА-Я0-9]/g, '');
  // if it starts with 2 letters, treat as passport format: letters + digits only after
  const lettersMatch = cleaned.match(/^[A-ZА-Я]{0,2}/)[0];
  const rest = cleaned.slice(lettersMatch.length).replace(/\D/g, '');
  if (lettersMatch.length > 0) {
    return (lettersMatch + rest).slice(0, 9); // 2 letters + 7 digits
  }
  return rest.slice(0, 14); // pure digits -> PINFL, up to 14
}

passportInput.addEventListener('input', () => {
  const cursorAtEnd = passportInput.selectionStart === passportInput.value.length;
  passportInput.value = sanitizePassport(passportInput.value);
  if (cursorAtEnd) passportInput.setSelectionRange(passportInput.value.length, passportInput.value.length);
  validateForm();
});

function validateForm() {
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

// Reset screen 3 state whenever we navigate into it fresh
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
  phoneConfirmBtn.disabled = digits.length !== 12; // 998 + 9 digits
});

screenEnterHandlers['screen-phone'] = () => {
  if (!phoneInput.value) phoneInput.value = '+998';
};

document.getElementById('btn-phone-confirm').addEventListener('click', () => {
  otpPhoneDisplay.textContent = phoneInput.value;
});

// --- Screen 6: OTP input ---
const otpBoxes = Array.from(document.querySelectorAll('.otp-box'));
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

// --- Screen 8: card binding ---
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

// --- Screen 7: OneID checkbox ---
const oneidCheckbox = document.getElementById('oneid-checkbox');
const oneidConfirmBtn = document.getElementById('btn-oneid-confirm');

oneidCheckbox.addEventListener('change', () => {
  oneidConfirmBtn.disabled = !oneidCheckbox.checked;
});

// --- Screen 8: loader simulation ---
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
    loaderText.textContent = 'Готово! Лимит одобрен';
    loaderSub.textContent = '5 000 000 сум доступно для покупок в рассрочку';
    loaderDoneBtn.classList.remove('btn-hidden');
  }, 2200);
};

// --- Screen PIN: create app PIN code ---
const pinBoxes = Array.from({ length: 4 }, (_, i) => document.getElementById(`pin-${i}`));
const pinConfirmBtn = document.getElementById('btn-pin-confirm');
const pinTitle = document.getElementById('pin-title');
const pinSub = document.getElementById('pin-sub');
const pinError = document.getElementById('pin-error');
let pinStep = 'create'; // 'create' | 'confirm'
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
