import * as React from "react";

import * as API from "./api";

import useFetch from "./utils/useFetch";

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

const QueryOpt = ({ query, opt, value, onValueChange }: QueryOptProps) => {
  const { error, fetching, json } = useFetch<API.QueryOptsResponse>(`queries/${query.name}/opts/${opt}`);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange(opt, event.target.value);
  };

  if (error) {
    return <>error</>;
  }

  if (fetching) {
    return <>fetching</>;
  }

  const { values } = json as API.QueryOptsResponse;

  if (!value) {
    onValueChange(opt, values[0]);
  }

  const name = `${query.name}-${opt}`;

  return (
    <label className="opt" htmlFor={name}>
      {`${opt}: `}
      <select id={name} name={name} onChange={onChange}>
        {values.map((optValue: string) => (
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

const QueryOpts = ({ query, values, onValueChange }: QueryOptsProps) => (
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
