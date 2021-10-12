import request from '@/utils/request'
import passUtil from '@/utils/passUtil.js'
import storage from '@/utils/storage.js'

function getPKey() {
  // 获取前端RSA公钥密码、AES的key
  /* const genKeyPair = passUtil.rsaUtil.genKeyPair();
  storage.remove('jsPublicKey')
  storage.remove('jsPrivateKey')
  storage.set('jsPublicKey', genKeyPair.publicKey, 60 * 60 * 1)
  storage.set('jsPrivateKey', genKeyPair.privateKey, 60 * 60 * 1) */
  if (storage.get('jsPublicKey') && storage.get('jsPrivateKey')) {
    // console.log('已有公私钥')
    storage.remove('jsPublicKey')
    storage.remove('jsPrivateKey')
    const genKeyPair = passUtil.rsaUtil.genKeyPair()
    storage.set('jsPublicKey', genKeyPair.publicKey, 60 * 24 * 1)
    storage.set('jsPrivateKey', genKeyPair.privateKey, 60 * 24 * 1)
  } else {
    // console.log('前端公私钥')
    storage.remove('jsPublicKey')
    storage.remove('jsPrivateKey')
    const genKeyPair = passUtil.rsaUtil.genKeyPair()
    storage.set('jsPublicKey', genKeyPair.publicKey, 60 * 24 * 1)
    storage.set('jsPrivateKey', genKeyPair.privateKey, 60 * 24 * 1)
  }
}

function enc(data) {
  // 发送时加密
  const json = JSON.stringify(data)
  // console.log('over')
  return passUtil.encryptUtil(json, storage.get('publicKey'), storage.get('jsPublicKey')) // 数据，后端公key，前端公key
}

export function getPublicKey() {
  return request({
    url: process.env.VUE_APP_BASE_API + 'public/getpublickey',
    method: 'get',
    params: {}
  })
}

export function login(data) {
  getPKey()
  data.aid = data.username * 1
  data.curTime = Date.parse(new Date())
  const encData = enc(data)
  // console.log(encData)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'admin/loginadmin',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function getInfo(id, token) {
  getPKey()
  // console.log('getInfo,api')
  const data = {}
  data.aid = id * 1
  data.token = token
  data.curTime = Date.parse(new Date())
  const encData = enc(data)
  // console.log('encData', encData)
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'admin/getinfoadmin',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function logout(id, token) {
  getPKey()
  // console.log('logout,api')
  const data = {}
  data.aid = id * 1
  data.token = token
  data.curTime = Date.parse(new Date())
  const encData = enc(data)
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'admin/logoutadmin',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}

