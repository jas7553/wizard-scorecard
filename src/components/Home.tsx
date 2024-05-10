import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h1>Jason&apos;s app for scoring Wizard</h1>
      <div>
        <div>
          <Link to="/game/new">New Game</Link>
        </div>
        {localStorage.getItem("gameState") ? (
          <Link to="/game">Resume Game</Link>
        ) : null}
        <div>
          <Link to="/rules">Rules</Link>
        </div>
      </div>
    </>
  );
}
