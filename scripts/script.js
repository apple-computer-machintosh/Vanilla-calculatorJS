// スクロールを禁止する
document.body.addEventListener('touchmove', function (e) {
  e.preventDefault();
}, { passive: false });


// ボタンをタップしたとにリップアニメーションを追加
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', function (event) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;

    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    this.appendChild(ripple);

    ripple.addEventListener('animationend', () => {
      ripple.remove(); // アニメーション終了後に要素を削除
    });
  });
});


// 文字の選択を禁止
document.onselectstart = () => false;

class Calculator {
  constructor() {
    this.expression = ''; // 全ての表現を格納
    this.result = '';
  }

  inputNumber(number) {
    this.expression += number.toString();
  }

  inputOperator(operator) {
    if (this.expression === '') return;
    if (['+', '-', '*', '/'].includes(this.expression.slice(-1))) return; // 最後の文字が演算子なら何もしない
    this.expression += operator;
  }

  calculate() {
    try {
      // eval() を使用するときは注意してください!  生産環境では、より安全な式解析器を使用することをお勧めします。
      this.result = eval(this.expression);
      this.expression += '='; // 表示のために '=' を追加
    } catch (error) {
      this.result = 'エラー';
    }
  }

  clear() {
    this.expression = '';
    this.result = '';
  }

  getDisplay() {
    return this.result !== '' ? this.result : this.expression; // 結果を表示または表現を表示
  }
}

const calc = new Calculator();
document.addEventListener("keydown", (event) => {
  handleKeyDown(event);
});

function handleButtonClick(value) {
  if (['+', '-', '*', '/'].includes(value)) {
    calc.inputOperator(value);
  } else if (value === '=') {
    calc.calculate();
  } else if (value === 'AC') {
    clearDisplay();
  } else if (value === 'result') {
    navigator.clipboard.writeText(calc.getDisplay());
    alert('結果をクリップボードにコピーしました');
  } else if (value === 'del') {
    calc.expression = calc.expression.slice(0, -1);
  } else {
    calc.inputNumber(value);
  }
  updateDisplay();
}

function handleKeyDown(e) {
  if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/'].includes(e.key)) {
    handleButtonClick(e.key);
  } else if (e.key === 'Enter') {
    handleButtonClick('=');
  } else if (e.key === 'Backspace') {
    calc.expression = calc.expression.slice(0, -1); //最後の文字を削除
    updateDisplay();
  } else if (e.key === 'Escape') {
    clearDisplay();
  }
}

function updateDisplay() {
  const displayValue = calc.getDisplay();
  document.getElementById('display').textContent = displayValue === '' ? '0' : displayValue;
}

function clearDisplay() {
  calc.clear();
  updateDisplay();
}

updateDisplay();
