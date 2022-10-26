
function cl(value) {
  console.log(value)
}


const newGrid = (size) => {
  //empty arr row
  let arr = new Array(size);
  //empty arr.'s
  for (let i = 0; i < size; i++) {
    arr[i] = new Array(size);
  }
  //filling by zero
  for (let i = 0; i < 9; i++) {
    for (let k = 0; k < 9; k++) {
      arr[i][k] = CONSTANT.UNASSIGNED;
    }
  }
  return arr;
}
//shuffle arr
const shuffleArray = (arr) => {
  let curr_index = arr.length;
  while (curr_index !== 0) {
    let rand_index = Math.floor(Math.random() * curr_index);
    curr_index -= 1;
    let temp = arr[curr_index];
    arr[curr_index] = arr[rand_index];
    arr[rand_index] = temp;
  }
  return arr;
}

// check puzzle is complete
const isFullGrid = (grid) => {
  return grid.every((row, i) => {
    return row.every((value, j) => {
      return value !== CONSTANT.UNASSIGNED;
    });
  });
}

const findUnassignedPos = (grid, pos) => {
  for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
    for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
      if (grid[row][col] === CONSTANT.UNASSIGNED) {
        pos.row = row;
        pos.col = col;
        return true;
      }
    }
  }
  return false;
}



// check duplicate number in col
const isColSafe = (grid, col, value) => {
  for (let row = 0; row < CONSTANT.GRID_SIZE; row++) {
    if (grid[row][col] === value) return false;
  }
  return true;
}
// check duplicate number in row
const isRowSafe = (grid, row, value) => {
  for (let col = 0; col < CONSTANT.GRID_SIZE; col++) {
    if (grid[row][col] === value) return false;
  }
  return true;
}
// check duplicate number in 3x3 box
const isBoxSafe = (grid, box_row, box_col, value) => {
  for (let row = 0; row < CONSTANT.BOX_SIZE; row++) {
    for (let col = 0; col < CONSTANT.BOX_SIZE; col++) {
      if (grid[row + box_row][col + box_col] === value) return false;
    }
  }
  return true;
}
// check in row, col and 3x3 box
const isSafe = (grid, row, col, value) => {
  return isColSafe(grid, col, value) && isRowSafe(grid, row, value) && isBoxSafe(grid, row - row % 3, col - col % 3, value) && value !== CONSTANT.UNASSIGNED;
}
const sudokuCreate = (grid) => {
  let unassigned_pos = {
    row: -1,
    col: -1
  }

  if (!findUnassignedPos(grid, unassigned_pos)) return true;

  let number_list = shuffleArray([...CONSTANT.NUMBERS]);

  let row = unassigned_pos.row;
  let col = unassigned_pos.col;

  number_list.forEach((num, i) => {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;

      if (isFullGrid(grid)) {
        return true;
      } else {
        if (sudokuCreate(grid)) {
          return true;
        }
      }

      grid[row][col] = CONSTANT.UNASSIGNED;
    }
  });

  return isFullGrid(grid);
}

const sudokuCheck = (grid) => {
  let unassigned_pos = {
    row: -1,
    col: -1
  }

  if (!findUnassignedPos(grid, unassigned_pos)) return true;

  grid.forEach((row, i) => {
    row.forEach((num, j) => {
      if (isSafe(grid, i, j, num)) {
        if (isFullGrid(grid)) {
          return true;
        } else {
          if (sudokuCreate(grid)) {
            return true;
          }
        }
      }
    })
  })

  return isFullGrid(grid);
}
const rand = () => Math.floor(Math.random() * CONSTANT.GRID_SIZE);
//make empty cells
const removeCells = (grid, level) => {
  let res = [...grid];
  let attemps = level;
  while (attemps > 0) {
    let row = rand();
    let col = rand();
    while (res[row][col] === 0) {
      row = rand();
      col = rand();
    }
    res[row][col] = CONSTANT.UNASSIGNED;
    attemps--;
  }
  return res;

}
// generate sudoku base on level
const sudokuGen = (level) => {
  let sudoku = newGrid(CONSTANT.GRID_SIZE);
  let check = sudokuCreate(sudoku);
  if (check) {
    let question = removeCells(sudoku, level);
    return {
      original: sudoku,
      question: question
    }
  }
  return undefined;
}

for (let h = 0; h < 9; h++) {
  for (let v = 0; v < 9; v++) {
    let tile = document.createElement('input');
    tile.id = h.toString() + "-" + v.toString();
    if (v == 0 || v == 3 || v == 6) {
      tile.classList.add("vertical_line__left")
    }
    if (v == 2 || v == 5) {
      tile.classList.add("vertical_line__right")
    }
    if (v == 8) {
      tile.classList.add("vertical_line__last-right")
    }
    if (h == 0 || h == 3 || h == 6) {
      tile.classList.add("horizontal_line__top")
    }
    if (h == 2 || h == 5) {
      tile.classList.add("horizontal_line__bottom")
    }
    if (h == 8) {
      tile.classList.add("horizontal_line__last-bottom")
    }
    tile.classList.add("tile");
    document.querySelector(".game_board").append(tile);
  }
}
