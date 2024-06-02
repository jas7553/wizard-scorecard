import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "..";

export default function Home() {
  const isGameInProgress =
    useSelector((state: RootState) => state.players.dealerId) === null;
  return (
    <>
      <header>
        <h1>Jason&apos;s app for scoring Wizard</h1>
      </header>
      <div>
        <div>
          <Link to="/game/new">New Game</Link>
        </div>
        {isGameInProgress ? <Link to="/game">Resume Game</Link> : null}
        <div>
          <Link to="/rules">Rules</Link>
        </div>
      </div>
    </>
  );
}
