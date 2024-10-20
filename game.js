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
        renderBoard();
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
                gameContainer.appendChild(cell);
            }
        }
        scoreElement.textContent = score;
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
        // 如果有2048，游戏胜利
        if (board.some(row => row.includes(2048))) {
            alert("恭喜你！你赢了！");
            return;
        }

        // 检查是否还有空格
        if (board.flat().includes(0)) {
            return; // 如果有空格，游戏还未结束
        }

        // 检查是否可以合并
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                // 检查右边和下边的方块是否相同
                if (j < 3 && board[i][j] === board[i][j + 1]) return;
                if (i < 3 && board[i][j] === board[i + 1][j]) return;
            }
        }

        // 如果无法合并且没有空格，游戏结束
        alert("游戏结束！");
    }

    // 初始化游戏
    initBoard();

    // 键盘移动事件监听，包括方向键和 WASD 控制
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(key)) {
            switch (key) {
                case 'ArrowUp':
                case 'w':
                    move('ArrowUp');
                    break;
                case 'ArrowDown':
                case 's':
                    move('ArrowDown');
                    break;
                case 'ArrowLeft':
                case 'a':
                    move('ArrowLeft');
                    break;
                case 'ArrowRight':
                case 'd':
                    move('ArrowRight');
                    break;
            }
        }
    });

    // 滑动手势支持
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener("touchstart", function(event) {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, false);

    document.addEventListener("touchend", function(event) {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleSwipeGesture();
    }, false);

    // 处理滑动手势
    function handleSwipeGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const swipeThreshold = 30; // 设置滑动的最小距离阈值

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
                move("ArrowRight");
            } else {
                move("ArrowLeft");
            }
        } else if (Math.abs(deltaY) > swipeThreshold) {
            if (deltaY > 0) {
                move("ArrowDown");
            } else {
                move("ArrowUp");
            }
        }
    }
});
