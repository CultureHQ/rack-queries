import React, { useEffect } from "react";

import API from "./api";
import useGet from "./useGet";

export type QueryOptValues = {
  [key: string]: string | null;
};

type ValueChangeCallback = (optName: string, value: string) => void;

type QueryOptProps = {
  name: string;
  query: API.Query;
  opt: API.QueryOpt;
  value: string | null;
  onValueChange: ValueChangeCallback;
};

const QueryOptSelect: React.FC<QueryOptProps> = ({ name, query, opt, value, onValueChange }) => {
  const get = useGet<API.QueryOptsResponse>(`queries/${query.name}/opts/${opt.name}`);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange(opt.name, event.target.value);
  };

  useEffect(
    () => {
      if (!value && get.got) {
        onValueChange(opt.name, get.got.values[0]);
      }
    },
    [get, opt, value, onValueChange]
  );

  if (get.error) {
    return <>error</>;
  }

  if (get.getting) {
    return <>getting</>;
  }

  return (
    <label className="opt" htmlFor={name}>
      {`${opt.name}: `}
      <select id={name} name={name} onChange={onChange}>
        {get.got.values.map(optValue => (
          <option key={optValue} value={optValue}>{optValue}</option>
        ))}
      </select>
    </label>
  );
};

const QueryOptString: React.FC<QueryOptProps> = ({ name, opt, value, onValueChange }) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(opt.name, event.target.value);
  };

  return (
    <label className="opt" htmlFor={name}>
      {`${opt.name}: `}
      <input type="text" id={name} name={name} onChange={onChange} value={value || ""} />
    </label>
  );
};

const QueryOptText: React.FC<QueryOptProps> = ({ name, opt, value, onValueChange }) => {
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onValueChange(opt.name, event.target.value);
  };

  return (
    <label className="opt" htmlFor={name}>
      {`${opt.name}: `}
      <textarea id={name} name={name} onChange={onChange} value={value || ""} />
    </label>
  );
};

const QueryOpt: React.FC<QueryOptProps> = ({ opt, ...props }) => {
  switch (opt.type) {
    case "select":
      return <QueryOptSelect opt={opt} {...props} />;
    case "string":
      return <QueryOptString opt={opt} {...props} />;
    case "text":
      return <QueryOptText opt={opt} {...props} />;
    default:
      return null;
  }
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
        key={opt.name}
        name={`${query.name}-${opt.name}`}
        query={query}
        opt={opt}
        value={values[opt.name]}
        onValueChange={onValueChange}
      />
    ))}
  </>
);

export default QueryOpts;
