'use strict';

const displayInput = document.querySelector('.calculator__result-input');
const buttons = document.querySelectorAll('.calculator__button');
let firstOperand = null;
let secondOperand = null;
let operator = null;
let isNewInput = false;

const calculate = (firstOperand, operator, secondOperand) => {
  switch (operator) {
    case '/':
      return parseInt(firstOperand) / parseInt(secondOperand);
    case '*':
      return parseInt(firstOperand) * parseInt(secondOperand);
    case '-':
      return parseInt(firstOperand) - parseInt(secondOperand);
    case '+':
      return parseInt(firstOperand) + parseInt(secondOperand);
    default:
      throw new Error('알 수 없는 연산자');
  }
};

const handleOperator = (buttonEl) => {
  firstOperand = displayInput.value;
  operator = buttonEl.textContent;
  isNewInput = true;
};

const handleNumber = (buttonEl) => {
  if (displayInput.value === '0' || isNewInput) {
    displayInput.value = buttonEl.textContent;
  } else {
    displayInput.value += buttonEl.textContent;
  }
  isNewInput = false;
};

const handlePoint = (buttonEl) => {
  if (!displayInput.value.includes('.')) {
    displayInput.value += buttonEl.textContent;
  }
};

const clear = () => {
  displayInput.value = '0';
};

const handleButtonClick = (event) => {
  const buttonEl = event.target;

  if (buttonEl.classList.contains('calculator__button--number')) {
    handleNumber(buttonEl);
  } else if (buttonEl.classList.contains('calculator__button--operator')) {
    handleOperator(buttonEl);
  } else if (buttonEl.textContent === '=') {
    displayInput.value = calculate(firstOperand, operator, displayInput.value);
  } else if (buttonEl.textContent === '.') {
    handlePoint(buttonEl);
  } else if (buttonEl.textContent === 'C') {
    clear();
  }
};

buttons.forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});
