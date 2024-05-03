import React from "react";
import { Link } from "react-router-dom";

import Counter from "./Counter";
import Start from "./Start";

export default () => (
  <>
    <h1>Jason's app for scoring Wizard</h1>
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
