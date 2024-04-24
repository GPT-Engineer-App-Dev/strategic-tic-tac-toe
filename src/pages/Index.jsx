import { useState, useEffect } from 'react';
import { Box, Button, Grid, GridItem, Text, useColorMode, useColorModeValue, IconButton } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';

const Index = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [aiMode, setAiMode] = useState(false);
  const winner = calculateWinner(board);
  const { colorMode, toggleColorMode } = useColorMode();
  const SwitchIcon = colorMode === 'light' ? FaMoon : FaSun;
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const color = useColorModeValue('black', 'white');

  useEffect(() => {
    if (aiMode && !xIsNext && !winner) {
      const timeout = setTimeout(() => {
        const bestMove = calculateBestMove(board);
        const boardCopy = [...board];
        boardCopy[bestMove] = 'O';
        setBoard(boardCopy);
        setXIsNext(true);
      }, 500); // Delay AI move to ensure state has updated
      return () => clearTimeout(timeout);
    }
  }, [board, xIsNext, aiMode, winner]);

  const handleClick = (i) => {
    const boardCopy = [...board];
    if (winner || boardCopy[i]) return;
    boardCopy[i] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  };

  const renderSquare = (i) => (
    <Button onClick={() => handleClick(i)} size="lg" p={7} colorScheme="teal">
      {board[i]}
    </Button>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <Box textAlign="center" mt={10} bg={bgColor} color={color} p={5} borderRadius="lg">
      <IconButton
        aria-label="Toggle color mode"
        icon={<SwitchIcon />}
        onClick={toggleColorMode}
        mb={4}
      />
      <Text fontSize="2xl" mb={4}>{winner === 'Draw' ? 'Game ended in a draw!' : (winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`)}</Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {Array.from({ length: 9 }).map((_, i) => (
          <GridItem key={i}>
            {renderSquare(i)}
          </GridItem>
        ))}
      </Grid>
      <Button mt={4} colorScheme="red" onClick={resetGame}>Reset Game</Button>
      <Button mt={4} colorScheme="purple" onClick={() => setAiMode(!aiMode)}>
        {aiMode ? 'Play Against Human' : 'Play Against AI'}
      </Button>
    </Box>
  );
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  const isBoardFull = squares.every(square => square !== null);
  if (isBoardFull) {
      return 'Draw';
  }
  return null;
}

function calculateBestMove(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let i = 0; i < winPatterns.length; i++) {
    const [a, b, c] = winPatterns[i];
    if (board[a] === 'O' && board[b] === 'O' && !board[c]) return c;
    if (board[a] === 'O' && !board[b] && board[c] === 'O') return b;
    if (!board[a] && board[b] === 'O' && board[c] === 'O') return a;
  }

  for (let i = 0; i < winPatterns.length; i++) {
    const [a, b, c] = winPatterns[i];
    if (board[a] === 'X' && board[b] === 'X' && !board[c]) return c;
    if (board[a] === 'X' && !board[b] && board[c] === 'X') return b;
    if (!board[a] && board[b] === 'X' && board[c] === 'X') return a;
  }

  if (!board[4]) return 4;

  const corners = [0, 2, 6, 8];
  for (let i = 0; i < corners.length; i++) {
    if (!board[corners[i]]) return corners[i];
  }

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) return i;
  }
  return 0;
}

export default Index;