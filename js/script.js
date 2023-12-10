window.addEventListener('load', function() {

    const wheel1 = document.querySelector('.b-spin').querySelector('.b-box-2');
    const wheel2 = document.querySelector('.b-spin').querySelector('.b-box-3');
    const btnWheel = document.querySelector('.b-spin').querySelector('.b-btn');
    const btnText = document.getElementById('btn_text');
    const cardLeft = document.querySelectorAll('.card_left');
    const cardrigth = document.querySelectorAll('.card_rigth');
    const modal = document.querySelector('.popup');

    let stop = false;
    let step = 1;
    btnWheel.addEventListener('click', ()=>{
        if (!stop) {
            stop = true;
            if (step === 1) {
                wheel1.classList.add('a-go');
                wheel2.classList.add('a-spin-1');
                setTimeout(() => {
                    wheel1.classList.remove('a-go');
                    btnText.classList.add('a-open');
                    cardLeft[0].classList.add('a-open');
                    cardLeft[1].classList.add('a-open');
                    stop = false;
                    step = 2;
                }, 3500);
            }
            if (step === 2) {
                wheel1.classList.add('a-go');
                wheel2.classList.remove('a-spin-1');
                wheel2.classList.add('a-spin-2');
                setTimeout(() => {
                    wheel1.classList.remove('a-go');
                    cardrigth[0].classList.add('a-open');
                    cardrigth[1].classList.add('a-open');
                    stop = false;
                    step = 3;
                }, 3500);
                setTimeout(() => {
                    modal.classList.add('a-open');
                }, 5500);
            }
        }
    });

});