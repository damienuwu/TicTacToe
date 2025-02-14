const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const resetBoard = () => board.fill("");
    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };
    const checkWinner = () => {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], 
            [0, 3, 6], [1, 4, 7], [2, 5, 8], 
            [0, 4, 8], [2, 4, 6]
        ];
        for (let combo of winningCombos) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return board.includes("") ? null : "Tie";
    };

    return { getBoard, resetBoard, placeMarker, checkWinner };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const startGame = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
    };

    const playTurn = (index) => {
        if (gameOver || !Gameboard.placeMarker(index, players[currentPlayerIndex].marker)) {
            return;
        }
        DisplayController.renderBoard();
        const winner = Gameboard.checkWinner();
        if (winner) {
            gameOver = true;
            DisplayController.showResult(winner === "Tie" ? "It's a tie!" : `${players[currentPlayerIndex].name} wins!`);
            return;
        }
        currentPlayerIndex = 1 - currentPlayerIndex;
    };

    return { startGame, playTurn };
})();

const DisplayController = (() => {
    const boardElement = document.getElementById("gameboard");
    const resultElement = document.getElementById("result");
    const restartButton = document.getElementById("restart");

    const renderBoard = () => {
        boardElement.innerHTML = "";
        Gameboard.getBoard().forEach((mark, index) => {
            const cell = document.createElement("div");
            cell.classList.add(
                "w-20", "h-20", "flex", "items-center", "justify-center",
                "text-3xl", "font-bold", "border-2", "border-white",
                "cursor-pointer"
            );
            cell.textContent = mark;
            cell.addEventListener("click", () => GameController.playTurn(index));
            boardElement.appendChild(cell);
        });
    };

    const showResult = (message) => {
        resultElement.textContent = message;
    };

    restartButton.addEventListener("click", () => {
        GameController.startGame("Player 1", "Player 2");
        resultElement.textContent = "";
    });

    return { renderBoard, showResult };
})();


document.addEventListener("DOMContentLoaded", () => {
    GameController.startGame("Player 1", "Player 2");
});
