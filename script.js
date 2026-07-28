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

// --- Home screen: toggle widgets by state ---
let applicationPending = false;

screenEnterHandlers['screen-home'] = () => {
  const emptyWidget = document.getElementById('empty-card-widget');
  const limitWidget = document.getElementById('limit-widget');
  const pendingWidget = document.getElementById('pending-widget');

  emptyWidget.style.display = 'none';
  limitWidget.classList.remove('show');
  pendingWidget.classList.remove('show');

  if (applicationPending) {
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

// --- QR Scanner screen ---
let currentStore = 'Texnomart — Чиланзар';

screenEnterHandlers['screen-qr'] = () => {
  // beam animation restarts automatically via CSS
};

// --- Store form screen ---
const submitOrderBtn = document.getElementById('btn-submit-order');
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

function validateStoreForm() {
  submitOrderBtn.disabled = !(productPhotoSet && barcodePhotoSet);
}

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
        validateStoreForm();
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });
}

handlePhotoInput(productPhotoInput, productPhotoPreview, productPhotoContent, productPhotoArea, v => { productPhotoSet = v; });
handlePhotoInput(barcodePhotoInput, barcodePhotoPreview, barcodePhotoContent, barcodePhotoArea, v => { barcodePhotoSet = v; });

// --- Store form: installment term select ---
document.querySelectorAll('#term-select .term-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#term-select .term-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTerm = parseInt(btn.dataset.term, 10);
  });
});

submitOrderBtn.addEventListener('click', () => {
  submitOrderBtn.textContent = 'Отправляется…';
  submitOrderBtn.disabled = true;
  setTimeout(() => {
    applicationPending = true;
    startRequestTimer();
    document.getElementById('pending-store-name').textContent = currentStore;
    document.getElementById('merch-incoming-term').textContent = `${currentTerm} месяцев`;
    showToast('Заявка отправлена! Ожидайте подтверждения');
    showScreen('screen-home');
  }, 1200);
});

screenEnterHandlers['screen-store-form'] = () => {
  clearInterval(qrTimerInterval);
  productPhotoSet = false;
  barcodePhotoSet = false;
  productPhotoPreview.classList.remove('show');
  barcodePhotoPreview.classList.remove('show');
  productPhotoContent.style.display = '';
  barcodePhotoContent.style.display = '';
  productPhotoArea.classList.remove('has-photo');
  barcodePhotoArea.classList.remove('has-photo');
  submitOrderBtn.disabled = true;
  submitOrderBtn.textContent = 'Отправить заявку';
  submitOrderBtn.style.background = '';
  submitOrderBtn.style.color = '';
  currentTerm = 6;
  document.querySelectorAll('#term-select .term-btn').forEach(b => b.classList.toggle('active', b.dataset.term === '6'));
};

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
let installmentActive = false;
let clientConfirmed = false;
let currentProductName = '';
let currentProductPrice = '';
let currentTerm = 6;

const REQUEST_TIMEOUT_MS = 15 * 60 * 1000;
let requestDeadline = null;
let requestTimerInterval = null;

function startRequestTimer() {
  requestDeadline = Date.now() + REQUEST_TIMEOUT_MS;
  clearInterval(requestTimerInterval);
  updateRequestTimer();
  requestTimerInterval = setInterval(updateRequestTimer, 1000);
}

function stopRequestTimer() {
  clearInterval(requestTimerInterval);
  requestTimerInterval = null;
  requestDeadline = null;
}

function updateRequestTimer() {
  if (!requestDeadline) return;
  const msLeft = requestDeadline - Date.now();
  if (msLeft <= 0) {
    stopRequestTimer();
    applicationPending = false;
    showToast('Заявка отменена — магазин не принял её вовремя');
    renderInstallmentScreen();
    screenEnterHandlers['screen-home']();
    return;
  }
  const totalSec = Math.ceil(msLeft / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  const text = `${min}:${String(sec).padStart(2, '0')}`;
  const timerEl = document.getElementById('inst-request-timer');
  const listTimerEl = document.getElementById('inst-list-timer');
  if (timerEl) timerEl.textContent = text;
  if (listTimerEl) listTimerEl.textContent = text;
}

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

function renderInstallmentScreen() {
  const requestsSection = document.getElementById('installment-requests-section');
  const activeSection = document.getElementById('installment-active-section');
  const emptyDiv = document.getElementById('installment-empty');

  const showRequest = applicationPending && !installmentActive;
  requestsSection.style.display = showRequest ? '' : 'none';
  activeSection.style.display = installmentActive ? '' : 'none';
  emptyDiv.style.display = (!showRequest && !installmentActive) ? '' : 'none';

  if (showRequest) {
    document.getElementById('inst-request-store').textContent = currentStore;
    document.getElementById('inst-list-request-store').textContent = currentStore;
    updateRequestTimer();
  }

  if (installmentActive) {
    const badge = document.getElementById('installment-status-badge');
    const listBadge = document.getElementById('inst-list-badge');
    const confirmBtn = document.getElementById('btn-confirm-installment');
    const priceDigits = parseInt((currentProductPrice || '').replace(/\D/g, ''), 10) || 0;

    if (currentProductName) {
      document.getElementById('inst-product-name').textContent = currentProductName;
      document.getElementById('inst-list-name').textContent = currentProductName;
    }
    document.getElementById('inst-price').textContent = currentProductPrice || '0';
    document.getElementById('inst-term-label').textContent = `сум · ${currentTerm} мес`;
    document.getElementById('inst-list-price').textContent = `${currentProductPrice || '0'} сум · ${currentTerm} мес`;
    renderPaymentSchedule(currentTerm, priceDigits);

    if (clientConfirmed) {
      badge.className = 'inst-status-badge active';
      badge.innerHTML = '<span class="inst-badge-dot"></span>Активна';
      listBadge.className = 'inst-status-badge active';
      listBadge.innerHTML = '<span class="inst-badge-dot"></span>Активна';
      confirmBtn.textContent = 'Принято ✓';
      confirmBtn.disabled = true;
      confirmBtn.style.background = 'linear-gradient(135deg, #14c99a, #0fa882)';
      confirmBtn.style.color = '#fff';
    } else {
      badge.className = 'inst-status-badge pending';
      badge.innerHTML = '<span class="inst-badge-dot"></span>Оформление';
      listBadge.className = 'inst-status-badge pending';
      listBadge.innerHTML = '<span class="inst-badge-dot"></span>Оформление';
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
  clientConfirmed = true;
  renderInstallmentScreen();
  showToast('Рассрочка подтверждена! Можете забрать товар в магазине');
});

// ════════════════════════════════════════
// MERCHANT APP
// ════════════════════════════════════════

// --- Merch home: show incoming applications section when there's a pending client request ---
screenEnterHandlers['screen-merch-home'] = () => {
  const incomingSection = document.getElementById('merch-incoming-section');
  incomingSection.style.display = applicationPending ? 'block' : 'none';
  document.getElementById('merch-bell-dot').classList.toggle('hidden', !applicationPending);
};

// Tap on notification card → incoming screen
document.getElementById('merch-notif-card').addEventListener('click', () => {
  showScreen('screen-merch-incoming');
});

// Tap on bell → incoming screen (if there's something to review)
document.getElementById('merch-bell-btn').addEventListener('click', () => {
  if (applicationPending) {
    showScreen('screen-merch-incoming');
  } else {
    showToast('Нет новых заявок');
  }
});

// --- Merch new application form ---
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

btnMerchSubmit.addEventListener('click', () => {
  btnMerchSubmit.textContent = 'Отправляется…';
  btnMerchSubmit.disabled = true;
  setTimeout(() => {
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
    applicationPending = true;
    startRequestTimer();
    merchPushBanner.classList.add('show');
  }, 3000);
};

merchPushBanner.addEventListener('click', () => {
  merchPushBanner.classList.remove('show');
  clearTimeout(_merchPushTimer);
  showScreen('screen-merch-incoming');
});

// --- Merch incoming: fill info / reject ---
document.getElementById('btn-merch-fill-info').addEventListener('click', () => {
  showScreen('screen-merch-fill-info');
});

document.getElementById('btn-merch-reject-app').addEventListener('click', () => {
  applicationPending = false;
  stopRequestTimer();
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

screenEnterHandlers['screen-merch-fill-info'] = () => {
  merchItemNameInput.value = '';
  merchItemCategoryInput.value = '';
  merchItemPriceInput.value = '';
  merchItemMarkingInput.value = '';
  btnMerchFillSubmit.disabled = true;
  btnMerchFillSubmit.textContent = 'Подтвердить заявку';
};

btnMerchFillSubmit.addEventListener('click', () => {
  btnMerchFillSubmit.textContent = 'Отправляется…';
  btnMerchFillSubmit.disabled = true;
  setTimeout(() => {
    currentProductName = merchItemNameInput.value.trim();
    currentProductPrice = merchItemPriceInput.value.trim();
    installmentActive = true;
    applicationPending = false; // clear notification badge
    stopRequestTimer();
    showToast('Заявка подтверждена! Ожидаем клиента');
    showScreen('screen-merch-waiting');
  }, 900);
});

// --- Merch ship goods ---
document.getElementById('btn-ship-goods').addEventListener('click', () => {
  document.getElementById('btn-ship-goods').textContent = 'Отгружается…';
  document.getElementById('btn-ship-goods').disabled = true;
  setTimeout(() => {
    showToast('Товар отгружен! Средства поступят в течение 1 рабочего дня');
    showScreen('screen-merch-done');
  }, 1000);
});
