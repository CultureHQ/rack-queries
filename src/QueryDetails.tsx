import * as React from "react";

import QueryOpts from "./QueryOpts";
import QueryResults from "./QueryResults";
import doFetch from "./utils/doFetch";

const makeQueryURL = (query, values) => {
  const url = `queries/${query.name}`;

  if (Object.keys(values).length === 0) {
    return url;
  }

  const pairs = Object.keys(values).map(key => (
    `${encodeURIComponent(key)}=${encodeURIComponent(values[key])}`
  ));

  return `${url}?${pairs.join("&")}`;
};

const QueryDetails = ({ query }) => {
  const detailsRef = React.useRef(null);

  const [values, setValues] = React.useState(
    query.opts.reduce((acc, opt) => ({ ...acc, [opt]: null }), {})
  );

  const [runState, setRunState] = React.useState({
    error: null, fetching: false, results: null
  });

  const onValueChange = (opt, value) => {
    setValues(current => ({ ...current, [opt]: value }));
    setRunState({ error: null, fetching: false, results: null });
  };

  const onRun = () => {
    setRunState({ error: null, fetching: true, results: null });

    doFetch(makeQueryURL(query, values))
      .then(({ results }) => {
        if (detailsRef.current) {
          setRunState({ fetching: false, results });
        }
      })
      .catch(error => {
        if (detailsRef.current) {
          setRunState({ fetching: false, error });
        }
      });
  };

  return (
    <div ref={detailsRef}>
      <QueryOpts
        query={query}
        values={values}
        onValueChange={onValueChange}
      />
      <button
        className="run"
        type="button"
        disabled={Object.keys(values).some(key => !values[key])}
        onClick={onRun}
      >
        Run
      </button>
      <div className="results">
        <QueryResults
          error={runState.error}
          fetching={runState.fetching}
          results={runState.results}
        />
      </div>
    </div>
  );
};

export default QueryDetails;
