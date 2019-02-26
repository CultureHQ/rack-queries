import React, { useCallback, useRef, useState } from "react";

import QueryOpts from "./QueryOpts";
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

const QueryResults = ({ error, fetching, json }) => {
  if (!error && !fetching && Object.keys(json).length === 0) {
    return null;
  }

  return <>{json.results}</>;
};

const QueryDetails = ({ query }) => {
  const queryRef = useRef(null);

  const [values, setValues] = useState(
    query.opts.reduce((acc, opt) => ({ ...acc, [opt]: null }), {})
  );

  const onValueChange = useCallback(
    (opt, value) => setValues(current => ({ ...current, [opt]: value })),
    [setValues]
  );

  const [runState, onRun] = useDoFetch(queryRef, makeQueryURL(query, values));

  return (
    <div ref={queryRef}>
      <QueryOpts query={query} values={values} onValueChange={onValueChange} />
      <button
        className="run"
        type="button"
        disabled={Object.keys(values).some(key => !values[key])}
        onClick={onRun}
      >
        Run
      </button>
      <QueryResults {...runState} />
    </div>
  );
};

export default QueryDetails;
