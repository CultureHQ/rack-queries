const makeXHRMock = makeResponse => {
  const xhr = {
    open: (method, path) => {
      xhr.path = path;
    },
    send: () => {
      xhr.responseText = JSON.stringify(makeResponse(xhr.path));
      xhr.onreadystatechange();
    },
    status: 200,
    readyState: 4
  };

  return xhr;
};

export default makeXHRMock;
