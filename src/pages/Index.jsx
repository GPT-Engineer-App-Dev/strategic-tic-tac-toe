import { useState, useEffect } from 'react';
import { Box, Button, Grid, GridItem, Text } from '@chakra-ui/react';

const Index = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [aiMode, setAiMode] = useState(false);
  const winner = calculateWinner(board);

  useEffect(() => {
    if (aiMode && !xIsNext) {
      const bestMove = calculateBestMove(board);
      const boardCopy = [...board];
      boardCopy[bestMove] = 'O';
      setBoard(boardCopy);
      setXIsNext(true);
    }
  }, [board, xIsNext, aiMode]);

  const handleClick = (i) => {
    const boardCopy = [...board];
    if (winner || boardCopy[i]) return;
    boardCopy[i] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
    if (aiMode && !xIsNext) {
      const bestMove = calculateBestMove(boardCopy);
      boardCopy[bestMove] = 'O';
      setBoard(boardCopy);
      setXIsNext(true);
    }
  };

  const renderSquare = (i) => (
    <Button onClick={() => handleClick(i)} size="lg" p={7}>
      {board[i]}
    </Button>
  );

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  function calculateBestMove(board) {
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) return i; // Placeholder for AI logic
    }
    return 0;
  }

  return (
    <Box textAlign="center" mt={10}>
      <Text fontSize="2xl" mb={4}>{winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`}</Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={2}>
        {Array.from({ length: 9 }).map((_, i) => (
          <GridItem key={i}>
            {renderSquare(i)}
          </GridItem>
        ))}
      </Grid>
      <Button mt={4} colorScheme="blue" onClick={resetGame}>Reset Game</Button>
      <Button mt={4} colorScheme="teal" onClick={() => setAiMode(!aiMode)}>
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
  return null;
}

export default Index;