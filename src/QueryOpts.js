import React, { useCallback } from "react";
import useFetch from "./utils/useFetch";

const QueryOpt = ({ query, opt, value, onValueChange }) => {
  const { error, fetching, json } = useFetch(`queries/${query.name}/opts/${opt}`);

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

  /* eslint-disable jsx-a11y/label-has-for */
  // because of https://github.com/evcohen/eslint-plugin-jsx-a11y/issues/477
  return (
    <label className="opt" htmlFor={name}>
      {`${opt}: `}
      <select id={name} name={name} onChange={onChange}>
        {json.values.map(optValue => (
          <option key={optValue} value={optValue}>{optValue}</option>
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
