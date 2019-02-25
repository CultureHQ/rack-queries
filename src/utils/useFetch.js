import { useCallback, useEffect, useState } from "react";
import doFetch from "./doFetch";

const useFetch = path => {
  let cancelled = false;
  const [state, setState] = useState({
    error: null,
    fetching: true,
    json: {}
  });

  useEffect(
    () => {
      setState({ error: null, fetching: true, json: {} });

      doFetch(path)
        .then(json => {
          if (!cancelled) {
            setState({ fetching: false, json });
          }
        })
        .catch(error => {
          if (!cancelled) {
            setState({ fetching: false, error });
          }
        });

      return () => {
        cancelled = true;
      };
    },
    [path]
  );

  return state;
};

export default useFetch;
