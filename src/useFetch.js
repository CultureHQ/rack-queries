import { useCallback, useEffect, useState } from "react";

const fetchPath = path => new Promise((resolve, reject) => {
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

  xhr.open("GET", path);
  xhr.send();
});

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

      fetchPath(path)
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
