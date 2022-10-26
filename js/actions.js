// add class to level choose
const radio = document.querySelectorAll('.level_choose');
const label = document.querySelectorAll('.level_label');
const button = document.querySelector('#start_button');
const menu = document.querySelector('.main_menu');
const winCaption = document.querySelector('.win_caption');
const winH = document.querySelector('h2')
const title = document.querySelector('h1')
const tryAgainButton = document.querySelector('#try_again_button');
const startNewButton = document.querySelector('#start_new_button');
const buttonsWrapper = document.querySelector('.game_button_wrapper')
const cells = document.querySelectorAll('.tile');

const su = JSON.parse(JSON.stringify(sudokuGen()));

let suFull = su.original;
let suQuestion = su.question;
let suAnswer = {};
let levelElement = [];
let level = null;
let levelIndex = 45;

let position = null;
let row = null;
let col = null;
let answer = null;
let positionObj = {};
let textVisible = winH.setAttribute('style', 'visibility: visible');

function winInvisible() {
  winH.setAttribute('style', 'visibility: hidden');
}
function winVisible() {
  winH.setAttribute('style', 'visibility: visible');
}
function clearUnfilledCell(el) {
  if (el.classList.contains('unfilled')) {
    return el.value = '';
  }
};

for (let i = 0; i < radio.length; i++) {
  radio[i].addEventListener('change', function () {
    radio.forEach(el => {
      el.classList.remove('checked');
    })
    label.forEach(el => {
      el.classList.remove('label_changing');
    })
    let addedLabelArr = [];
    addedLabelArr.push(label[i]);
    addedLabelArr.slice(addedLabelArr.length - 2, addedLabelArr.length - 1);
    addedLabelArr[0].classList.add('label_changing');

    let addedArr = [];
    addedArr.push(this);
    addedArr.slice(addedArr.length - 2, addedArr.length - 1);
    addedArr[0].classList.add('checked');

    levelElement.push(addedArr[0]);
    levelElement.slice(levelElement.length - 2, levelElement.length - 1);
    levelElement = addedArr;
    level = levelElement[0].id

    if (level == 'level_easy') {
      levelIndex = CONSTANT.LEVEL[0]
    }
    else if (level == 'level_medium') {
      levelIndex = CONSTANT.LEVEL[1]
    }
    else if (level == 'level_hard') {
      levelIndex = CONSTANT.LEVEL[2]
    }
  })
}
const initSudoku = () => {
  removeCells(su.question, levelIndex);
  // show sudoku to input
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE);
    let col = i % CONSTANT.GRID_SIZE;

    if (su.question[row][col] !== 0) {
      cells[i].setAttribute('value', su.question[row][col]);
      cells[i].classList.add('filled');
      cells[i].innerHTML = su.question[row][col];
      cells[i].disabled = true;
    } else {
      cells[i].classList.add('unfilled');
    }
  }
}

function findTrueAnswer(obj) {
  row = obj.ROW;
  col = obj.COL;
  answer = suFull[row][col];
  return answer
}
const valuesComparison = () => {
  positionObj.VALUE = positionObj.ELEMENT.value;
  let trueAnswer = findTrueAnswer(positionObj);
  if (positionObj.VALUE == trueAnswer || positionObj.VALUE == '') {
    return true;
  } else return false;
}
const boxComparison = (row, col) => {
  let box_start_row = row - row % 3;
  let box_start_col = col - col % 3;

  for (let i = 0; i < CONSTANT.BOX_SIZE; i++) {
    for (let j = 0; j < CONSTANT.BOX_SIZE; j++) {
      let cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
      cell.classList.add('separated-box');
    }
  }
}
//active cells position detection
//return Arr[element(input), row, col]
const activeCellsData = () => {
  cells.forEach(el => {
    el.addEventListener("focus", () => {
      positionObj = {};
      position = el;
      positionObj.ELEMENT = el;
      positionObj.ROW = position.id[0];
      positionObj.COL = position.id[2];
      boxComparison(positionObj.ROW, positionObj.COL)
      cells.forEach(element => {

        if (positionObj.ROW == element.id[0]) {
          element.classList.add('separated-row')
        }
        if (positionObj.COL == element.id[2]) {
          element.classList.add('separated-col')
        }
      })
    })
    el.addEventListener("blur", () => {
      cells.forEach(element => {
        element.classList.remove('separated-row');
        element.classList.remove('separated-col');
        element.classList.remove('separated-box');
        true
      })
    });
    el.addEventListener("keyup", () => {

      if (!valuesComparison()) {
        el.classList.add('error')
      }
      else {
        el.classList.remove('error')
      }
      isWin();
    })
    return positionObj;
  })
}

function isWin() {
  let AnswerArrSumm = 0;
  for (let i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++) {
    let row = Math.floor(i / CONSTANT.GRID_SIZE);
    let col = i % CONSTANT.GRID_SIZE;
    let AnswerArr = [];
    if (cells[i].value == suFull[row][col]) {
      ++AnswerArrSumm;
    }
    if (AnswerArrSumm == 81) {
      winCaption.style.display = 'flex';
      setInterval(winInvisible, 750)
      setInterval(winVisible, 1500)
    }
  }

}

button.addEventListener('click', () => {
  menu.style.display = 'none'
  buttonsWrapper.style.display = 'flex'
  initSudoku();
  activeCellsData();
  title.style.display = 'none'
});
tryAgainButton.addEventListener('click', () => {
  cells.forEach(el => {
    clearUnfilledCell(el);
    el.classList.remove('error')
  })
  winCaption.style.display = 'none'
})
startNewButton.addEventListener('click', () => {
  location.reload();
})