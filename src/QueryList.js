import React, { useCallback, useState } from "react";
import useFetch from "./useFetch";

const QueryResults = ({ name }) => {
  const { error, fetching, json } = useFetch(`/queries/${name}`);

  if (error) {
    return "error";
  }

  if (fetching) {
    return "fetching";
  }

  return <>{json.result}</>;
};

const Query = ({ name }) => {
  const [fetchClicked, setFetchClicked] = useState(false);
  const onClick = useCallback(() => setFetchClicked(true), [setFetchClicked]);

  return (
    <button type="button" onClick={onClick}>
      {fetchClicked ? <QueryResults name={name} /> : name}
    </button>
  );
};

const QueryList = () => {
  const { error, fetching, json } = useFetch("/queries");

  if (error) {
    return "error";
  }

  if (fetching) {
    return "fetching";
  }

  return <>{json.queries.map(query => <Query key={query} name={query} />)}</>;
};

export default QueryList;
