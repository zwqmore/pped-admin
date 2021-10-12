import request from '@/utils/request'
import passUtil from '@/utils/passUtil.js'
import storage from '@/utils/storage.js'
import { getToken, getId } from '@/utils/auth'

function getPKey() {
  // 获取前端RSA公钥密码、AES的key
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

export function getQuestionTypes(data) {
  getPKey()
  // console.log('getQuestionTypes')
  data.page = data.page * 1
  data.limit = data.limit * 1
  data.aid = getId() * 1
  data.token = getToken()
  data.id = data.id.toString()
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  // console.log(encData)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'managequestiontype/getquestiontypes',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function insertQuestionType(data) {
  getPKey()
  // console.log('insertQuestionType')
  data.aid = getId() * 1
  data.token = getToken()
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'managequestiontype/insertquestiontype',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function updateQuestionType(data) {
  getPKey()
  // console.log('updateQuestionType')
  data.aid = getId() * 1
  data.token = getToken()
  data.curTime = Date.parse(new Date())
  data.typeId = data.typeId * 1
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'managequestiontype/updatequestiontype',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function disabledQuestion(data) {
  getPKey()
  // console.log('disabledQuestion')
  data.aid = getId() * 1
  data.token = getToken()
  data.quesId = data.quesId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'managequestiontype/disabledquestion',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function abledQuestion(data) {
  getPKey()
  // console.log('abledQuestion')
  data.aid = getId() * 1
  data.token = getToken()
  data.quesId = data.quesId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'managequestiontype/abledquestion',
    method: 'put',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function deleteQuestionType(data) {
  getPKey()
  // console.log('deleteQuestionType')
  data.aid = getId() * 1
  data.token = getToken()
  data.typeId = data.typeId * 1
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'managequestiontype/deletequestiontype',
    method: 'delete',
    params: {},
    data: JSON.stringify(encData)
  })
}

export function getTypes() {
  getPKey()
  const data = {}
  // console.log('getTypes')
  data.aid = getId() * 1
  data.token = getToken()
  data.curTime = Date.parse(new Date())
  // console.log('senddata', data)
  const encData = enc(data)
  // console.log(encData)
  /* const sendData = JSON.stringify(encData) */
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: process.env.VUE_APP_BASE_API + 'managequestiontype/gettypes',
    method: 'post',
    params: {},
    data: JSON.stringify(encData)
  })
}
