import React, { useRef, useState } from "react";

import API from "./api";

import QueryOpts, { QueryOptValues } from "./QueryOpts";
import QueryResults from "./QueryResults";
import makeGet from "./utils/makeGet";

const makeQueryURL = (query: API.Query, values: QueryOptValues) => {
  const url = `queries/${query.name}`;
  const filtered = Object.keys(values).filter(key => values[key]);

  if (filtered.length === 0) {
    return url;
  }

  const pairs = filtered.map(key => (
    `${encodeURIComponent(key)}=${encodeURIComponent(values[key] as string)}`
  ));

  return `${url}?${pairs.join("&")}`;
};

type QueryRunState = {
  error: Error | null;
  fetching: boolean;
  results: API.QueryResult | null;
};

type QueryDetailsProps = {
  query: API.Query;
};

const QueryDetails: React.FC<QueryDetailsProps> = ({ query }) => {
  const detailsRef = useRef<HTMLDivElement>(null);

  const [values, setValues] = useState<QueryOptValues>(
    query.opts.reduce((acc, opt) => ({ ...acc, [opt]: null }), {})
  );

  const [runState, setRunState] = useState<QueryRunState>({
    error: null, fetching: false, results: null
  });

  const onValueChange = (opt: string, value: string) => {
    setValues(current => ({ ...current, [opt]: value }));
    setRunState({ error: null, fetching: false, results: null });
  };

  const onRun = () => {
    setRunState({ error: null, fetching: true, results: null });

    makeGet<API.QueryRunResponse>(makeQueryURL(query, values))
      .then(({ results }) => {
        if (detailsRef.current) {
          setRunState({ error: null, fetching: false, results });
        }
      })
      .catch(error => {
        if (detailsRef.current) {
          setRunState({ error, fetching: false, results: null });
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
