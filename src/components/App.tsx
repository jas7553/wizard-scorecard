import React from "react";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <h1>Jason&apos;s app for scoring Wizard</h1>
      <div>
        <div>
          <Link to="/new">New Game</Link>
        </div>
        <div>
          <Link to="/rules">Rules</Link>
        </div>
      </div>
    </>
  );
}
