import * as React from "react";
import * as ReactDOM from "react-dom";

import QueryList from "./QueryList";

const App = () => (
  <React.StrictMode>
    <h1>Rack::Queries</h1>
    <QueryList />
  </React.StrictMode>
);

ReactDOM.render(<App />, document.getElementById("main"));
