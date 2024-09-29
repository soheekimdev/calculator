'use strict';

// DOM 요소 선택
const displayResult = document.querySelector('.calculator__result');
const buttons = document.querySelectorAll('.calculator__button');

// 계산기 상태 변수
let firstOperand = null;
let operator = null;
let secondOperand = null;
let lastResult = null;
let lastButton = null;
let isNewInput = false;

/**
 * 소수점 이하 10자리까지의 정밀도를 위한 상수
 * 1e10은 10^10을 의미하며, 소수점 이하 10자리까지의 정밀도를 제공한다.
 */
const PRECISION = 1e10;

/**
 * 숫자를 소수점 이하 10자리까지 반올림한다.
 * 부동소수점 연산의 정밀도 문제를 완화하는 데 사용된다.
 * @param {number} num - 반올림할 숫자
 * @returns {number} 소수점 이하 10자리까지 반올림된 숫자
 */
const roundResult = (num) => Math.round(num * PRECISION) / PRECISION;

/**
 * 두 피연산자에 대해 지정된 연산을 수행한다.
 * @param {string} firstOperand - 첫 번째 피연산자
 * @param {string} operator - 연산자 (/, *, -, +)
 * @param {string} secondOperand - 두 번째 피연산자
 * @returns {number} 계산 결과
 * @throws {Error} 0으로 나누거나 알 수 없는 연산자일 경우
 */
const calculate = (firstOperand, operator, secondOperand) => {
  const a = parseFloat(firstOperand);
  const b = parseFloat(secondOperand);
  let result;

  switch (operator) {
    case '/':
      if (b === 0) throw new Error('0으로 나눌 수 없습니다');
      result = a / b;
      break;
    case '*':
      result = a * b;
      break;
    case '-':
      result = a - b;
      break;
    case '+':
      result = a + b;
      break;
    default:
      throw new Error('알 수 없는 연산자');
  }

  if (!isFinite(result)) throw new Error('유효하지 않은 결과');
  lastButton = 'calculate';
  return roundResult(result);
};

const handleOperator = (buttonEl) => {
  if (lastButton === 'operator') {
    operator = buttonEl.textContent;
    return;
  }

  if (operator && lastButton !== 'calculate') {
    secondOperand = displayResult.textContent;
    const result = calculate(firstOperand, operator, secondOperand);
    displayResult.textContent = result;
    firstOperand = result;
    lastResult = result;
  } else {
    firstOperand = displayResult.textContent;
  }

  operator = buttonEl.textContent;
  isNewInput = true;
  lastButton = 'operator';
};

const handleNumber = (buttonEl) => {
  if (displayResult.textContent === '0' || isNewInput) {
    displayResult.textContent = buttonEl.textContent;
  } else {
    displayResult.textContent += buttonEl.textContent;
  }

  isNewInput = false;
  lastButton = 'number';
};

const handlePoint = (buttonEl) => {
  if (isNewInput) {
    displayResult.textContent = '0.';
    isNewInput = false;
  } else if (!displayResult.textContent.includes('.')) {
    displayResult.textContent += buttonEl.textContent;
  }

  lastButton = 'point';
};

const handleEqualsButton = () => {
  if (lastButton === 'operator') return;
  if (firstOperand === null) return;
  if (!isNewInput) {
    secondOperand = displayResult.textContent;
  }

  const result = calculate(firstOperand, operator, secondOperand);
  displayResult.textContent = result;
  firstOperand = result;
  lastResult = result;
  isNewInput = true;
  lastButton = 'equals';
};

const clear = () => {
  firstOperand = null;
  operator = null;
  lastResult = null;
  displayResult.textContent = '0';
  lastButton = 'clear';
};

const handleSwitchSign = () => {
  displayResult.textContent *= -1;
  lastButton = 'switchSign';
};

const handlePercent = () => {
  const result = (displayResult.textContent /= 100);
  displayResult.textContent = result;
  lastResult = result;
  isNewInput = true;
  lastButton = 'percent';
};

const handleButtonClick = (event) => {
  const buttonEl = event.target;
  const buttonText = buttonEl.textContent;

  const buttonActions = {
    C: clear,
    number: () => handleNumber(buttonEl),
    operator: () => {
      handleOperator(buttonEl);
      logCalculatorState();
    },
    '.': () => handlePoint(buttonEl),
    '±': handleSwitchSign,
    '%': handlePercent,
    '=': () => {
      handleEqualsButton();
      logCalculatorState();
    },
  };

  const buttonType = buttonEl.classList.contains('calculator__button--number')
    ? 'number'
    : buttonEl.classList.contains('calculator__button--operator')
    ? 'operator'
    : buttonText;

  const action = buttonActions[buttonType];
  if (action) {
    action();
  }
};

/**
 * 현재 계산기의 상태를 콘솔에 로그로 출력한다.
 */
const logCalculatorState = () => {
  console.log(
    `firstOperand: ${firstOperand}, operator: ${operator}, secondOperand: ${secondOperand}, lastResult: ${lastResult}`
  );
};

// 이벤트 리스너 등록
buttons.forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});
