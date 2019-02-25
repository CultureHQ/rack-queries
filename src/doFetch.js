const doFetch = path => new Promise((resolve, reject) => {
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

export default doFetch;
