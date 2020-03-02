import React from "react";

import API from "./api";

import useGet from "./utils/useGet";

export type QueryOptValues = {
  [key: string]: string | null;
};

type ValueChangeCallback = (opt: string, value: string) => void;

type QueryOptProps = {
  query: API.Query;
  opt: string;
  value: string | null;
  onValueChange: ValueChangeCallback;
};

const QueryOpt: React.FC<QueryOptProps> = ({ query, opt, value, onValueChange }) => {
  const get = useGet<API.QueryOptsResponse>(`queries/${query.name}/opts/${opt}`);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange(opt, event.target.value);
  };

  if (get.error) {
    return <>error</>;
  }

  if (get.getting) {
    return <>getting</>;
  }

  if (!value) {
    onValueChange(opt, get.got.values[0]);
  }

  const name = `${query.name}-${opt}`;

  return (
    <label className="opt" htmlFor={name}>
      {`${opt}: `}
      <select id={name} name={name} onChange={onChange}>
        {get.got.values.map(optValue => (
          <option key={optValue} value={optValue}>{optValue}</option>
        ))}
      </select>
    </label>
  );
};

type QueryOptsProps = {
  query: API.Query;
  values: QueryOptValues;
  onValueChange: ValueChangeCallback;
};

const QueryOpts: React.FC<QueryOptsProps> = ({ query, values, onValueChange }) => (
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
