import React from "react";
import { Link } from "react-router-dom";
import { LocalStorageKeys, getFromStorage } from "../storage";

export default function Home() {
  return (
    <>
      <header>
        <h1>Jason&apos;s app for scoring Wizard</h1>
      </header>
      <div>
        <div>
          <Link to="/game/new">New Game</Link>
        </div>
        {getFromStorage<string>(LocalStorageKeys.dealerId) ? (
          <Link to="/game">Resume Game</Link>
        ) : null}
        <div>
          <Link to="/rules">Rules</Link>
        </div>
      </div>
    </>
  );
}
