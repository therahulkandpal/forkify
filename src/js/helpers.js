import { TIMEOUT_SEC } from './config.js';

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${sec} second`));
    }, sec * 1000);
  });
};

export async function ajax(url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${response.status}: ${data.message}`);
    return data;
  } catch (err) {
    throw err;
  }
}

// export async function getJSON(url) {
//   try {
//     const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await response.json();

//     if (!response.ok) throw new Error(`${response.status}: ${data.message}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// }

// export async function putJSON(url, uploadData) {
//   try {
//     const fectchPromise = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(uploadData),
//     });
//     const response = await Promise.race([fectchPromise, timeout(TIMEOUT_SEC)]);
//     const data = await response.json();

//     if (!response.ok) throw new Error(`${response.status}: ${data.message}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// }
