import React from "react";
import { Link } from "react-router-dom";

export default function Start() {
  return (
    <>
      <Link to="/new">New Game</Link>
      <Link to="/rules">Rules</Link>
    </>
  );
}
