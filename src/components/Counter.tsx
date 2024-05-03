import React from "react";
import { connect } from "react-redux";

import { AppDispatch, RootState } from "../store/store";

interface CounterProps {
  count: number;
  increment(): any;
  decrement(): any;
}

export const Counter = ({ count, increment, decrement }: CounterProps) => {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  count: state.counter.count,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  increment: () => dispatch({ type: "INCREMENT" }),
  decrement: () => dispatch({ type: "DECREMENT" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
