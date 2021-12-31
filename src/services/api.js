/*
 * @Description:
 * @Author: yuany
 * @Date: 2021-12-19 21:55:55
 * @LastEditors: yuany
 */
import { getCookie } from '@/helper'
import axios from 'axios'
import wsCache from '../plugins/storage'

let domain = wsCache.get('domain')
let username = wsCache.get('username')
let password = wsCache.get('password')

const getDomain = () => domain
const setDoamin = url => {
  domain = url
  wsCache.set('domain', domain)
  api.defaults.baseURL = domain
}

const getUserName = () => username
const setUserName = _username => {
  username = _username
  wsCache.set('username', username)
}

const getPassword = () => password
const setPassword = _password => {
  password = _password
  wsCache.set('password', password)
}

const api = axios.create({
  baseURL: domain
})

api.interceptors.request.use(async config => {
  let { data } = config
  var form = new FormData()
  for (let i in data) {
    form.append(i, data[i])
  }
  config.data = form
  let domain = getDomain()
  let { hostname } = new URL(domain)
  let token = (await getCookie(hostname, 'XSRF-TOKEN'))[0].value
  token = decodeURIComponent(token)
  token = token.replace(/=/gi, '')
  config.headers['X-XSRF-TOKEN'] = token
  return config
})

const init = (_domain = domain) => {
  return axios.post(_domain + '/api/Session::init').then(d => d.data)
}

const login = async (username, password) => {
  return api
    .post('/api/Session::login', {
      username,
      password
    })
    .then(d => d.data)
}

const logout = async (username, password) => {
  return api
    .post('/api/Session::logout', {
      username,
      password
    })
    .then(d => d.data)
}

const addPhoto = async data => {
  return api
    .post('/api/Photo::add', {
      0: data,
      albumID: 'public'
    })
    .then(d => d.data)
}

const getPhoto = photoID => {
  return api
    .post('/api/Photo::get', {
      photoID
    })
    .then(d => d.data)
}

export {
  getDomain,
  setDoamin,
  getUserName,
  setUserName,
  getPassword,
  setPassword,
  init,
  login,
  logout,
  addPhoto,
  getPhoto
}
