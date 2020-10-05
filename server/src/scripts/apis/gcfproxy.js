import axios from 'axios';

const request = ({ method = 'get', url, body = null }) => {
  return new Promise((resolve, reject) => {
    const obj = {
      url,
      method
    };
    if (body) obj.data = body;
    axios(obj)
    .then((res) => {
      if (res.data) resolve(res.data);
      else resolve(null);
    })
    .catch(reject)
  })
}

const ProxyRequest = ({ reqProps, proxyURL }) => {
  return new Promise((resolve, reject) => {
    request({
      url: proxyURL,
      method: 'post',
      body: reqProps
    })
    .then((d) => {
      console.log(d);
      resolve(d.data);
    })
    .catch((e) => {
      console.log(e);
      reject(e.error);
    });
  })
}

export default ProxyRequest;
