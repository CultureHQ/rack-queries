import { useEffect, useState } from "react";
import doFetch from "./doFetch";

const useFetch = path => {
  const [state, setState] = useState({
    error: null,
    fetching: true,
    json: {}
  });

  useEffect(
    () => {
      setState({ error: null, fetching: true, json: {} });

      doFetch(path)
        .then(json => setState({ error: null, fetching: false, json }))
        .catch(error => setState({ error, fetching: false, json: {} }));
    },
    [path]
  );

  return state;
};

export default useFetch;
