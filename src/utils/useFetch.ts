import { useEffect, useState } from "react";

import doFetch from "./doFetch";

type FetchState<T extends any> = {
  error: Error | null;
  fetching: boolean;
  json: T | null;
};

const useFetch = <T extends any>(path: string) => {
  const [state, setState] = useState<FetchState<T>>({
    error: null,
    fetching: true,
    json: null
  });

  useEffect(
    () => {
      setState({ error: null, fetching: true, json: null });

      doFetch<T>(path)
        .then((json: T) => setState({ error: null, fetching: false, json }))
        .catch((error: Error) => setState({ error, fetching: false, json: null }));
    },
    [path]
  );

  return state;
};

export default useFetch;
