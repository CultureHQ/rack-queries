import React from "react";

const QueryResults = ({ error, fetching, results }) => {
  if (!error && !fetching && (results === null)) {
    return null;
  }

  if (error) {
    return "error";
  }

  if (fetching) {
    return "fetching";
  }

  if (!Array.isArray(results)) {
    return `Result: ${results}`;
  }

  const [headerRow, ...bodyRows] = results;

  /* eslint-disable react/no-array-index-key */
  return (
    <>
      Results:
      <table>
        <thead>
          <tr>
            {headerRow.map((value, index) => (
              <th key={index}>
                {value}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((bodyRow, rowIndex) => (
            <tr key={rowIndex}>
              {bodyRow.map((value, cellIndex) => (
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
