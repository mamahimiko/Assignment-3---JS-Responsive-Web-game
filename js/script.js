$(() => {
  colNum = 10;
  rowNum = 10;
  catNum = 10;

  const food = "\u{1F36C}";
  const badCat = "\u{1F63A}";
  const loughCat = "\u{1F639}";
  const heartCat = "\u{1F63B}";

  let correctFoodCount = 0;
  let numberOfWin = 0;
  let numberOfLose = 0;

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
    container.empty();
    gameOver = false;
    firstClick = true;
    correctFoodCount = 0;
    if ($("result.show")) {
      $(".result.show").text("").removeClass("show");
    }

    for (let i = 0; i < colNum; i++) {
      for (let j = 0; j < rowNum; j++) {
        board[i][j] = false;
      }
    }

    for (let k = 0; k < catNum; k++) {
      hiddenCat(board);
    }

    for (let i = 0; i < colNum; i++) {
      for (let j = 0; j < rowNum; j++) {
        const cellClass = $("<div class='board-cell'>");
        container.append(cellClass);

        board[i][j] = {
          hasCat: board[i][j],
          revealed: false,
          hasFood: false,
          $el: cellClass,
        };
        cellClass.on("pointerdown", () => {
          if (gameOver) {
            return;
          }

          const cell = board[i][j];

          if (cell.hasFood) {
            pickUpFood(i, j);
          } else if ($(".food-box.active").length > 0) {
            feed(i, j);
          } else {
            reveal(i, j);
          }
        });
      }
    }
  };

  $("button").on("click", () => {
    init(), foodBox();
  });

  update = () => {
    for (let i = 0; i < colNum; i++) {
      for (let j = 0; j < rowNum; j++) {
        const cell = board[i][j];
        if (cell.revealed) {
          cell.$el.addClass("revealed");
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
      cell.$el.css("background-color", "red");
      cell.$el.text(`${badCat}`);
      loseGame();
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

  const feed = (i, j) => {
    const cell = board[i][j];
    if (cell.revealed || cell.hasFood) {
      return;
    }

    const activeFood = $(".food-box.active").first();
    if (activeFood.length === 0) return;

    cell.hasFood = true;
    const currentText = cell.$el.text();
    cell.$el.text(currentText === food ? "" : food);

    if (cell.hasCat) {
      correctFoodCount++;
      cell.$el.addClass("correct-feed");
    } else {
      cell.$el.addClass("wrong-feed");
    }

    activeFood.text("").removeClass("active").addClass("used");

    if (correctFoodCount === catNum) {
      winGame();
    }

    update();
  };

  const foodBox = () => {
    const foodContainer = $(".food-container");
    foodContainer.empty();

    for (let i = 0; i < catNum; i++) {
      const foodBox = $(`<div class='food-box box-${i + 1}'>${food}</div>`);
      foodContainer.append(foodBox);
    }

    $(".food-box").on("click", function () {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
      } else {
        $(".food-box").removeClass("active");
        $(this).addClass("active");
      }
    });
  };

  const pickUpFood = (i, j) => {
    const cell = board[i][j];
    if (!cell.hasFood) {
      return;
    }

    if (cell.hasCat) {
      correctFoodCount--;
    }

    cell.hasFood = false;
    cell.$el.text("");
    cell.$el.removeClass("correct-feed wrong-feed");

    const usedBox = $(".food-box.used").first();
    if (usedBox.length > 0) {
      usedBox.text(food).removeClass("used");
    }

    update();
  };

  const upDateScoreBoard = () => {
    $(".win-count").text(numberOfWin);
    $(".lose-count").text(numberOfLose);
  };

  const winGame = () => {
    gameOver = true;
    numberOfWin++;
    upDateScoreBoard();
    for (let i = 0; i < colNum; i++) {
      for (let j = 0; j < rowNum; j++) {
        const cell = board[i][j];
        if (cell.hasCat) {
          cell.$el.text(heartCat);
          cell.$el.addClass("win");
        }
      }
    }
    const winMessage = $(".result");
    winMessage.text("You win!").addClass("show");
    winMessage.append(
      '<p class="message">The cats who ate the sweet candy are completely smitten with you! And the streets are all sparkling clean too!</p>'
    );
  };

  const loseGame = () => {
    numberOfLose++;
    upDateScoreBoard();
    for (let i = 0; i < colNum; i++) {
      for (let j = 0; j < rowNum; j++) {
        const cell = board[i][j];
        if (cell.hasCat) {
          cell.$el.text(`${loughCat}`);
          cell.$el.addClass("lose");
        }
      }
    }

    const loseMessage = $(".result");
    loseMessage.text("You lose...").addClass("show");
    loseMessage.append(
      '<p class="message">Boo! The naughty cats are rolling with laughter at your shocked face! The humiliation is real!</p>'
    );

    update();
  };

  window.init = init;

  window.onload = () => {
    init();
    foodBox();
  };
});
