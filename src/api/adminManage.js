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

export function getAdmins(data) {
  getPKey()
  // console.log('getAdmins')
  data.page = data.page * 1
  data.limit = data.limit * 1
  data.aid = getId() * 1
  data.token = getToken()
  data.id = data.id.toString()
  data.roleId = data.roleId.toString()
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  // console.log(encData)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageadmin/getadmins',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function insertAdmin(data) {
  getPKey()
  // console.log('insertAdmin')
  data.aid = getId() * 1
  data.token = getToken()
  data.roleId = data.roleId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageadmin/insertadmin',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function updateAdmin(data) {
  getPKey()
  // console.log('updateAdmin')
  data.aid = getId() * 1
  data.token = getToken()
  data.id = data.adminId * 1
  data.roleId = data.roleId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageadmin/updateadmin',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function disabledAdmin(data) {
  getPKey()
  // console.log('disabledAdmin')
  data.aid = getId() * 1
  data.token = getToken()
  data.adminId = data.adminId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageadmin/disabledadmin',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function abledAdmin(data) {
  getPKey()
  // console.log('abledAdmin')
  data.aid = getId() * 1
  data.token = getToken()
  data.adminId = data.adminId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageadmin/abledadmin',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function deleteAdmin(data) {
  getPKey()
  // console.log('deleteAdmin')
  data.aid = getId() * 1
  data.token = getToken()
  data.adminId = data.adminId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageadmin/deleteadmin',
    method: 'delete',
    params: {},
    data: JSON.stringify(encData)
  })
}
