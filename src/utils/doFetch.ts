const doFetch = <T extends {}>(path: string) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4) {
      return;
    }

    if (xhr.status >= 200 && xhr.status < 300) {
      resolve(JSON.parse(xhr.responseText) as T);
    } else {
      reject(new Error(xhr.responseText));
    }
  };

  xhr.open("GET", `${document.body.dataset.scriptName}/${path}`);
  xhr.send();
});

export default doFetch;
