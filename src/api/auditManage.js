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

export function getAudits(data) {
  getPKey()
  // console.log('getAudits')
  data.page = data.page * 1
  data.limit = data.limit * 1
  data.aid = getId() * 1
  data.token = getToken()
  data.id = data.id.toString()
  data.typeId = data.typeId.toString()
  data.status = data.status.toString()
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  // console.log(encData)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageaudit/getaudits',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function auditOut(data) {
  getPKey()
  // console.log('auditOut')
  data.aid = getId() * 1
  data.token = getToken()
  data.auditId = data.auditId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageaudit/auditout',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function auditPass(data) {
  getPKey()
  // console.log('auditPass')
  data.aid = getId() * 1
  data.token = getToken()
  data.auditId = data.auditId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageaudit/auditpass',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function deleteAudit(data) {
  getPKey()
  // console.log('deleteAudit')
  data.aid = getId() * 1
  data.token = getToken()
  data.auditId = data.auditId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'manageaudit/deleteaudit',
    method: 'delete',
    params: {},
    data: JSON.stringify(encData)
  })
}
