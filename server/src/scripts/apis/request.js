import axios from 'axios';

const Request = ({ params = {}, method = 'get', path, data = null, baseURL, headers }) => {
  return new Promise((resolve, reject) => {
    const obj = {
      baseURL,
      url: path,
      method,
      params,
      headers
    };
    if (data) obj.data = data;
    axios(obj)
    .then((res) => {
      if (res.data) resolve(res.data);
      else resolve(null);
    })
    .catch(reject)
  })
}


export default Request;
