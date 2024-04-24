import { useState, useEffect } from 'react';
import { Box, Button, Grid, GridItem, VStack, Heading, Flex, IconButton } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useColorMode } from '@chakra-ui/color-mode';

const Index = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [aiMode, setAiMode] = useState(false);
  const winner = calculateWinner(board);
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = colorMode === 'light' ? 'gray.100' : 'gray.700';
  const color = colorMode === 'light' ? 'black' : 'white';
  const SwitchIcon = colorMode === 'light' ? FaMoon : FaSun;

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

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  function calculateBestMove(board) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
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

  return (
    <Box textAlign="center" mt={10} bg={bgColor} color={color} minH="100vh" py={10}>
      <Flex justifyContent="flex-end" p={4}>
        <IconButton
          aria-label="Toggle theme"
          icon={<SwitchIcon />}
          onClick={toggleColorMode}
          size="lg"
        />
      </Flex>
      <VStack spacing={8}>
        <Heading fontSize="2xl" mb={4}>{winner === 'Draw' ? 'Game ended in a draw!' : (winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`)}</Heading>
        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
          {Array.from({ length: 9 }).map((_, i) => (
            <GridItem key={i}>
              <Button onClick={() => handleClick(i)} size="lg" p={7} colorScheme="teal" isFullWidth>
                {board[i]}
              </Button>
            </GridItem>
          ))}
        </Grid>
        <Button mt={4} colorScheme="blue" onClick={resetGame}>Reset Game</Button>
        <Button mt={4} colorScheme="teal" onClick={() => setAiMode(!aiMode)}>
          {aiMode ? 'Play Against Human' : 'Play Against AI'}
        </Button>
      </VStack>
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
  return null;
}

export default Index;