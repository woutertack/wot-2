import { useState, useEffect } from "react";
import { API_URL } from "./consts.js";

export default function Button() {
  const [toggleState, setToggleState] = useState(false);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);



  useEffect(() => {
    

    fetch(`${API_URL}/puzzleComplete`)
      .then(res => res.json())
      .then(data => {
        setPuzzleCompleted(data.completed);
        console.log(data.completed)
      });
  }, []);

  return (
    <>
      {/* {toggleState && <button className="btn-on" onClick={toggle}>On</button>}
      {!toggleState && <button className="btn-off" onClick={toggle}>Off</button>} */}
      {puzzleCompleted && <p>Puzzle Completed!</p>}
    </>
  );
}
