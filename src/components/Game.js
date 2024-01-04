import { useState, useMemo, useCallback} from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import Modal from "./Modal";
import './Game.css'

const Game =(props)=> {
  const chess = useMemo(() => new Chess(), []); // <- 1
  const [fen, setFen] = useState(chess.fen()); // <- 2
  const [over, setOver] = useState("");

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // update fen state to trigger a re-render
  
        console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());
  
        if (chess.isGameOver()) { // check if move led to "game over"
          if (chess.isCheckmate()) { // if reason for game over is a checkmate
            // Set message to checkmate. 
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            ); 
            // The winner is determined by checking which side made the last move
          } else if (chess.isDraw()) { // if it is a draw
            setOver("Draw"); // set message to "Draw"
          } else {
            setOver("Game over");
          }
        }
  
        return result;
      } catch (e) {
        return null;
      } // null if the move was illegal, the move object if the move was legal
    },
    [chess]
  );

  // onDrop function
  function onDrop(sourceSquare, targetSquare) {
    const moveData = {
        from: sourceSquare,
        to: targetSquare,
        color: chess.turn(),
        // promotion: "q",
      };
  
      const move = makeAMove(moveData);
  
      // illegal move
      if (move === null) {
        return false;
      }
  
      return true;
  } // <- 3

  const resetHandler=()=>{
    chess.reset()
    setFen(chess.fen())
  }
  
  // Game component returned jsx
  return (
    <>
      <div class="sm:w-[50%] sm:max-w-[600px] sm:mx-2 sm:my-2 mx-2 my-2" >
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
        />  {/**  <- 4 */}
      </div>
      <Modal // <- 5
        open={Boolean(over)}
        title={over}
        contentText={over}
        handleContinue={() => {
          setOver("");
          setFen(chess.fen())
        }}
      />
      {chess.isGameOver() && 
        <button class="border border-blue-500 h-8 ml-2 w-20 rounded-lg text-blue-700 hover:bg-blue-400 hover:text-white"
        onClick={resetHandler}>Reset</button>}
    </>
  );
}

export default Game;