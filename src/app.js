import React, { StrictMode } from "react";
import ReactDOM from "react-dom";

import useFetch from "./useFetch";

const QueryList = () => {
  const { fetching, json } = useFetch("/queries");

  if (fetching) {
    return "fetching";
  }

  return (
    <ul>
      {json.queries.map(query => (
        <li key={query}>{query}</li>
      ))}
    </ul>
  );
};

const App = () => (
  <StrictMode>
    <h1>QueryPage</h1>
    <QueryList />
  </StrictMode>
);

ReactDOM.render(<App />, document.getElementById("main"));
