$(() => {
  colNum = 10;
  rowNum = 10;
  catNum = 10;

  const hiddenCat = (minecat) => {
    let colCat, rowCat;
    do {
      colCat = Math.floor(Math.random() * colNum);
      rowCat = Math.floor(Math.random() * rowNum);
    } while (minecat[colCat][rowCat] === true);

    minecat[colCat][rowCat] = true;
    return true;
  };

  const board = [];
  for (let i = 0; i < colNum; i++) {
    board[i] = [];
    for (let j = 0; j < rowNum; j++) {
      board[i][j] = false;
    }
  }

  for (let k = 0; k < catNum; k++) {
    hiddenCat(board);
  }

  let gameOver = false;

  const init = () => {
    const container = $(".board");
    for (let i = 0; i < colNum; i++) {
      for (let j = 0; j < rowNum; j++) {
        const cellClass = $("<div class='board-cell'>");
        container.append(cellClass);

        board[i][j] = {
          hasCat: board[i][j],
          revealed: false,
          $el: cellClass,
        };
        cellClass.on("pointerdown", () => {
          if (gameOver) {
            return;
          }
          reveal(i, j);
        });
      }
    }
  };

  update = () => {
    for (let i = 0; i < colNum; i++) {
      for (let j = 0; j < rowNum; j++) {
        const cell = board[i][j];
        if (cell.revealed) {
          cell.$el.css("background-color", "yellow");
        }
      }
    }
  };

  let firstClick = true;

  const reveal = (x, y) => {
    let cell = board[x][y];

    if (firstClick) {
      firstClick = false;
      if (cell.hasCat) {
        for (let i = 0; i < colNum; i++) {
          for (let j = 0; j < rowNum; j++) {
            board[i][j].hasCat = false;
          }
        }
        for (let k = 0; k < catNum; k++) {
          hiddenCat(board);
        }
      }
    }

    if (cell.revealed) return;

    if (cell.hasCat) {
      gameOver = true;
      cell.$el.css("background-color", "blue");
      return;
    }

    cell.revealed = true;

    let catCount = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const ni = x + dx;
        const nj = y + dy;
        if (ni >= 0 && ni < 10 && nj >= 0 && nj < 10 && board[ni][nj].hasCat) {
          catCount++;
        }
      }
    }

    if (catCount > 0) {
      cell.$el.text(catCount);
    } else {
      cell.$el.text(" ");
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const ni = x + dx;
          const nj = y + dy;
          if (
            ni >= 0 &&
            ni < 10 &&
            nj >= 0 &&
            nj < 10 &&
            (dx !== 0 || dy !== 0)
          ) {
            reveal(ni, nj);
          }
        }
      }
    }
    update();
  };

  const foodBox = () => {
    const foodContainer = $(".food-container");
    for (let i = 0; i < catNum; i++) {
      const foodBox = "<div class='food-box'>";
      foodContainer.append(foodBox);
    }
  };

  window.onload = () => {
    init();
    foodBox();
  };
});
