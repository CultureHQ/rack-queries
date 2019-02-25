import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import QueryList from "./QueryList";

const App = () => (
  <StrictMode>
    <h1>QueryPage</h1>
    <QueryList />
  </StrictMode>
);

ReactDOM.render(<App />, document.getElementById("main"));
