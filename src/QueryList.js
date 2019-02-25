import React, { useCallback, useRef, useState } from "react";

import QueryOpts from "./QueryOpts";
import useFetch from "./utils/useFetch";
import useDoFetch from "./utils/useDoFetch";

const makeQueryURL = (query, values) => {
  const url = `/queries/${query.name}`;

  if (Object.keys(values).length === 0) {
    return url;
  }

  const pairs = Object.keys(values).map(key => (
    `${encodeURIComponent(key)}=${encodeURIComponent(values[key])}`
  ));

  return `${url}?${pairs.join("&")}`;
};

const QueryResults = ({ executeState }) => {
  if (!executeState.error && !executeState.fetching && Object.keys(executeState.json).length === 0) {
    return null;
  }

  return <>{executeState.json.results}</>;
};

const Query = ({ query }) => {
  const queryRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  const onToggle = useCallback(
    event => {
      if (queryRef.current === event.target) {
        setExpanded(value => !value);
      }
    },
    [setExpanded, queryRef]
  );

  const [values, setValues] = useState(
    query.opts.reduce((acc, opt) => ({ ...acc, [opt]: null }), {})
  );

  const onValueChange = useCallback(
    (opt, value) => setValues(current => ({ ...current, [opt]: value })),
    [setValues]
  );

  const [executeState, onExecute] = useDoFetch(queryRef, makeQueryURL(query, values));

  return (
    <div className="query" onClick={onToggle} ref={queryRef}>
      {query.name}
      {expanded && (
        <>
          <QueryOpts query={query} values={values} onValueChange={onValueChange} />
          <button
            type="button"
            disabled={Object.keys(values).some(key => !values[key])}
            onClick={onExecute}
          >
            Execute
          </button>
          <QueryResults executeState={executeState} />
        </>
      )}
    </div>
  );
};

const QueryList = () => {
  const { error, fetching, json } = useFetch("/queries");

  if (error) {
    return "error";
  }

  if (fetching) {
    return "fetching";
  }

  return (
    <div>
      {json.queries.map(query => (
        <Query key={query.name} query={query} />
      ))}
    </div>
  );
};

export default QueryList;
