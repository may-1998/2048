document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById('grid-container');
    const scoreElement = document.getElementById('score');

    let board, score;

    // 初始化游戏板
    function initBoard() {
        board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        score = 0;
        scoreElement.textContent = score;
        addNewTile();
        addNewTile();
        renderBoard(); // 确保渲染函数被调用
    }

    // 添加新的方块
    function addNewTile() {
        let emptyTiles = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    emptyTiles.push({x: i, y: j});
                }
            }
        }
        if (emptyTiles.length > 0) {
            let {x, y} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // 渲染游戏板
    function renderBoard() {
        gameContainer.innerHTML = ''; // 清空之前的网格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.value = board[i][j];
                cell.textContent = board[i][j] === 0 ? '' : board[i][j];
                gameContainer.appendChild(cell); // 将每个格子加入到游戏网格容器中
            }
        }
        scoreElement.textContent = score; // 更新得分显示
    }

    // 合并行
    function mergeRow(row) {
        row = row.filter(val => val); // 去掉0
        for (let i = 0; i < row.length - 1; i++) {
            if (row[i] === row[i + 1]) {
                row[i] *= 2;
                score += row[i];
                row[i + 1] = 0;
            }
        }
        return row.filter(val => val).concat(Array(4 - row.length).fill(0));
    }

    // 移动逻辑
    function move(direction) {
        let moved = false;
        if (direction === "ArrowLeft") {
            for (let i = 0; i < 4; i++) {
                let newRow = mergeRow(board[i]);
                if (board[i].toString() !== newRow.toString()) {
                    moved = true;
                }
                board[i] = newRow;
            }
        } else if (direction === "ArrowRight") {
            for (let i = 0; i < 4; i++) {
                let newRow = mergeRow(board[i].slice().reverse()).reverse();
                if (board[i].toString() !== newRow.toString()) {
                    moved = true;
                }
                board[i] = newRow;
            }
        } else if (direction === "ArrowUp") {
            for (let j = 0; j < 4; j++) {
                let column = [board[0][j], board[1][j], board[2][j], board[3][j]];
                let newCol = mergeRow(column);
                for (let i = 0; i < 4; i++) {
                    board[i][j] = newCol[i];
                }
            }
            moved = true;
        } else if (direction === "ArrowDown") {
            for (let j = 0; j < 4; j++) {
                let column = [board[0][j], board[1][j], board[2][j], board[3][j]];
                let newCol = mergeRow(column.reverse()).reverse();
                for (let i = 0; i < 4; i++) {
                    board[i][j] = newCol[i];
                }
            }
            moved = true;
        }
        if (moved) {
            addNewTile();
        }
        checkGameStatus();
        renderBoard();
    }

    // 检查游戏状态
    function checkGameStatus() {
        if (board.some(row => row.includes(2048))) {
            alert("恭喜你！你赢了！");
        } else if (!board.flat().includes(0)) {
            alert("游戏结束！");
        }
    }

    // 初始化游戏
    initBoard();

    // 键盘移动事件监听
    document.addEventListener('keydown', (event) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            move(event.key); // 根据按键调用移动函数
        }
    });
});
