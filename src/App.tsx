import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import QueryList from "./QueryList";

const App: React.FC = () => (
  <StrictMode>
    <h1>Rack::Queries</h1>
    <QueryList />
  </StrictMode>
);

ReactDOM.render(<App />, document.getElementById("main"));
