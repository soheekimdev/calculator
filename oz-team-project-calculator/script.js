'use strict';

const displayInput = document.querySelector('.calculator__result-input');
const buttons = document.querySelectorAll('.calculator__button');

const displayButtonNumber = (event) => {
  const buttonEl = event.target;
  if (displayInput.value === '0') {
    displayInput.value = buttonEl.textContent;
  } else {
    displayInput.value += buttonEl.textContent;
  }
};

const displayButtonPoint = (event) => {
  const buttonEl = event.target;
  if (!displayInput.value.includes('.')) {
    displayInput.value += buttonEl.textContent;
  }
};

const displayButtonClear = () => {
  displayInput.value = '0';
};

const displayButtonContent = (event) => {
  const buttonEl = event.target;
  console.log(buttonEl.textContent);
  if (buttonEl.classList.contains('calculator__button--number')) {
    displayButtonNumber(event);
  } else if (buttonEl.textContent === '.') {
    displayButtonPoint(event);
  } else if (buttonEl.textContent === 'C') {
    displayButtonClear(event);
  }
};

buttons.forEach((button) => {
  button.addEventListener('click', displayButtonContent);
});
