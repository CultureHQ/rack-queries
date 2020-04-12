import React, { useState } from "react";

import API from "./api";
import QueryOpts, { QueryOptValues } from "./QueryOpts";
import QueryResults from "./QueryResults";

type QueryDetailsProps = {
  query: API.Query;
};

const QueryDetails: React.FC<QueryDetailsProps> = ({ query }) => {
  const [running, setRunning] = useState<boolean>(false);
  const onRun = () => setRunning(true);

  const [values, setValues] = useState<QueryOptValues>(
    query.opts.reduce((acc, opt) => ({ ...acc, [opt.name]: null }), {})
  );

  const onValueChange = (optName: string, value: string) => {
    setRunning(false);
    setValues(current => ({ ...current, [optName]: value }));
  };

  return (
    <div>
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
        {running && (
          <QueryResults
            query={query}
            values={values}
          />
        )}
      </div>
    </div>
  );
};

export default QueryDetails;
