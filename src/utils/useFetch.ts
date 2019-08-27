import { useEffect, useState } from "react";

import doFetch from "./doFetch";

type FetchState<T extends {}> = {
  error: Error | null;
  fetching: boolean;
  json: T
};

const useFetch = <T extends {}>(path: string) => {
  const [state, setState] = useState<FetchState<T>>({
    error: null,
    fetching: true,
    json: {}
  });

  useEffect(
    () => {
      setState({ error: null, fetching: true, json: {} });

      doFetch<T>(path)
        .then(json => setState({ error: null, fetching: false, json }))
        .catch((error: Error) => setState({ error, fetching: false, json: {} }));
    },
    [path]
  );

  return state;
};

export default useFetch;
