import * as React from "react";

import { Query } from "./QueryList";
import QueryOpts from "./QueryOpts";
import QueryResults from "./QueryResults";
import doFetch from "./utils/doFetch";

export type QueryValues = {
  [key: string]: string
};

const makeQueryURL = (query: Query, values: QueryValues) => {
  const url = `queries/${query.name}`;

  if (Object.keys(values).length === 0) {
    return url;
  }

  const pairs = Object.keys(values).map(key => (
    `${encodeURIComponent(key)}=${encodeURIComponent(values[key])}`
  ));

  return `${url}?${pairs.join("&")}`;
};

type QueryDetailsProps = {
  query: Query;
};

type RunState = {
  error: Error | null;
  fetching: boolean;
  results: [] | string | null;
};

const QueryDetails = ({ query }: { query: Query }) => {
  const detailsRef = React.useRef<HTMLDivElement>(null);

  const [values, setValues] = React.useState<QueryValues>(
    query.opts.reduce((acc, opt) => ({ ...acc, [opt]: null }), {})
  );

  const [runState, setRunState] = React.useState<RunState>({
    error: null, fetching: false, results: null
  });

  const onValueChange = (opt: string, value: string) => {
    setValues(current => ({ ...current, [opt]: value }));
    setRunState({ error: null, fetching: false, results: null });
  };

  const onRun = () => {
    setRunState({ error: null, fetching: true, results: null });

    doFetch(makeQueryURL(query, values))
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
