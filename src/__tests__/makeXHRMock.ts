type XHR = {
  onreadystatechange: (() => void) | null;
  open: (method: string, path: string) => void;
  path: string | null;
  readyState: number;
  responseText: string | null;
  send: () => void;
  status: number;
};

const makeXHRMock = (makeResponse: ((path: string) => object | null)) => {
  const xhr: XHR = {
    onreadystatechange: null,
    open: (method: string, path: string) => {
      xhr.path = path;
    },
    path: null,
    readyState: 4,
    responseText: null,
    send: () => {
      xhr.responseText = JSON.stringify(makeResponse(xhr.path as string));

      if (xhr.onreadystatechange) {
        xhr.onreadystatechange();
      }
    },
    status: 200
  };

  return xhr;
};

export default makeXHRMock;
