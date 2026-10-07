
"use strict";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const cells =
    document.querySelectorAll(".cell");

const board =
    document.querySelector("#board");

const turnText =
    document.querySelector("#turnText");

const restartButton =
    document.querySelector("#restart");

const message =
    document.querySelector("#message");

const scoreXElement =
    document.querySelector("#scoreX");

const scoreOElement =
    document.querySelector("#scoreO");

const scoreDrawElement =
    document.querySelector("#scoreDraw");

const winLine =
    document.querySelector("#winLine");

const xCard =
    document.querySelector(".x-card");

const oCard =
    document.querySelector(".o-card");

const scoreboard =
    document.querySelector(".scoreboard");


/* =========================================================
   GAME SETTINGS
========================================================= */

let gameMode = "pvp";

/*
    Difficulty:

    easy
    medium
    hard
*/

let difficulty = "medium";


/* =========================================================
   GAME STATE
========================================================= */

let gameBoard =
    Array(9).fill("");

let currentPlayer =
    "X";

let gameOver =
    false;

let computerThinking =
    false;


/* =========================================================
   PLAYERS
========================================================= */

const humanPlayer =
    "X";

const computerPlayer =
    "O";


/* =========================================================
   SCORE
========================================================= */

let scoreX = 0;

let scoreO = 0;

let scoreDraw = 0;


/* =========================================================
   WINNING COMBINATIONS
========================================================= */

const winningCombinations = [

    /* Horizontal */
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    /* Vertical */
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    /* Diagonal */
    [0, 4, 8],
    [2, 4, 6]

];


/* =========================================================
   CREATE MODE CONTROLS
========================================================= */

function createModeControls() {

    if (
        document.querySelector(".game-controls")
    ) {
        return;
    }


    const container =
        document.createElement("div");


    container.className =
        "game-controls";


    container.innerHTML = `

        <div class="game-mode">

            <button
                type="button"
                class="game-control is-active"
                data-mode="pvp"
            >
                2 PLAYERS
            </button>

            <button
                type="button"
                class="game-control"
                data-mode="computer"
            >
                VS COMPUTER
            </button>

        </div>


        <div
            class="difficulty"
            data-difficulty-container
            hidden
        >

            <button
                type="button"
                class="difficulty-button"
                data-difficulty="easy"
            >
                EASY
            </button>

            <button
                type="button"
                class="difficulty-button is-active"
                data-difficulty="medium"
            >
                MEDIUM
            </button>

            <button
                type="button"
                class="difficulty-button"
                data-difficulty="hard"
            >
                HARD
            </button>

        </div>

    `;


    if (scoreboard) {

        scoreboard.after(
            container
        );

    } else if (board) {

        board.before(
            container
        );

    }


    /* Mode buttons */

    const modeButtons =
        container.querySelectorAll(
            "[data-mode]"
        );


    modeButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    setGameMode(
                        button.dataset.mode
                    );

                }
            );

        }
    );


    /* Difficulty buttons */

    const difficultyButtons =
        container.querySelectorAll(
            "[data-difficulty]"
        );


    difficultyButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    setDifficulty(
                        button.dataset.difficulty
                    );

                }
            );

        }
    );

}


/* =========================================================
   CREATE CONTROL STYLES
========================================================= */

function createControlStyles() {

    if (
        document.querySelector(
            "#tic-tac-toe-controls"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "tic-tac-toe-controls";


    style.textContent = `

        .game-controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin: 0 auto 24px;
        }


        .game-mode,
        .difficulty {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            padding: 5px;
            border: 1px solid rgba(255,255,255,.09);
            border-radius: 999px;
            background: rgba(255,255,255,.04);
            backdrop-filter: blur(14px);
        }


        .difficulty {
            background: rgba(255,255,255,.025);
        }


        .game-control,
        .difficulty-button {
            border: 0;
            border-radius: 999px;
            padding: 9px 15px;
            color: #8f90a0;
            background: transparent;
            cursor: pointer;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 1.4px;
            transition:
                color .3s ease,
                background .3s ease,
                transform .3s ease,
                box-shadow .3s ease;
        }


        .game-control:hover,
        .difficulty-button:hover {
            color: white;
            transform: translateY(-2px);
        }


        .game-control.is-active,
        .difficulty-button.is-active {
            color: white;
            background:
                linear-gradient(
                    90deg,
                    #8b5cf6,
                    #306cff
                );
            box-shadow:
                0 8px 25px rgba(139,92,246,.25);
        }


        @media (max-width: 500px) {

            .game-mode,
            .difficulty {
                width: 100%;
                max-width: 310px;
            }


            .game-control,
            .difficulty-button {
                flex: 1;
                padding: 9px 7px;
                font-size: 8px;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   GAME MODE
========================================================= */

function setGameMode(mode) {

    if (
        mode !== "pvp" &&
        mode !== "computer"
    ) {
        return;
    }


    gameMode =
        mode;


    resetGame(
        false
    );


    const modeButtons =
        document.querySelectorAll(
            "[data-mode]"
        );


    modeButtons.forEach(
        (button) => {

            button.classList.toggle(
                "is-active",
                button.dataset.mode === mode
            );

        }
    );


    const difficultyContainer =
        document.querySelector(
            "[data-difficulty-container]"
        );


    if (
        difficultyContainer
    ) {

        difficultyContainer.hidden =
            mode !== "computer";

    }


    if (
        mode === "computer"
    ) {

        message.textContent =
            `You are X • ${getDifficultyName()} AI`;

    } else {

        message.textContent =
            "Two players mode";

    }


    setTimeout(
        () => {

            if (!gameOver) {
                message.textContent = "";
            }

        },
        1800
    );

}


/* =========================================================
   DIFFICULTY
========================================================= */

function setDifficulty(level) {

    if (
        ![
            "easy",
            "medium",
            "hard"
        ].includes(level)
    ) {
        return;
    }


    difficulty =
        level;


    const difficultyButtons =
        document.querySelectorAll(
            "[data-difficulty]"
        );


    difficultyButtons.forEach(
        (button) => {

            button.classList.toggle(
                "is-active",
                button.dataset.difficulty === level
            );

        }
    );


    /*
        Restart current round.
    */

    resetGame(
        false
    );


    message.textContent =
        `Difficulty: ${getDifficultyName()}`;


    setTimeout(
        () => {

            if (!gameOver) {
                message.textContent = "";
            }

        },
        1400
    );

}


/* =========================================================
   DIFFICULTY NAME
========================================================= */

function getDifficultyName() {

    if (
        difficulty === "easy"
    ) {
        return "Easy";
    }


    if (
        difficulty === "hard"
    ) {
        return "Hard";
    }


    return "Medium";

}


/* =========================================================
   TURN UI
========================================================= */

function updateTurnUI() {

    if (
        gameMode === "computer"
    ) {

        if (
            currentPlayer === humanPlayer
        ) {

            turnText.textContent =
                "Your turn • X";

        } else {

            turnText.textContent =
                "Computer is thinking...";

        }

    } else {

        turnText.textContent =
            `${currentPlayer}'s turn`;

    }


    turnText.classList.toggle(
        "x-turn",
        currentPlayer === "X"
    );


    turnText.classList.toggle(
        "o-turn",
        currentPlayer === "O"
    );


    if (xCard) {

        xCard.classList.toggle(
            "active",
            currentPlayer === "X"
        );

    }


    if (oCard) {

        oCard.classList.toggle(
            "active",
            currentPlayer === "O"
        );

    }

}


/* =========================================================
   CHECK WINNER
========================================================= */

function checkWinner(
    state = gameBoard
) {

    for (
        let i = 0;
        i < winningCombinations.length;
        i++
    ) {

        const combo =
            winningCombinations[i];


        const [a, b, c] =
            combo;


        if (
            state[a] !== "" &&
            state[a] === state[b] &&
            state[a] === state[c]
        ) {

            return {

                player:
                    state[a],

                combo:
                    combo,

                comboIndex:
                    i

            };

        }

    }


    return null;

}


/* =========================================================
   CHECK DRAW
========================================================= */

function isDraw(
    state = gameBoard
) {

    return state.every(
        (cell) =>
            cell !== ""
    );

}


/* =========================================================
   CREATE MARK
========================================================= */

function createMark(
    player
) {

    const mark =
        document.createElement(
            "span"
        );


    mark.classList.add(
        "mark",
        player.toLowerCase()
    );


    mark.textContent =
        player;


    return mark;

}


/* =========================================================
   PLAYER MOVE
========================================================= */

function handleMove(
    index
) {

    if (
        gameOver ||
        computerThinking
    ) {
        return;
    }


    /*
        In computer mode,
        player controls X only.
    */

    if (
        gameMode === "computer" &&
        currentPlayer !== humanPlayer
    ) {

        return;

    }


    if (
        gameBoard[index] !== ""
    ) {

        return;

    }


    makeMove(
        index,
        currentPlayer
    );


    if (
        gameOver
    ) {

        return;

    }


    if (
        gameMode === "computer" &&
        currentPlayer === computerPlayer
    ) {

        makeComputerMove();

    }

}


/* =========================================================
   MAKE MOVE
========================================================= */

function makeMove(
    index,
    player
) {

    if (
        gameBoard[index] !== ""
    ) {

        return;

    }


    gameBoard[index] =
        player;


    const cell =
        cells[index];


    if (!cell) {
        return;
    }


    cell.classList.add(
        "taken"
    );


    const mark =
        createMark(
            player
        );


    cell.appendChild(
        mark
    );


    cell.animate(
        [
            {
                transform:
                    "scale(.90)"
            },

            {
                transform:
                    "scale(1.06)"
            },

            {
                transform:
                    "scale(1)"
            }

        ],
        {
            duration: 260,
            easing: "ease-out"
        }
    );


    const winner =
        checkWinner();


    if (winner) {

        finishGame(
            winner
        );

        return;

    }


    if (
        isDraw()
    ) {

        finishDraw();

        return;

    }


    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    updateTurnUI();

}


/* =========================================================
   COMPUTER TURN
========================================================= */

function makeComputerMove() {

    if (
        gameOver ||
        gameMode !== "computer" ||
        currentPlayer !== computerPlayer
    ) {

        return;

    }


    computerThinking =
        true;


    updateTurnUI();


    /*
        Different thinking times make
        the computer feel less robotic.
    */

    const thinkingTime =
        400 +
        Math.random() * 500;


    setTimeout(
        () => {

            if (
                gameOver ||
                gameMode !== "computer"
            ) {

                computerThinking =
                    false;

                return;

            }


            const move =
                chooseComputerMove();


            if (
                move !== -1
            ) {

                makeMove(
                    move,
                    computerPlayer
                );

            }


            computerThinking =
                false;


            if (!gameOver) {

                updateTurnUI();

            }

        },
        thinkingTime
    );

}


/* =========================================================
   CHOOSE COMPUTER MOVE
========================================================= */

function chooseComputerMove() {

    /*
        EASY
        Mostly random.
    */

    if (
        difficulty === "easy"
    ) {

        return getRandomMove();

    }


    /*
        MEDIUM
        Mix optimal logic with random moves.
    */

    if (
        difficulty === "medium"
    ) {

        /*
            65% chance of smart move.
        */

        const smartChance =
            Math.random();


        if (
            smartChance < 0.65
        ) {

            return getMediumMove();

        }


        return getRandomMove();

    }


    /*
        HARD
        Fully optimal.
    */

    return getHardMove();

}


/* =========================================================
   RANDOM MOVE
========================================================= */

function getRandomMove() {

    const available =
        getAvailableMoves();


    if (
        available.length === 0
    ) {

        return -1;

    }


    const randomIndex =
        Math.floor(
            Math.random() *
            available.length
        );


    return available[
        randomIndex
    ];

}


/* =========================================================
   MEDIUM MOVE
========================================================= */

function getMediumMove() {

    /*
        First try winning.
    */

    const winningMove =
        findImmediateMove(
            computerPlayer
        );


    if (
        winningMove !== -1
    ) {

        return winningMove;

    }


    /*
        Then block player.
    */

    const blockingMove =
        findImmediateMove(
            humanPlayer
        );


    if (
        blockingMove !== -1
    ) {

        return blockingMove;

    }


    /*
        Prefer center.
    */

    if (
        gameBoard[4] === ""
    ) {

        return 4;

    }


    /*
        Prefer corners.
    */

    const corners =
        [
            0,
            2,
            6,
            8
        ].filter(
            (index) =>
                gameBoard[index] === ""
        );


    if (
        corners.length > 0
    ) {

        return corners[
            Math.floor(
                Math.random() *
                corners.length
            )
        ];

    }


    return getRandomMove();

}


/* =========================================================
   HARD MOVE
========================================================= */

function getHardMove() {

    let bestScore =
        -Infinity;

    let bestMoves = [];


    for (
        let i = 0;
        i < gameBoard.length;
        i++
    ) {

        if (
            gameBoard[i] !== ""
        ) {

            continue;

        }


        gameBoard[i] =
            computerPlayer;


        const score =
            minimax(
                gameBoard,
                false,
                0
            );


        gameBoard[i] =
            "";


        if (
            score > bestScore
        ) {

            bestScore =
                score;

            bestMoves =
                [i];

        } else if (
            score === bestScore
        ) {

            bestMoves.push(
                i
            );

        }

    }


    if (
        bestMoves.length === 0
    ) {

        return -1;

    }


    /*
        If several moves are equally optimal,
        select randomly.
    */

    return bestMoves[
        Math.floor(
            Math.random() *
            bestMoves.length
        )
    ];

}


/* =========================================================
   FIND IMMEDIATE MOVE
========================================================= */

function findImmediateMove(
    player
) {

    for (
        let i = 0;
        i < gameBoard.length;
        i++
    ) {

        if (
            gameBoard[i] !== ""
        ) {

            continue;

        }


        gameBoard[i] =
            player;


        const winner =
            checkWinner();


        gameBoard[i] =
            "";


        if (
            winner &&
            winner.player === player
        ) {

            return i;

        }

    }


    return -1;

}


/* =========================================================
   AVAILABLE MOVES
========================================================= */

function getAvailableMoves(
    state = gameBoard
) {

    const moves = [];


    state.forEach(
        (cell, index) => {

            if (
                cell === ""
            ) {

                moves.push(
                    index
                );

            }

        }
    );


    return moves;

}


/* =========================================================
   MINIMAX
========================================================= */

function minimax(
    state,
    maximizing,
    depth
) {

    const winner =
        checkWinner(
            state
        );


    /*
        Computer wins.
    */

    if (
        winner &&
        winner.player === computerPlayer
    ) {

        return 10 - depth;

    }


    /*
        Human wins.
    */

    if (
        winner &&
        winner.player === humanPlayer
    ) {

        return depth - 10;

    }


    /*
        Draw.
    */

    if (
        isDraw(
            state
        )
    ) {

        return 0;

    }


    /*
        COMPUTER
    */

    if (
        maximizing
    ) {

        let bestScore =
            -Infinity;


        for (
            let i = 0;
            i < state.length;
            i++
        ) {

            if (
                state[i] !== ""
            ) {

                continue;

            }


            state[i] =
                computerPlayer;


            const score =
                minimax(
                    state,
                    false,
                    depth + 1
                );


            state[i] =
                "";


            bestScore =
                Math.max(
                    bestScore,
                    score
                );

        }


        return bestScore;

    }


    /*
        HUMAN
    */

    let bestScore =
        Infinity;


    for (
        let i = 0;
        i < state.length;
        i++
    ) {

        if (
            state[i] !== ""
        ) {

            continue;

        }


        state[i] =
            humanPlayer;


        const score =
            minimax(
                state,
                true,
                depth + 1
            );


        state[i] =
            "";


        bestScore =
            Math.min(
                bestScore,
                score
            );

    }


    return bestScore;

}


/* =========================================================
   DRAW WIN LINE
========================================================= */

function drawWinLine(
    combo,
    animate = true
) {

    if (
        !winLine ||
        !board
    ) {

        return;

    }


    const firstCell =
        cells[
            combo[0]
        ];


    const lastCell =
        cells[
            combo[2]
        ];


    if (
        !firstCell ||
        !lastCell
    ) {

        return;

    }


    const boardRect =
        board.getBoundingClientRect();


    const firstRect =
        firstCell.getBoundingClientRect();


    const lastRect =
        lastCell.getBoundingClientRect();


    const startX =
        firstRect.left +
        firstRect.width / 2 -
        boardRect.left;


    const startY =
        firstRect.top +
        firstRect.height / 2 -
        boardRect.top;


    const endX =
        lastRect.left +
        lastRect.width / 2 -
        boardRect.left;


    const endY =
        lastRect.top +
        lastRect.height / 2 -
        boardRect.top;


    const deltaX =
        endX - startX;


    const deltaY =
        endY - startY;


    const length =
        Math.sqrt(
            deltaX * deltaX +
            deltaY * deltaY
        );


    const angle =
        Math.atan2(
            deltaY,
            deltaX
        ) *
        (180 / Math.PI);


    winLine
        .getAnimations()
        .forEach(
            (animation) =>
                animation.cancel()
        );


    winLine.style.left =
        `${startX}px`;


    winLine.style.top =
        `${startY}px`;


    winLine.style.width =
        `${length}px`;


    winLine.style.opacity =
        "1";


    winLine.classList.remove(
        "show"
    );


    winLine.style.transform =
        `rotate(${angle}deg) scaleX(0)`;


    void winLine.offsetWidth;


    if (
        animate
    ) {

        requestAnimationFrame(
            () => {

                winLine.animate(
                    [
                        {
                            transform:
                                `rotate(${angle}deg) scaleX(0)`
                        },

                        {
                            transform:
                                `rotate(${angle}deg) scaleX(1)`
                        }

                    ],
                    {
                        duration: 550,
                        easing:
                            "cubic-bezier(.2,.8,.2,1)",
                        fill:
                            "forwards"
                    }
                );

            }
        );

    } else {

        winLine.style.transform =
            `rotate(${angle}deg) scaleX(1)`;

    }

}


/* =========================================================
   FINISH GAME
========================================================= */

function finishGame(
    winner
) {

    gameOver =
        true;


    winner.combo.forEach(
        (index) => {

            cells[index].classList.add(
                "winner"
            );

        }
    );


    drawWinLine(
        winner.combo,
        true
    );


    if (
        winner.player === "X"
    ) {

        scoreX++;

    } else {

        scoreO++;

    }


    updateScores();


    if (
        gameMode === "computer"
    ) {

        if (
            winner.player === humanPlayer
        ) {

            turnText.textContent =
                "You win!";

            message.textContent =
                `You defeated the ${getDifficultyName()} computer!`;

        } else {

            turnText.textContent =
                "Computer wins!";

            message.textContent =
                `The ${getDifficultyName()} computer wins!`;

        }

    } else {

        turnText.textContent =
            `${winner.player} wins!`;

        message.textContent =
            `Player ${winner.player} won the round!`;

    }


    turnText.classList.add(
        "win"
    );


    message.classList.add(
        "win"
    );


    board.animate(
        [
            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(1.03)"
            },

            {
                transform:
                    "scale(1)"
            }

        ],
        {
            duration: 650,
            easing:
                "cubic-bezier(.2,.8,.2,1)"
        }
    );


    if (
        winner.player === "X"
    ) {

        animateScore(
            scoreXElement,
            scoreX
        );

    } else {

        animateScore(
            scoreOElement,
            scoreO
        );

    }

}


/* =========================================================
   FINISH DRAW
========================================================= */

function finishDraw() {

    gameOver =
        true;


    scoreDraw++;


    updateScores();


    turnText.textContent =
        "Draw!";


    turnText.classList.add(
        "win"
    );


    message.textContent =
        "Nobody wins this round.";


    message.classList.add(
        "win"
    );


    animateScore(
        scoreDrawElement,
        scoreDraw
    );


    board.animate(
        [
            {
                transform:
                    "rotate(0deg)"
            },

            {
                transform:
                    "rotate(-1deg)"
            },

            {
                transform:
                    "rotate(1deg)"
            },

            {
                transform:
                    "rotate(0deg)"
            }

        ],
        {
            duration: 500,
            easing: "ease-out"
        }
    );

}


/* =========================================================
   UPDATE SCORES
========================================================= */

function updateScores() {

    if (
        scoreXElement
    ) {

        scoreXElement.textContent =
            scoreX;

    }


    if (
        scoreOElement
    ) {

        scoreOElement.textContent =
            scoreO;

    }


    if (
        scoreDrawElement
    ) {

        scoreDrawElement.textContent =
            scoreDraw;

    }

}


/* =========================================================
   SCORE ANIMATION
========================================================= */

function animateScore(
    element,
    value
) {

    if (!element) {
        return;
    }


    element.textContent =
        value;


    element.animate(
        [
            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(1.35)"
            },

            {
                transform:
                    "scale(1)"
            }

        ],
        {
            duration: 400,
            easing: "ease-out"
        }
    );

}


/* =========================================================
   RESET GAME
========================================================= */

function resetGame(
    resetScores = false
) {

    computerThinking =
        false;


    gameBoard =
        Array(9).fill("");


    currentPlayer =
        "X";


    gameOver =
        false;


    if (
        resetScores
    ) {

        scoreX =
            0;

        scoreO =
            0;

        scoreDraw =
            0;

    }


    message.textContent =
        "";


    message.classList.remove(
        "win"
    );


    turnText.classList.remove(
        "win"
    );


    if (
        winLine
    ) {

        winLine
            .getAnimations()
            .forEach(
                (animation) =>
                    animation.cancel()
            );


        winLine.classList.remove(
            "show"
        );


        winLine.style.opacity =
            "0";


        winLine.style.width =
            "0px";


        winLine.style.transform =
            "rotate(0deg) scaleX(0)";

    }


    cells.forEach(
        (cell) => {

            cell.classList.remove(
                "taken",
                "winner"
            );


            cell.innerHTML =
                "";

        }
    );


    updateScores();

    updateTurnUI();


    if (
        board
    ) {

        board.animate(
            [
                {
                    opacity:
                        0.45,

                    transform:
                        "scale(.94)"
                },

                {
                    opacity:
                        1,

                    transform:
                        "scale(1)"
                }

            ],
            {
                duration: 450,
                easing:
                    "cubic-bezier(.2,.8,.2,1)"
            }
        );

    }

}


/* =========================================================
   CELL EVENTS
========================================================= */

cells.forEach(
    (cell) => {

        cell.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        cell.dataset.index
                    );


                handleMove(
                    index
                );

            }
        );


        cell.addEventListener(
            "mouseenter",
            () => {

                if (
                    gameOver ||
                    computerThinking ||
                    cell.classList.contains(
                        "taken"
                    )
                ) {

                    return;

                }


                cell.animate(
                    [
                        {
                            transform:
                                "scale(1)"
                        },

                        {
                            transform:
                                "scale(.97)"
                        }

                    ],
                    {
                        duration: 160,
                        fill:
                            "forwards"
                    }
                );

            }
        );


        cell.addEventListener(
            "mouseleave",
            () => {

                if (
                    gameOver ||
                    cell.classList.contains(
                        "taken"
                    )
                ) {

                    return;

                }


                cell.animate(
                    [
                        {
                            transform:
                                "scale(.97)"
                        },

                        {
                            transform:
                                "scale(1)"
                        }

                    ],
                    {
                        duration: 160,
                        fill:
                            "forwards"
                    }
                );

            }
        );

    }
);


/* =========================================================
   RESTART BUTTON
========================================================= */

if (
    restartButton
) {

    restartButton.addEventListener(
        "click",
        () => {

            restartButton.animate(
                [
                    {
                        transform:
                            "scale(1)"
                    },

                    {
                        transform:
                            "scale(.90)"
                    },

                    {
                        transform:
                            "scale(1.06)"
                    },

                    {
                        transform:
                            "scale(1)"
                    }

                ],
                {
                    duration: 400,
                    easing: "ease-out"
                }
            );


            resetGame(
                false
            );

        }
    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        const key =
            event.key.toLowerCase();


        /*
            R = restart
        */

        if (
            key === "r"
        ) {

            resetGame(
                false
            );

        }


        /*
            P = 2 players
        */

        if (
            key === "p"
        ) {

            setGameMode(
                "pvp"
            );

        }


        /*
            C = computer
        */

        if (
            key === "c"
        ) {

            setGameMode(
                "computer"
            );

        }


        /*
            1 = Easy
            2 = Medium
            3 = Hard
        */

        if (
            key === "1" &&
            gameMode === "computer"
        ) {

            setDifficulty(
                "easy"
            );

        }


        if (
            key === "2" &&
            gameMode === "computer"
        ) {

            setDifficulty(
                "medium"
            );

        }


        if (
            key === "3" &&
            gameMode === "computer"
        ) {

            setDifficulty(
                "hard"
            );

        }


        /*
            Escape = restart
        */

        if (
            event.key === "Escape"
        ) {

            resetGame(
                false
            );

        }

    }
);


/* =========================================================
   RESIZE
========================================================= */

let resizeTimer;


window.addEventListener(
    "resize",
    () => {

        clearTimeout(
            resizeTimer
        );


        resizeTimer =
            setTimeout(
                () => {

                    if (
                        gameOver
                    ) {

                        const winner =
                            checkWinner();


                        if (
                            winner
                        ) {

                            drawWinLine(
                                winner.combo,
                                false
                            );

                        }

                    }

                },
                120
            );

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

createControlStyles();

createModeControls();

updateScores();

updateTurnUI();


/*
    Start in 2-player mode.
*/

setGameMode(
    "pvp"
);