!function () {
  document.querySelector('.form__view-password').addEventListener('click', function () {
    var use = this.querySelector('use');
    var pass = document.querySelector('#password');
    if (use.getAttribute('href') !== '#eye-off') {
      pass.type = 'password';
      use.setAttribute('href', '#eye-off');
    } else {
      pass.type = 'text';
      use.setAttribute('href', '#eye-on');
    }
  });

  var form = document.querySelector('form');
  var tabs = document.querySelectorAll('.form__tab');
  tabs.forEach(function (el) {
    el.addEventListener('click', function () {
      tabs.forEach(function (els) {
        els.classList.remove('active')
      });
      this.classList.add('active');
      formInit(this.getAttribute('data-form'));
      form.querySelector('[name="type"]').value = this.getAttribute('data-form');
      form.querySelectorAll('.form__input,.form__select').forEach(function (el) {
        el.classList.remove('error', 'good')
      })
    });
  });

  function viewBox(el, view) {
    if (view) {
      var name = el.type === 'tel' ? 'phone' :
        el.type === 'email' ? 'email' :
          el.id === 'password' ? 'password' : '';
      if (name !== '') {
        el.name = name;
        el.closest('.form__item').classList.remove('hide');
        el.value = el.getAttribute('data-value') ? el.getAttribute('data-value') : '';
        if (name === 'phone') document.querySelector('.form__phone-mask').innerHTML = '<span>' + el.getAttribute('data-value') + '</span>&nbsp;' + el.getAttribute('data-mask');
      }
    } else {
      el.name = '';
      el.closest('.form__item').classList.add('hide')
    }
  }

  function formInit(type) {
    form.querySelectorAll('input').forEach(function (el) {
      switch (!0) {
        case type === 'email':
          viewBox(el, el.type !== 'tel');
          break;
        case type === 'phone':
          viewBox(el, el.type !== 'email');
          break;
        case type === 'click':
          viewBox(el, el.type !== 'email' && el.type !== 'tel' && el.id !== 'password');
          break;
      }
    })
  }

  formInit('email');

  function passTest(_this, el) {
    var error = '';
    if (el) {
      var text = el.querySelectorAll('span');
      text.forEach(function (el) {
        el.classList.remove('pass__info--off', 'pass__info--on');
      });
    }

    if (_this.value.length) {
      if (/^[a-z0-9]+$/ig.test(_this.value) && /[a-z]/i.test(_this.value)) {
        if (el) text[0].classList.add('pass__info--on');
      } else {
        error = 'Пароль должен состоять из латинских букв';
        if (el) text[0].classList.add('pass__info--off');
      }
      if (/[0-9]/g.test(_this.value)) {
        if (el) text[1].classList.add('pass__info--on')
      } else {
        error += (error !== '' ? '<br>' : '') + 'Должна присутствовать хотя бы одна цифра';
        if (el) text[1].classList.add('pass__info--off');
      }
      if (_this.value.length > 5) {
        if (el) text[2].classList.add('pass__info--on')
      } else {
        error += (error !== '' ? '<br>' : '') + 'Короткий пароль';
        if (el) text[2].classList.add('pass__info--off');
      }
    } else {
      error = 'Поле обязательно для заполнения';
    }
    return error;
  }

  function passInit(e) {
    var info = this.parentNode.querySelector('.form__error');

    switch (e.type) {
      case 'focus':
        this.parentNode.classList.remove('error', 'good');
        if (!info.classList.contains('info')) {
          info.innerHTML = '<span class="pass__info">только латинские буквы, минимум 1</span><span class="pass__info">минимум 1 цифра (0-9)</span><span class="pass__info">минимум 6 символов</span>';
          if (passTest(this, info) !== '') {
            info.classList.add('info');
            info.classList.add('show');
          }
        }
        break;
      case 'blur':
        info.classList.remove('show');
        var errorText = passTest(this, info);
        if (errorText !== '') {
          info.classList.remove('info');
          info.innerHTML = errorText;
          this.parentNode.classList.add('error');
        } else {
          this.parentNode.classList.add('good');
          setTimeout(function () {
            info.classList.remove('info');
            info.innerHTML = '';
          }, 250);
        }
        break;
      case 'input':
        passTest(this, info);
        break;
    }
  }

  function emailTest(_this) {
    var error = '';
    if (_this.value.length) {
      if (!/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,}$/.test(_this.value)) {
        error = 'Введён некорректный E-mail';
      }
    } else {
      error = 'Поле обязательно для заполнения';
    }

    return error;
  }

  function emailInit(e) {
    switch (e.type) {
      case 'focus':
        this.parentNode.classList.remove('error', 'good');
        break;
      case 'blur':
        var errorText = emailTest(this);
        if (errorText !== '') {
          this.parentNode.querySelector('.form__error').innerHTML = errorText;
          this.parentNode.classList.add('error');
        } else {
          this.parentNode.classList.add('good');
        }
        break;
    }
  }

  function countryInit(th, event, el) {
    var country = th.querySelector('[name="country"]');
    if (country) {
      if (event === 'open') {
        country.setAttribute('value', '');
        country.value = '';
        country.focus();
      } else if (event === 'close') {
        country.setAttribute('value', th.querySelector('.form__text').innerText);
        country.value = th.querySelector('.form__text').innerText;
        if (th.nextElementSibling.classList.contains('form__select-box')) {
          th.nextElementSibling.querySelectorAll('.form__option').forEach(function (el) {
            el.style.display = '';
          })
        }
      }
      if (el && el.getAttribute('data-currency')) {
        var currency = document.querySelector('[name="currency"]');
        currency.closest('.form__select').querySelector('.form__currency use').setAttribute('href', '#' + el.getAttribute('data-currency').toLowerCase());
        currency.closest('.form__select').querySelector('.form__text').innerHTML = el.getAttribute('data-currency');
        currency.setAttribute('value', el.getAttribute('data-currency'));
        currency.value = el.getAttribute('data-currency');
      }
    }
  }

  function phoneInit(e) {
    var mask = this.getAttribute('data-value') + ' ' + this.getAttribute('data-mask');
    var _th = this;
    switch (e.type) {
      case 'focus':
        this.setAttribute('data-old', this.value);
        this.parentNode.classList.remove('error', 'good');
        this.parentNode.classList.add('focus');
        setTimeout(function () {
          _th.selectionStart = _th.value.length;
        }, 100);
        break;
      case 'blur':
        this.parentNode.classList.remove('focus');
        if (this.value.length < mask.length) {
          this.parentNode.querySelector('.form__error').innerHTML = 'Поле обязательно для заполнения';
          this.parentNode.classList.add('error');
        } else {
          this.parentNode.classList.add('good');
        }
        break;
      case 'input':
        var placeholder = document.querySelector('.form__phone-mask');
        this.value = this.value.replace(/[^0-9+\- ]/, '');
        if (this.value.length < this.getAttribute('data-value').length) {
          this.value = this.getAttribute('data-value');
          this.setAttribute('value', this.getAttribute('data-value'));
        } else {
          var testError = !1;
          if (this.value.length < mask.length) {
            if (mask.replace(/[- ]/g, '').length === this.value.replace(/[- ]/g, '').length) this.value = this.getAttribute('data-old');

            this.value = this.value.replace(/[- ]+$/, '');
            var s = mask.slice(this.value.length - 1, this.value.length);
            if (/[- ]/.test(s)) this.value = this.value.slice(0, -1) + mask.slice(this.value.length - 1).match(/[^x]+/i)[0] + this.value.slice(-1);
            if (this.value.replace(/\d/g, 'X') !== mask.slice(0, this.value.length).replace(/\d/g, 'X')) this.value = this.getAttribute('data-old');
          } else {
            testError = !1;
            mask.split('').forEach(function (value, index) {
              if (value !== 'X' && _th.value[index] !== value ||
                value === 'X' && !/\d/.test(_th.value[index])) testError = !0;
            });
            if (testError) this.value = this.getAttribute('data-old');
            this.value = this.value.slice(0, mask.length);
          }
          this.setAttribute('value', this.value);
        }
        var temp = '<span>' + this.value.replace(/\s/g, '&nbsp;') + '</span>' + mask.slice(this.value.length).replace(/\s/g, '&nbsp;');
        if (temp !== placeholder.innerHTML) placeholder.innerHTML = temp;
        this.setAttribute('data-old', this.value);
        break;
    }
  }

  var passBox = document.querySelector('#password[type="password"]');
  var emailBox = document.querySelector('[type="email"]');
  var phoneBox = document.querySelector('[type="tel"]');

  [
    [passBox, passInit],
    [emailBox, emailInit],
    [phoneBox, phoneInit]
  ].forEach(function (el) {
    ['focus', 'blur', 'input'].forEach(function (event) {
      el[0].addEventListener(event, el[1]);
    });
  });

  document.querySelector('[name="country"]').addEventListener('input', function () {
    var text = this.value;
    this.closest('.form__item').querySelectorAll('.form__option').forEach(function (el) {
      el.style.display = '';
      if (!new RegExp(text, 'i').test(el.querySelector('.form__text').innerText)) el.style.display = 'none';
    })
  });

  document.querySelectorAll('.form__select').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (this.classList.contains('select--show')) {
        if (!e.target.name) {
          this.classList.remove('select--show');
          countryInit(this, 'close');
        }
      } else {
        if (this.nextElementSibling.classList.contains('form__select-box')) {
          if (!e.target.type) {
            this.classList.add('select--show');
            this.classList.remove('error', 'good');
            countryInit(this, 'open');
          }
        }
      }
    })
  });

  document.querySelectorAll('.form__option').forEach(function (el) {
    el.addEventListener('click', function () {
      var box = this.closest('.form__select-box').previousElementSibling;
      var value = this.querySelector('.form__text').innerText;
      var input = box.querySelector('input');

      box.querySelector('.form__currency use,.form__flag use').setAttribute('href', this.querySelector('.form__currency use,.form__flag use').getAttribute('href'));
      if (!this.getAttribute('data-mask')) {
        var textBox = box.querySelector('.form__text');
        if (textBox) textBox.innerHTML = value;
        input.setAttribute('value', value);
        input.value = value;
      } else {
        var code = this.querySelector('.form__code').innerText;
        if (code !== input.getAttribute('data-value') || this.getAttribute('data-mask') !== input.getAttribute('data-mask')) {
          input.value = code;
          input.setAttribute('data-value', code);
          input.setAttribute('value', code);
          input.setAttribute('data-mask', this.getAttribute('data-mask'));
          input.parentNode.classList.remove('error', 'good');
          document.querySelector('.form__phone-mask').innerHTML = '<span>' + code + '</span>&nbsp;' + this.getAttribute('data-mask');
        }
      }

      box.classList.remove('select--show');
      countryInit(box, 'close', this);
    });
  });

  document.querySelector('body').addEventListener('click', function (e) {
    var box = e.target.closest('.form__select') || e.target.closest('.form__select-box') && e.target.closest('.form__select-box').previousElementSibling;
    document.querySelectorAll('.select--show').forEach(function (el) {
      if (el !== box) {
        el.classList.remove('select--show');
        countryInit(el, 'close');
      }
    });
  });

  document.querySelector('[name="policy"]').addEventListener('change', function () {
    var but = document.querySelector('.form__button button');
    this.checked ? but.removeAttribute('disabled') : but.setAttribute('disabled', '');
  });
  
  window.popupSystem = function (text, cls) {
    if (text) {
      var popup = document.querySelector('.popup-system');
      if (popup) {
        var textBox = popup.querySelector('.popup-system__content');
        if (cls) textBox.classList.add(cls);
        textBox.innerHTML = text;
        popup.classList.add('init', 'show');
        document.querySelector('body').style.overflow = 'hidden';
      }
    }
  };

  window.popupSystemClose = function () {
    var popup = document.querySelector('.popup-system');
    if (popup) {
      var textBox = popup.querySelector('.popup-system__content');
      popup.classList.remove('show');
      setTimeout(function () {
        textBox.classList.forEach(function (cls) {
          if (cls !== 'popup-system__content') textBox.classList.remove(cls);
        });
        textBox.innerHTML = '';
        popup.classList.remove('init');
        document.querySelector('body').style.overflow = '';
      }, 250);
    }
  };

  document.querySelectorAll('.popup-system__close,.popup-system').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (!e.target.closest('.popup-system__box') || e.target.closest('.popup-system__close')) window.popupSystemClose();
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var formValid = !0;
    form.querySelectorAll('input').forEach(function (el) {
      var errorText = '';
      switch (el.name) {
        case 'email':
          errorText = emailTest(el);
          if (errorText !== '') {
            el.parentNode.querySelector('.form__error').innerHTML = errorText;
            el.parentNode.classList.add('error');
            formValid = !1;
          }
          break;
        case 'phone':
          var mask = el.getAttribute('data-value') + ' ' + el.getAttribute('data-mask');
          if (el.value.length < mask.length) {
            el.parentNode.querySelector('.form__error').innerHTML = 'Поле обязательно для заполнения';
            el.parentNode.classList.add('error');
            formValid = !1;
          }
          break;
        case 'password':
          errorText = passTest(el);
          if (errorText !== '') {
            el.parentNode.querySelector('.form__error').innerHTML = errorText;
            el.parentNode.classList.add('error');
            formValid = !1;
          }
          break;
      }
    });
    if (formValid) {
      window.punch.formSubmit();
    }
  });
}();
