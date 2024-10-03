'use strict';

// TODO: 디스플레이 인풋 클릭 시 내용 복사되고 알림 팝업 뜨는 기능 추가
// TODO: 현재는 사용되지 않는 .calculator__header 및 .calculator__header-button에 대한 처리 (기능 추가 또는 UI 삭제)
// TODO: 필수적으로 사용하지 않는 변수 (lastResult, lastButton, isNewInput) 제거 및 리팩토링

// DOM 요소 선택
const display = document.querySelector('.calculator__display');
const buttons = document.querySelectorAll('.calculator__button');
const pop = document.querySelector('.pop');

// 계산기 상태 변수
const calcState = {
  firstOperand: null,
  operator: null,
  secondOperand: null,
  lastResult: null,
  lastButton: null,
  isNewInput: false,
};

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
const calculate = (firstOperand, secondOperand, operator) => {
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
  return roundResult(result);
};

const handleOperator = (buttonEl) => {
  if (
    calcState.lastButton === 'operator' ||
    calcState.lastButton === 'switchSign' ||
    calcState.lastButton === 'percent'
  ) {
    calcState.operator = buttonEl.textContent;
    return;
  }

  if (calcState.operator && calcState.lastButton !== 'equals') {
    calcState.secondOperand = display.textContent;
    const result = calculate(calcState.firstOperand, calcState.secondOperand, calcState.operator);
    display.textContent = result;
    calcState.firstOperand = result;
    calcState.lastResult = result;
  } else {
    calcState.firstOperand = display.textContent;
  }

  calcState.operator = buttonEl.textContent;
  calcState.isNewInput = true;
  calcState.lastButton = 'operator';
};

const handleNumber = (buttonEl) => {
  if (display.textContent === '0' || calcState.isNewInput) {
    display.textContent = buttonEl.textContent;
  } else {
    display.textContent += buttonEl.textContent;
  }

  calcState.isNewInput = false;
  calcState.lastButton = 'number';
};

const handlePoint = (buttonEl) => {
  if (calcState.isNewInput) {
    display.textContent = '0.';
    calcState.isNewInput = false;
  } else if (!display.textContent.includes('.')) {
    display.textContent += buttonEl.textContent;
  }

  calcState.lastButton = 'point';
};

const handleEqualsButton = () => {
  if (calcState.lastButton === 'operator' || calcState.firstOperand === null) return;
  if (!calcState.isNewInput) {
    calcState.secondOperand = display.textContent;
  }

  const result = calculate(calcState.firstOperand, calcState.secondOperand, calcState.operator);
  display.textContent = result;
  calcState.firstOperand = result;
  calcState.lastResult = result;
  calcState.isNewInput = true;
  calcState.lastButton = 'equals';
};

const clear = () => {
  calcState.firstOperand = null;
  calcState.operator = null;
  calcState.lastResult = null;
  display.textContent = '0';
  calcState.lastButton = 'clear';
};

const handleSwitchSign = () => {
  const result = display.textContent * -1;
  display.textContent = result;
  calcState.firstOperand = result;
  calcState.lastButton = 'switchSign';
  calcState.isNewInput = true;
};

const handlePercent = () => {
  const result = roundResult(display.textContent / 100);
  display.textContent = result;
  calcState.firstOperand = result;
  calcState.lastResult = result;
  calcState.isNewInput = true;
  calcState.lastButton = 'percent';
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

  adjustFontSize();
};

const adjustFontSize = () => {
  const containerWidth = document.querySelector('.calculator__display-container').offsetWidth;
  const displayStyle = getComputedStyle(display);
  const displayPadding = parseFloat(displayStyle.paddingLeft) + parseFloat(displayStyle.paddingRight);
  const textWidth = display.scrollWidth + displayPadding;
  const ratio = containerWidth / textWidth;
  const initialFontSize = 40;
  const currentFontSize = parseFloat(window.getComputedStyle(display).fontSize);

  if (textWidth > containerWidth) {
    const newFontSize = Math.floor(currentFontSize * ratio);
    display.style.fontSize = `${newFontSize}px`;
  } else if (currentFontSize < initialFontSize) {
    const newFontSize = Math.min(initialFontSize, Math.floor(currentFontSize * ratio));
    display.style.fontSize = `${newFontSize}px`;
  }
};

/**
 * 현재 계산기의 상태를 콘솔에 로그로 출력한다.
 */
const logCalculatorState = () => {
  console.log(
    `firstOperand: ${calcState.firstOperand}\nsecondOperand: ${calcState.secondOperand}\noperator: ${calcState.operator}`
  );
};

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(display.textContent);

    pop.style.bottom = '40px';
    pop.style.opacity = 1;

    setTimeout(() => {
      pop.style.bottom = '-1000px';
      pop.style.opacity = 0;
    }, 2000);
  } catch (err) {
    console.error('클립보드 복사 실패:', err);
  }
};

// 이벤트 리스너 등록
buttons.forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});
display.addEventListener('click', handleCopy);
