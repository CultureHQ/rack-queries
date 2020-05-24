import { useEffect, useState } from "react";

const makeGet = <T extends ReturnType<typeof JSON.parse>>(path: string): Promise<T> => (
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.responseText));
      }
    };

    xhr.open("GET", `${document.body.dataset.scriptName}/${path}`);
    xhr.send();
  })
);

type GetState<T> = (
  | { error: null; getting: true; got: null }
  | { error: null; getting: false; got: T }
  | { error: Error; getting: false; got: null }
);

const useGet = <T extends any>(path: string): GetState<T> => {
  const [state, setState] = useState<GetState<T>>({
    error: null,
    getting: true,
    got: null
  });

  useEffect(
    () => {
      let cancelled = false;
      setState({ error: null, getting: true, got: null });

      makeGet<T>(path)
        .then(got => {
          if (!cancelled) {
            setState({ error: null, getting: false, got });
          }
        })
        .catch(error => {
          if (!cancelled) {
            setState({ error, getting: false, got: null });
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

export default useGet;
