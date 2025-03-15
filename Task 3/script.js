document.addEventListener("DOMContentLoaded", () => {
    // Game elements
    const board = document.getElementById("board")
    const cells = document.querySelectorAll(".cell")
    const status = document.getElementById("status")
    const resetButton = document.getElementById("reset-game")
    const newGameButton = document.getElementById("new-game")
    const restartButton = document.getElementById("restart-button")
    const winningMessage = document.getElementById("winning-message")
    const winningMessageText = document.getElementById("winning-message-text")
    const scoreX = document.getElementById("score-x")
    const scoreO = document.getElementById("score-o")
    const scoreTies = document.getElementById("score-ties")
    const twoPlayersButton = document.getElementById("two-players")
    const vsComputerButton = document.getElementById("vs-computer")
    const difficultyContainer = document.getElementById("difficulty-container")
    const difficultyLevel = document.getElementById("difficulty-level")
  
    // Game state
    let gameActive = true
    let currentPlayer = "X"
    let gameState = ["", "", "", "", "", "", "", "", ""]
    let scores = { X: 0, O: 0, ties: 0 }
    let gameMode = "two-players" // 'two-players' or 'vs-computer'
    let difficulty = "easy" // 'easy', 'medium', or 'hard'
  
    // Winning combinations
    const winningConditions = [
      [0, 1, 2], // Top row
      [3, 4, 5], // Middle row
      [6, 7, 8], // Bottom row
      [0, 3, 6], // Left column
      [1, 4, 7], // Middle column
      [2, 5, 8], // Right column
      [0, 4, 8], // Diagonal top-left to bottom-right
      [2, 4, 6], // Diagonal top-right to bottom-left
    ]
  
    // Messages
    const winMessage = () => `Player ${currentPlayer} wins!`
    const drawMessage = () => `Game ended in a draw!`
    const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`
  
    // Initialize the game
    function initializeGame() {
      gameActive = true
      currentPlayer = "X"
      gameState = ["", "", "", "", "", "", "", "", ""]
      status.innerHTML = currentPlayerTurn()
      cells.forEach((cell) => {
        cell.className = "cell"
        cell.innerHTML = ""
      })
      updateDifficultyVisibility()
    }
  
    // Handle cell click
    function handleCellClick(clickedCellEvent) {
      const clickedCell = clickedCellEvent.target
      const clickedCellIndex = Number.parseInt(clickedCell.getAttribute("data-cell-index"))
  
      // Check if cell is already played or game is inactive
      if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return
      }
  
      // Update game state and UI
      handleCellPlayed(clickedCell, clickedCellIndex)
      handleResultValidation()
  
      // If game is vs computer and game is still active, make computer move
      if (gameMode === "vs-computer" && gameActive && currentPlayer === "O") {
        setTimeout(() => {
          makeComputerMove()
        }, 500)
      }
    }
  
    // Handle cell played
    function handleCellPlayed(clickedCell, clickedCellIndex) {
      gameState[clickedCellIndex] = currentPlayer
      clickedCell.classList.add(currentPlayer.toLowerCase())
    }
  
    // Handle result validation
    function handleResultValidation() {
      let roundWon = false
      let winningLine = null
  
      // Check for winning combinations
      for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i]
        const condition = gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]
  
        if (condition) {
          roundWon = true
          winningLine = [a, b, c]
          break
        }
      }
  
      // Handle win
      if (roundWon) {
        gameActive = false
        highlightWinningCells(winningLine)
        updateScore(currentPlayer)
        showWinningMessage(winMessage())
        return
      }
  
      // Handle draw
      const roundDraw = !gameState.includes("")
      if (roundDraw) {
        gameActive = false
        updateScore("ties")
        showWinningMessage(drawMessage())
        return
      }
  
      // Continue game with next player
      handlePlayerChange()
    }
  
    // Highlight winning cells
    function highlightWinningCells(winningLine) {
      winningLine.forEach((index) => {
        cells[index].classList.add("highlight")
      })
    }
  
    // Handle player change
    function handlePlayerChange() {
      currentPlayer = currentPlayer === "X" ? "O" : "X"
      status.innerHTML = currentPlayerTurn()
    }
  
    // Update score
    function updateScore(player) {
      scores[player]++
      if (player === "X") {
        scoreX.textContent = scores.X
      } else if (player === "O") {
        scoreO.textContent = scores.O
      } else {
        scoreTies.textContent = scores.ties
      }
    }
  
    // Show winning message
    function showWinningMessage(message) {
      winningMessageText.innerHTML = message
      winningMessage.classList.add("show")
    }
  
    // Hide winning message
    function hideWinningMessage() {
      winningMessage.classList.remove("show")
    }
  
    // Make computer move
    function makeComputerMove() {
      if (!gameActive) return
  
      let index
  
      switch (difficulty) {
        case "hard":
          index = getBestMove()
          break
        case "medium":
          // 50% chance of making the best move, 50% chance of making a random move
          index = Math.random() < 0.5 ? getBestMove() : getRandomMove()
          break
        case "easy":
        default:
          index = getRandomMove()
          break
      }
  
      if (index !== -1) {
        const cell = cells[index]
        handleCellPlayed(cell, index)
        handleResultValidation()
      }
    }
  
    // Get random available move
    function getRandomMove() {
      const availableMoves = gameState.map((cell, index) => (cell === "" ? index : -1)).filter((index) => index !== -1)
  
      if (availableMoves.length === 0) return -1
  
      return availableMoves[Math.floor(Math.random() * availableMoves.length)]
    }
  
    // Get best move using minimax algorithm
    function getBestMove() {
      // If center is available, take it (common opening strategy)
      if (gameState[4] === "") return 4
  
      let bestScore = Number.NEGATIVE_INFINITY
      let bestMove = -1
  
      for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
          gameState[i] = "O"
          const score = minimax(gameState, 0, false)
          gameState[i] = ""
  
          if (score > bestScore) {
            bestScore = score
            bestMove = i
          }
        }
      }
  
      return bestMove
    }
  
    // Minimax algorithm for AI
    function minimax(board, depth, isMaximizing) {
      // Check for terminal states
      const winner = checkWinner(board)
      if (winner === "O") return 10 - depth
      if (winner === "X") return depth - 10
      if (isBoardFull(board)) return 0
  
      if (isMaximizing) {
        let bestScore = Number.NEGATIVE_INFINITY
        for (let i = 0; i < board.length; i++) {
          if (board[i] === "") {
            board[i] = "O"
            const score = minimax(board, depth + 1, false)
            board[i] = ""
            bestScore = Math.max(score, bestScore)
          }
        }
        return bestScore
      } else {
        let bestScore = Number.POSITIVE_INFINITY
        for (let i = 0; i < board.length; i++) {
          if (board[i] === "") {
            board[i] = "X"
            const score = minimax(board, depth + 1, true)
            board[i] = ""
            bestScore = Math.min(score, bestScore)
          }
        }
        return bestScore
      }
    }
  
    // Check for winner in board state
    function checkWinner(board) {
      for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i]
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a]
        }
      }
      return null
    }
  
    // Check if board is full
    function isBoardFull(board) {
      return !board.includes("")
    }
  
    // Update difficulty visibility based on game mode
    function updateDifficultyVisibility() {
      if (gameMode === "vs-computer") {
        difficultyContainer.style.display = "flex"
      } else {
        difficultyContainer.style.display = "none"
      }
    }
  
    // Event listeners
    cells.forEach((cell) => cell.addEventListener("click", handleCellClick))
    resetButton.addEventListener("click", initializeGame)
    newGameButton.addEventListener("click", () => {
      initializeGame()
      scores = { X: 0, O: 0, ties: 0 }
      scoreX.textContent = "0"
      scoreO.textContent = "0"
      scoreTies.textContent = "0"
    })
    restartButton.addEventListener("click", () => {
      hideWinningMessage()
      initializeGame()
    })
  
    // Game mode selection
    twoPlayersButton.addEventListener("click", () => {
      gameMode = "two-players"
      twoPlayersButton.classList.add("active")
      vsComputerButton.classList.remove("active")
      updateDifficultyVisibility()
      initializeGame()
    })
  
    vsComputerButton.addEventListener("click", () => {
      gameMode = "vs-computer"
      vsComputerButton.classList.add("active")
      twoPlayersButton.classList.remove("active")
      updateDifficultyVisibility()
      initializeGame()
    })
  
    // Difficulty selection
    difficultyLevel.addEventListener("change", (e) => {
      difficulty = e.target.value
    })
  
    // Initialize the game
    initializeGame()
  })
  
  