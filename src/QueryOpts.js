import React, { useCallback } from "react";
import useFetch from "./utils/useFetch";

const QueryOpt = ({ query, opt, value, onValueChange }) => {
  const { error, fetching, json } = useFetch(`/queries/${query.name}/opts/${opt}`);

  const onChange = useCallback(
    event => onValueChange(opt, event.target.value),
    [onValueChange, opt]
  );

  if (error) {
    return "error";
  }

  if (fetching) {
    return "fetching";
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

const QueryOpts = ({ query, values, onValueChange }) => (
  <>
    {query.opts.map(opt => (
      <QueryOpt
        key={opt}
        query={query}
        opt={opt}
        value={values[opt]}
        onValueChange={onValueChange}
      />
    ))}
  </>
);

export default QueryOpts;
