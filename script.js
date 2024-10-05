'use strict';

class CalculatorDisplay {
  constructor(element) {
    this.element = element;
    this.value = '0';
    this.init();
  }

  init() {
    this.element.textContent = this.value;
  }

  updateValue(newValue) {
    this.value = newValue;
    this.element.textContent = this.value;
    this.adjustFontSize();
  }

  adjustFontSize() {
    const containerWidth = this.element.parentElement.offsetWidth;
    const displayStyle = getComputedStyle(this.element);
    const displayPadding = parseFloat(displayStyle.paddingLeft) + parseFloat(displayStyle.paddingRight);
    const textWidth = this.element.scrollWidth + displayPadding;
    const ratio = containerWidth / textWidth;
    const initialFontSize = 40;
    const currentFontSize = parseFloat(window.getComputedStyle(this.element).fontSize);

    if (textWidth > containerWidth) {
      const newFontSize = Math.floor(currentFontSize * ratio);
      this.element.style.fontSize = `${newFontSize}px`;
    } else if (currentFontSize < initialFontSize) {
      const newFontSize = Math.min(initialFontSize, Math.floor(currentFontSize * ratio));
      this.element.style.fontSize = `${newFontSize}px`;
    }
  }

  clear() {
    this.updateValue('0');
  }

  appendDigit(digit) {
    const newValue = this.value === '0' ? digit : this.value + digit;
    this.updateValue(newValue);
  }

  setError(message) {
    this.element.textContent = message;
    this.element.style.color = 'red';
  }

  resetError() {
    this.element.style.color = '';
  }
}

class CalculatorButton {
  constructor(value, type, onClick) {
    this.value = value;
    this.type = type;
    this.onClick = onClick;
    this.init();
  }

  init() {
    this.element = document.createElement('button');
    this.element.className = `calculator__button calculator__button--${this.type}`;
    this.element.textContent = this.value;
    this.element.addEventListener('click', () => this.onClick(this.value));
  }

  render(container) {
    container.appendChild(this.element);
  }
}

class Calculator {
  constructor(displayElement) {
    this.display = new CalculatorDisplay(displayElement);
    this.currentValue = '0';
    this.previousValue = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
  }

  inputDigit(digit) {
    if (this.waitingForSecondOperand) {
      this.currentValue = digit;
      this.waitingForSecondOperand = false;
    } else {
      this.currentValue = this.currentValue === '0' ? digit : this.currentValue + digit;
    }
    this.updateDisplay();
  }

  inputDecimal() {
    if (this.waitingForSecondOperand) {
      this.currentValue = '0.';
      this.waitingForSecondOperand = false;
    } else if (!this.currentValue.includes('.')) {
      this.currentValue += '.';
    }
    this.updateDisplay();
  }

  handleOperator(nextOperator) {
    const inputValue = parseFloat(this.currentValue);

    if (this.operator && this.waitingForSecondOperand) {
      this.operator = nextOperator;
      return;
    }

    if (this.previousValue === null && !isNaN(inputValue)) {
      this.previousValue = inputValue;
    } else if (this.operator) {
      const result = this.calculate(this.previousValue, inputValue, this.operator);
      this.currentValue = `${parseFloat(result.toFixed(10))}`;
      this.previousValue = result;
    }

    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
    this.updateDisplay();
  }

  calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        if (secondOperand === 0) {
          this.display.setError('Error');
          return 0;
        }
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  }

  clear() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
    this.updateDisplay();
    this.display.resetError();
  }

  updateDisplay() {
    this.display.updateValue(this.currentValue);
  }

  handleEqual() {
    if (this.operator && !this.waitingForSecondOperand) {
      const inputValue = parseFloat(this.currentValue);
      const result = this.calculate(this.previousValue, inputValue, this.operator);
      this.currentValue = `${parseFloat(result.toFixed(10))}`;
      this.previousValue = null;
      this.operator = null;
      this.waitingForSecondOperand = true;
      this.updateDisplay();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const displayElement = document.querySelector('.calculator__display');
  const buttonContainer = document.querySelector('.calculator__buttons');
  const calculator = new Calculator(displayElement);

  const handleButtonClick = (value) => {
    switch (value) {
      case '+':
      case '-':
      case '*':
      case '/':
        calculator.handleOperator(value);
        break;
      case '=':
        calculator.handleEqual();
        break;
      case 'C':
        calculator.clear();
        break;
      case '.':
        calculator.inputDecimal();
        break;
      default:
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          calculator.inputDigit(value);
        }
        break;
    }
  };

  const buttonData = [
    { value: 'C', type: 'function' },
    { value: '±', type: 'function' },
    { value: '%', type: 'function' },
    { value: '/', type: 'operator' },
    { value: '7', type: 'number' },
    { value: '8', type: 'number' },
    { value: '9', type: 'number' },
    { value: '*', type: 'operator' },
    { value: '4', type: 'number' },
    { value: '5', type: 'number' },
    { value: '6', type: 'number' },
    { value: '-', type: 'operator' },
    { value: '1', type: 'number' },
    { value: '2', type: 'number' },
    { value: '3', type: 'number' },
    { value: '+', type: 'operator' },
    { value: '0', type: 'number-zero' },
    { value: '.', type: 'point' },
    { value: '=', type: 'operator' },
  ];

  buttonData.forEach((button) => {
    const calculatorButton = new CalculatorButton(button.value, button.type, handleButtonClick);
    calculatorButton.render(buttonContainer);
  });
});
