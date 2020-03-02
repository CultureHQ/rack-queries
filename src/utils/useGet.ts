import { useEffect, useState } from "react";

import makeGet from "./makeGet";

type GetState<T> = (
  | { error: null; getting: true; got: null }
  | { error: null; getting: false; got: T }
  | { error: Error; getting: false; got: null }
);

const useGet = <T extends any>(path: string) => {
  const [state, setState] = useState<GetState<T>>({
    error: null,
    getting: true,
    got: null
  });

  useEffect(
    () => {
      setState({ error: null, getting: true, got: null });

      makeGet<T>(path)
        .then(got => setState({ error: null, getting: false, got }))
        .catch(error => setState({ error, getting: false, got: null }));
    },
    [path]
  );

  return state;
};

export default useGet;
