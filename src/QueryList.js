import React, { useCallback, useRef, useState } from "react";
import useFetch from "./useFetch";

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

const FetchState = ({ error, fetching }) => {
  if (error) {
    return "error";
  }

  return "fetching";
};

const QueryResults = ({ query, values }) => {
  const { error, fetching, json } = useFetch(makeQueryURL(query, values));

  if (error || fetching) {
    return <FetchState error={error} fetching={fetching} />;
  }

  return <>{json.results}</>;
};

const QueryOpt = ({ query, opt, value, onValueChange }) => {
  const { error, fetching, json } = useFetch(`/queries/${query.name}/opts/${opt}`);

  const onChange = useCallback(
    event => onValueChange(opt, event.target.value),
    [onValueChange, opt]
  );

  if (error || fetching) {
    return <FetchState error={error} fetching={fetching} />;
  }

  if (!value) {
    onValueChange(opt, json.values[0]);
  }

  const name = `${query.name}-${opt}`;

  return (
    <label htmlFor={name}>
      {`${opt}: `}
      <select id={name} name={name} onChange={onChange}>
        {json.values.map(value => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>
    </label>
  );
};

const QueryDetails = ({ query, values, onValueChange, onExecute }) => (
  <>
    <br />
    {query.opts.map(opt => (
      <QueryOpt
        key={opt}
        query={query}
        opt={opt}
        value={values[opt]}
        onValueChange={onValueChange}
      />
    ))}
    <br />
    <button
      type="button"
      disabled={Object.keys(values).some(key => !values[key])}
      onClick={onExecute}
    >
      Execute
    </button>
  </>
);

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

  const [executing, setExecuting] = useState(false);
  const onExecute = useCallback(() => setExecuting(true), [setExecuting]);

  return (
    <div className="query" onClick={onToggle} ref={queryRef}>
      {query.name}
      {expanded && (
        <QueryDetails
          query={query}
          values={values}
          onValueChange={onValueChange}
          onExecute={onExecute}
        />
      )}
      {executing && <QueryResults query={query} values={values} />}
    </div>
  );
};

const QueryList = () => {
  const { error, fetching, json } = useFetch("/queries");

  if (error || fetching) {
    return <FetchState error={error} fetching={fetching} />;
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
