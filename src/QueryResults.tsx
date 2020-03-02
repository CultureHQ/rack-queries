import React from "react";

import API from "./api";
import { QueryOptValues } from "./QueryOpts";
import useGet from "./useGet";

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

type QueryResultsProps = {
  query: API.Query;
  values: QueryOptValues;
};

const QueryResults: React.FC<QueryResultsProps> = ({ query, values }) => {
  const get = useGet<API.QueryRunResponse>(makeQueryURL(query, values));

  if (get.error) {
    return <>error</>;
  }

  if (get.getting) {
    return <>getting</>;
  }

  const { results } = get.got;

  if (!Array.isArray(results)) {
    return <>Result: {results}</>;
  }

  const [headerRow, ...bodyRows] = results;

  /* eslint-disable react/no-array-index-key */
  return (
    <>
      Results:
      <table>
        <thead>
          <tr>
            {headerRow.map((value, index: number) => (
              <th key={index}>
                {value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((bodyRow, rowIndex: number) => (
            <tr key={rowIndex}>
              {bodyRow.map((value, cellIndex: number) => (
                <td key={cellIndex}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default QueryResults;
