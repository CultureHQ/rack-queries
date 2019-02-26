import React from "react";

const QueryResults = ({ error, fetching, json }) => {
  if (!error && !fetching && Object.keys(json).length === 0) {
    return null;
  }

  return <div className="results">{json.results}</div>;
};

export default QueryResults;
