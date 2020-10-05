import axios from 'axios'

import _ from 'lodash'

import Geohash from 'latlon-geohash'

import Kfs from 'key-file-storage'

const kfs = Kfs('./storage')

const getHeaders = (sessionId: string) => {
  let headers: any = {
    'l-device-info':
      '2345F7CE-AD3D-4E49-B010-35DFA02A9913;appStore;2;2960130123;2436x1125',
    'Content-Type': 'application/json',
    'l-locale': 'en_US',
    accept: 'application/json',
    'l-time-zone': 'Europe/Paris',
    'accept-language': 'en-us',
    'accept-encoding': 'br, gzip, deflate',
    'l-app-category': '1',
    'user-agent':
      'Grindr3/6.15.0.16944.22944 (16944.22944; iPhone_X; iOS 13.6)',
    'content-length': '95',
  }
  if (sessionId) {
    headers = {
      'l-device-info':
        '2345A7CE-AD3D-4E49-B010-35DFA02A9913;appStore;2;2960130123;2436x1125',
      'l-locale': 'en_US',
      accept: 'application/json',
      authorization: `Grindr3 ${sessionId}`,
      'l-time-zone': 'Europe/Paris',
      'accept-language': 'en-us',
      'accept-encoding': 'br, gzip, deflate',
      'l-app-category': '1',
      'user-agent':
        'Grindr3/6.15.0.16944.22944 (16944.22944; iPhone_X; iOS 13.6)',
    }
  }
  return headers
}

const request = ({ params = {}, creds, method = 'get', path, body = null }) => {
  console.log('fc:request')
  const sessionId = creds ? kfs[creds.email].sessionId : null
  console.log(path)
  return new Promise((resolve, reject) => {
    const obj = {
      baseURL: 'https://grindr.mobi',
      url: path,
      method,
      params,
      headers: getHeaders(sessionId),
    }

    if (body) obj.data = body

    axios(obj)
      .then((res) => {
        if (res.data) {
          resolve(res.data)
        } else {
          resolve(null)
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          // too much
          console.log(err.response)
          console.log('Too much, wait')
          setTimeout(() => reject(err), 20 * 60 * 1000)
        } else {
          reject(err)
        }
      })
  })
}

const signInThenMakeRequest = (resolve, reject, props) => {
  console.log('fc:signInThenMakeRequest')
  const { creds } = props

  signIn({
    email: kfs[creds.email].email,
    password: kfs[creds.email].password,
  })
    .then(() => {
      request(props).then(resolve).catch(reject)
    })
    .catch(reject)
}

const authedRequest = (props) => {
  console.log('fc:authedRequest')
  const { creds } = props

  if (!kfs[creds.email]) {
    kfs[creds.email] = creds
  }

  const sessionId = kfs[creds.email].sessionId

  if (!sessionId && props.path !== '/v3/sessions') {
    return new Promise((resolve, reject) => {
      signInThenMakeRequest(resolve, reject, props)
    })
  }

  console.log('fc:authedRequest-2')

  return new Promise((resolve, reject) => {
    request(props)
      .then(resolve)
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Unauthorized
          console.log('Unauthorized => re-signing in')
          signInThenMakeRequest(resolve, reject, props)
        } else {
          reject(error)
        }
      })
  })
}

const getms = () => new Date().getTime()

export const signIn = ({ email, authToken, password }) => {
  console.log('fc:signIn')
  const body = {
    email: email,
    token: getms().toString() + '.' + _.random(100, 999),
  }

  if (authToken) body.authToken = authToken

  if (password) body.password = password
  return new Promise((resolve, reject) => {
    request({
      path: '/v3/sessions',
      method: 'post',
      body,
    })
      .then((res) => {
        console.log('signed in')

        console.log(res.sessionId, 'ses')
        kfs[email] = {
          ...kfs[email],
          sessionId: res.sessionId,
        }
        setTimeout(resolve, 1000)
      })
      .catch(reject)
  })
}

// v5/profiles/nearby

export const getLocations = ({ latlng, creds, params = {} }) => {
  console.log('fc:getLocations')
  const geohash = Geohash.encode(latlng[0], latlng[1], 12)

  return authedRequest({
    path: `/v4/locations/${geohash}/profiles`,
    creds,
    params: {
      pageNumber: 1,
      ...params,
    },
  })
}

// images https://cdns.grindr.com/images/profile/1024x1024/mediaID

export const getProfile = ({ profileId }) => {
  return authedRequest({
    path: `v4/profiles/${profileId}`,
  })
}
