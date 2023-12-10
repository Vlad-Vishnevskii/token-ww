(() => {
  // Integrations constants

  const GOOGLE_ANALYTICS_ID = 'G-51RV6GE5YX';
  const GOOGLE_ANALYTICS_URL = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
  const YANDEX_METRIKA_ID = 87944770;
  const YANDEX_METRIKA_URL = 'https://mc.yandex.ru/metrika/tag.js';
  const CRYPTO_JS_URL =
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';

  // ========================================

  // API constants

  const BACKEND_URL = `${window.location.protocol}//${window.location.host}/betconstruct/api`;
  const NETWORK_ERROR = 'Произошла ошибка, попробуйте позднее';
  const COOKIE_ERROR =
    'Для завершения успешной регистрации разрешите использование файлов Cookie';

  // ========================================

  // Check COOKIE

  if (!navigator?.cookieEnabled) {
    window.popupSystem(COOKIE_ERROR, 'error');
  }

  // ========================================

  // APP constants

  const DATE = new Date();

  const REGISTRATION_TYPES = {
    EMAIL: 'email',
    PHONE: 'phone',
    ONE_CLICK: 'click',
  };

  const REGISTRATION_DEFAULT_FIELDS = {
    COUNTRY: 'RUS',
    CURRENCY: 'RUB',
  };

  const BONUS_TYPES = {
    casino: 2,
    sport: 1,
  };

  // ========================================

  // APP helpers

  const request = async (url, method = 'GET', body = null) => {
    try {
      const response = await fetch(url, {
        method,
        body,
      }).then((response) => response.json());
      return Promise.resolve(response);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  const handleResponse = (
    response,
    { successCallback = () => null, rejectCallback = () => null }
  ) => {
    if (response.code === 1) {
      successCallback?.();

      return;
    }

    rejectCallback?.();
  };

  const redirectToPunch = () => {
    window.location.replace('/profile/balance');
  };

  const handleError = (field, errorText) => {
    const errorBlock = field?.parentNode?.querySelector('.form__error');
    errorBlock.innerHTML = errorText;
    field?.parentNode?.classList.remove('good');
    field?.parentNode?.classList.add('error');
  };

  // ========================================

  // Yandex Metrika

  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * DATE;
    (k = e.createElement(t)),
      (a = e.getElementsByTagName(t)[0]),
      (k.async = 1),
      (k.src = r),
      a.parentNode.insertBefore(k, a);
  })(window, document, 'script', YANDEX_METRIKA_URL, 'ym');

  ym(YANDEX_METRIKA_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });

  // ========================================

  // CryptoJS

  const cryptoJsScript = document.createElement('script');
  cryptoJsScript.src = CRYPTO_JS_URL;
  document.head.appendChild(cryptoJsScript);

  const encryptMessage = (message, secretKey) => {
    const encryptedMessage = CryptoJS.AES.encrypt(message, secretKey);
    return encryptedMessage;
  };

  const getStringForUserdata = (login, password, userId) => {
    return `{"timeStamp":${DATE.valueOf()},"data":{"login":${login},"password":"${password}","user_id":${userId}}}`;
  };

  // ========================================

  // Google Analytics

  const googleAnalyticsScript = document.createElement('script');
  googleAnalyticsScript.src = GOOGLE_ANALYTICS_URL;
  googleAnalyticsScript.async = true;
  document.head.appendChild(googleAnalyticsScript);
  googleAnalyticsScript.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', DATE);
    gtag('config', GOOGLE_ANALYTICS_ID);
  };

  // ========================================

  // Referral stag

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const stag = params.get('stag') || null;
  const af_platform_id = params.get('af_platform_id') || null;

  let query = new URLSearchParams();

  if (stag) {
    query.append('stag', stag);
  }

  if (af_platform_id) {
    query.append('af_platform_id', af_platform_id);
  }

  if (stag || af_platform_id) {
    request(`${BACKEND_URL}/stag?${query.toString()}`).then((response) =>
      console.log(response)
    );
  }

  // ========================================

  // Authentification

  const signIn = (login, password) => {
    const signInFormData = new FormData();
    signInFormData.append('login', login);
    signInFormData.append('password', password);
    request(`${BACKEND_URL}/login`, 'POST', signInFormData).then((response) =>
      handleResponse(response, { successCallback: redirectToPunch })
    );
  };

  const formSubmit = () => {
    const formTabs = document.querySelector('.form__tabs');
    const activeTab = formTabs.querySelector('.active').dataset.form;
    const bonusType =
      BONUS_TYPES[document.querySelector('input[name="bonus"]').value];
    const submitBtn = document.querySelector('.form__send');
    submitBtn.disabled = true;

    const signUpFormData = new FormData();

    signUpFormData.append('country_code', REGISTRATION_DEFAULT_FIELDS.COUNTRY);
    signUpFormData.append('currency', REGISTRATION_DEFAULT_FIELDS.CURRENCY);
    signUpFormData.append('accept_first_deposit_bonus', bonusType);

    switch (activeTab) {
      case REGISTRATION_TYPES.EMAIL:
        const emailField = document.querySelector('#e-mail');
        const emailValue = emailField.value.trim();
        const passwordValueEmail = document
          .querySelector('#password')
          .value.trim();
        signUpFormData.append('email', emailValue);
        signUpFormData.append('password', passwordValueEmail);

        request(`${BACKEND_URL}/signup.email`, 'POST', signUpFormData)
          .then((response) =>
            handleResponse(response, {
              successCallback: () => {
                signIn(response.payload.user_id, passwordValueEmail);
              },
              rejectCallback: () => {
                submitBtn.disabled = false;
                handleError(emailField, response.messages[0].message);
              },
            })
          )
          .catch((error) => {
            console.error(error);
            submitBtn.disabled = false;
            window.popupSystem(NETWORK_ERROR, 'error');
          });
        break;
      case REGISTRATION_TYPES.PHONE:
        const phoneField = document.querySelector('#phone1');
        const phoneValue = phoneField.value.replace(/[-+ ]/g, '');
        const passwordValuePhone = document
          .querySelector('#password')
          .value.trim();
        signUpFormData.append('phone', phoneValue);
        signUpFormData.append('password', passwordValuePhone);

        request(`${BACKEND_URL}/signup.phone`, 'POST', signUpFormData)
          .then((response) =>
            handleResponse(response, {
              successCallback: () => {
                signIn(response.payload.user_id, passwordValuePhone);
              },
              rejectCallback: () => {
                submitBtn.disabled = false;
                handleError(phoneField, response.messages[0].message);
              },
            })
          )
          .catch((error) => {
            console.error(error);
            submitBtn.disabled = false;
            window.popupSystem(NETWORK_ERROR, 'error');
          });
        break;
      case REGISTRATION_TYPES.ONE_CLICK:
        request(`${BACKEND_URL}/signup.fast`, 'POST', signUpFormData)
          .then((response) =>
            handleResponse(response, {
              successCallback: () => {
                localStorage.setItem(
                  '_:user-data',
                  encryptMessage(
                    getStringForUserdata(
                      response.payload.login,
                      response.payload.password,
                      response.payload.user_id
                    ),
                    'secret'
                  )
                );
                signIn(response.payload.login, response.payload.password);
              },
              rejectCallback: () => {
                submitBtn.disabled = false;
                window.popupSystem(response.messages[0].message, 'error');
              },
            })
          )
          .catch((error) => {
            console.error(error);
            submitBtn.disabled = false;
            window.popupSystem(NETWORK_ERROR, 'error');
          });
        break;
    }
  };

  window.punch = {
    formSubmit,
  };
})();
