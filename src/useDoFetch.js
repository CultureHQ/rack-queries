import { useCallback, useState } from "react";
import doFetch from "./doFetch";

const useDoFetch = (ref, path) => {
  const [state, setState] = useState({
    error: null,
    fetching: true,
    json: {}
  });

  const onFetch = useCallback(
    () => {
      setState({ error: null, fetching: true, json: {} });

      doFetch(path)
        .then(json => {
          if (ref.current) {
            setState({ fetching: false, json });
          }
        })
        .catch(error => {
          if (ref.current) {
            setState({ fetching: false, error });
          }
        });
    },
    [ref, path]
  );

  return [state, onFetch];
};

export default useDoFetch;
