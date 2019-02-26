import React from "react";

const QueryResults = ({ error, fetching, results }) => {
  if (!error && !fetching && !results) {
    return null;
  }

  if (error) {
    return "error";
  }

  if (fetching) {
    return "fetching";
  }

  if (!Array.isArray(results)) {
    return <div className="results">Result: {results}</div>;
  }

  const [headerRow, ...bodyRows] = results;

  return (
    <div className="results">
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
          {bodyRows.map((bodyRow, index) => (
            <tr key={index}>
              {bodyRow.map((value, index) => (
                <td key={index}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QueryResults;
