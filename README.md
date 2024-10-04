# JavaScript 계산기 프로그램

웹 기반의 기본 계산기 애플리케이션입니다.
HTML, CSS, JavaScript를 사용하여 구현되었습니다.

![calculator_v2](https://github.com/user-attachments/assets/84047004-24f1-484e-88b8-80f976b56c64)


## 주요 기능

- 기본 수학 연산 (덧셈, 뺄셈, 곱셈, 나눗셈)
- 소수점 연산 지원
- 퍼센트 계산
- 부호 변경 (+/-)
- 동적 폰트 크기 조절 (긴 숫자 입력 시 자동 조절)
- 에러 처리 (0으로 나누기 등)
- 연속 계산 지원

## 주요 함수

### `calculate(firstOperand, secondOperand, operator)`
두 피연산자에 대해 지정된 연산을 수행합니다.

### `roundResult(num)`
부동소수점 연산의 정밀도 문제를 해결하기 위해 결과값을 반올림합니다.

### `handleButtonClick(event)`
버튼 클릭 이벤트를 처리하고 클릭한 버튼에 따라 적절한 동작을 수행합니다.

### `adjustFontSize()`
계산기 디스플레이의 텍스트 크기를 동적으로 조절합니다.

## 개발 노트

- 'use strict' 모드를 사용하여 코드의 안정성을 높였습니다.
- 부동소수점 연산의 정밀도 문제를 관리하기 위해 `roundResult` 함수를 사용했습니다.
- 긴 숫자 입력 시 가독성을 위해 폰트 크기를 자동으로 조절하는 기능을 구현했습니다.
- 객체를 사용한 룩업 테이블 방식으로 버튼 액션을 처리하여 코드의 가독성과 유지보수성을 향상시켰습니다.

## 향후 개선 사항

- 현재는 사용되지 않는 `.calculator__header` 및 `.calculator__header-button`에 대한 처리
- 필수적으로 사용하지 않는 변수 (lastResult, lastButton, isNewInput) 제거 및 리팩토링
