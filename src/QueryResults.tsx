import React from "react";

import API from "./api";

type QueryResultsProps = {
  error: Error | null;
  fetching: boolean;
  results: API.QueryResult | null;
};

const QueryResults: React.FC<QueryResultsProps> = ({ error, fetching, results }) => {
  if (!error && !fetching && (results === null)) {
    return null;
  }

  if (error) {
    return <>error</>;
  }

  if (fetching) {
    return <>fetching</>;
  }

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
