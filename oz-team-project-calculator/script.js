'use strict';

// DOM 요소 선택
const displayInput = document.querySelector('.calculator__result-input');
const buttons = document.querySelectorAll('.calculator__button');

// 계산기 상태 변수
let firstOperand = null;
let secondOperand = null;
let operator = null;
let lastResult = null;
let isNewInput = false;

/**
 * 숫자를 소수점 이하 10자리까지 반올림한다.
 * 부동소수점 연산의 정밀도 문제를 완화하는 데 사용된다.
 * @param {number} num - 반올림할 숫자
 * @returns {number} 소수점 이하 10자리까지 반올림된 숫자
 */
const roundResult = (num) => {
  return Math.round(num * 1e10) / 1e10;
};

/**
 * 두 숫자에 대해 지정된 연산을 수행한다.
 * @param {string} firstOperand - 첫 번째 피연산자
 * @param {string} operator - 연산자 (/, *, -, +)
 * @param {string} secondOperand - 두 번째 피연산자
 * @returns {string} 계산 결과 또는 에러 메시지
 */
const calculate = (firstOperand, operator, secondOperand) => {
  let result;
  const a = parseFloat(firstOperand);
  const b = parseFloat(secondOperand);
  switch (operator) {
    case '/':
      if (b === 0) return 'Error: 0으로 나눌 수 없습니다';
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
  if (!isFinite(result)) return 'Error: 유효하지 않은 결과';

  isNewInput = true;
  lastResult = roundResult(result);
  return roundResult(result);
};

const handleOperator = (buttonEl) => {
  if (lastResult === null) {
    firstOperand = displayInput.value;
  } else if (firstOperand === lastResult) {
    secondOperand = displayInput.value;
    displayInput.value = calculate(firstOperand, operator, secondOperand);
    firstOperand = displayInput.value;
    lastResult = displayInput.value;
  } else {
    firstOperand = lastResult;
  }
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
  firstOperand = null;
  secondOperand = null;
  operator = null;
  lastResult = null;
  displayInput.value = '0';
};

/**
 * 버튼 클릭 이벤트 핸들러
 * @param {Event} event - 클릭 이벤트 객체
 */
const handleButtonClick = (event) => {
  const buttonEl = event.target;

  // 버튼 종류에 따라 적절한 동작 수행
  if (buttonEl.classList.contains('calculator__button--number')) {
    handleNumber(buttonEl);
  } else if (buttonEl.classList.contains('calculator__button--operator')) {
    handleOperator(buttonEl);
  } else if (buttonEl.textContent === '=') {
    if (firstOperand) displayInput.value = calculate(firstOperand, operator, displayInput.value);
  } else if (buttonEl.textContent === '.') {
    handlePoint(buttonEl);
  } else if (buttonEl.textContent === 'C') {
    clear();
  }
};

// 이벤트 리스너 등록
buttons.forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});
