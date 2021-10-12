import request from '@/utils/request'
import passUtil from '@/utils/passUtil.js'
import storage from '@/utils/storage.js'
import { getToken, getId } from '@/utils/auth'

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
    storage.set('jsPublicKey', genKeyPair.publicKey, 60 * 60 * 24 * 1)
    storage.set('jsPrivateKey', genKeyPair.privateKey, 60 * 60 * 24 * 1)
  } else {
    // console.log('前端公私钥')
    storage.remove('jsPublicKey')
    storage.remove('jsPrivateKey')
    const genKeyPair = passUtil.rsaUtil.genKeyPair()
    storage.set('jsPublicKey', genKeyPair.publicKey, 60 * 60 * 24 * 1)
    storage.set('jsPrivateKey', genKeyPair.privateKey, 60 * 60 * 24 * 1)
  }
}

function enc(data) {
  // 发送时加密
  const json = JSON.stringify(data)
  // console.log('over')
  return passUtil.encryptUtil(json, storage.get('publicKey'), storage.get('jsPublicKey')) // 数据，后端公key，前端公key
}

export function getUsers(data) {
  getPKey()
  // console.log('getUsers')
  data.page = data.page * 1
  data.limit = data.limit * 1
  data.aid = getId() * 1
  data.token = getToken()
  data.id = data.id.toString()
  data.curTime = Date.parse(new Date())
  // console.log('senddata',data)
  const encData = enc(data)
  // console.log(encData)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageuser/getusers',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function insertUser(data) {
  getPKey()
  // console.log('insertUser')
  data.aid = getId() * 1
  data.token = getToken()
  data.curTime = Date.parse(new Date())
  // console.log('senddata',data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageuser/insertuser',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function updateUser(data) {
  getPKey()
  // console.log('updateuser')
  data.aid = getId() * 1
  data.token = getToken()
  data.uid = data.uid * 1
  data.gold = data.gold * 1
  data.score = data.score * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata',data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageuser/updateuser',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function disabledUser(data) {
  getPKey()
  // console.log('disabledUser')
  data.aid = getId() * 1
  data.token = getToken()
  data.uid = data.uid * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata',data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageuser/disableduser',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function abledUser(data) {
  getPKey()
  // console.log('abledUser')
  data.aid = getId() * 1
  data.token = getToken()
  data.uid = data.uid * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata',data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageuser/ableduser',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function deleteUser(data) {
  getPKey()
  // console.log('deleteUser')
  data.aid = getId() * 1
  data.token = getToken()
  data.uid = data.uid * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata',data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageuser/deleteuser',
    method: 'delete',
    params: {},
    data: JSON.stringify(encData)
  })
}
