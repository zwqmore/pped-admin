import CryptoJS from 'crypto-js'
import JSEncrypt from './jsencrypt.js'
// var util = require('http://localhost:8066/pmp/images/util/jsencrypt.js')
// import * as echarts from 'http://localhost:8066/pmp/images/util/jsencrypt.js';
/**
 * 简单封装一下
 */
// var JSEncrypt;
// //创建XMLHttpRequst对象
// var xhr = new XMLHttpRequest();

// // console.log(xhr); //输出所创建里包含的东西
// //
// // 打开文件
// // open(请求方式type,访问文件url/file,是否异步async)
// xhr.open('get', 'http://localhost:8066/pmp/images/util/jsencrypt.js', false);

// //两种请求方式:onload/onreadystatechange
// //onload 方式:
// xhr.onload = function() {
// 	//输出一下请求返回的文本
// 	// console.log(this.responseText);
// 	JSEncrypt = this.responseText
// 	// console.log(JSEncrypt)
// }
// //
// //onreadystatechange  方式
// /*xhr.onreadystatechange = function(){
//    console.log(this.responseText)
// }*/

// //发送请求
// xhr.send();

var aesUtil = {
  // 随机获取key，
  genKey: function(length = 16) {
    const random = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let str = ''
    for (let i = 0; i < length; i++) {
      str = str + random.charAt(Math.random() * random.length)
    }
    return str
  },

  // 加密
  encrypt: function(plaintext, key) {
    if (plaintext instanceof Object) {
      // JSON.stringify
      plaintext = JSON.stringify(plaintext)
    }
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plaintext), CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
  },

  // 解密
  decrypt: function(ciphertext, key) {
    const decrypt = CryptoJS.AES.decrypt(ciphertext, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    let decString = CryptoJS.enc.Utf8.stringify(decrypt).toString()
    if (decString.charAt(0) === '{' || decString.charAt(0) === '[') {
      // JSON.parse
      decString = JSON.parse(decString)
    }
    return decString
  }
}

/**
 * 简单封装一下
 */
const rsaUtil = {
  // RSA 位数，这里要跟后端对应
  bits: 1024,

  // 当前JSEncrypted对象
  thisKeyPair: {},

  // 生成密钥对(公钥和私钥)
  genKeyPair: function(bits = rsaUtil.bits) {
    const genKeyPair = {}
    // console.log('jsjsjsjsjsjjs')
    // console.log(JSEncrypt);
    rsaUtil.thisKeyPair = new JSEncrypt({ default_key_size: bits })
    // 获取私钥
    genKeyPair.privateKey = rsaUtil.thisKeyPair.getPrivateKey()
    // 获取公钥
    genKeyPair.publicKey = rsaUtil.thisKeyPair.getPublicKey()
    return genKeyPair
  },

  // 公钥加密
  encrypt: function(plaintext, publicKey) {
    if (plaintext instanceof Object) {
      // 1、JSON.stringify
      plaintext = JSON.stringify(plaintext)
    }
    publicKey && rsaUtil.thisKeyPair.setPublicKey(publicKey)
    return rsaUtil.thisKeyPair.encrypt(plaintext)
  },
  // 私钥解密
  decrypt: function(ciphertext, privateKey) {
    privateKey && rsaUtil.thisKeyPair.setPrivateKey(privateKey)
    let decString = rsaUtil.thisKeyPair.decrypt(ciphertext)
    if (decString.charAt(0) === '{' || decString.charAt(0) === '[') {
      // JSON.parse
      decString = JSON.parse(decString)
    }
    return decString
  }

}

// 具体数据解密工具
function decryptUtil(res, privateKey) {
  var plainAes = rsaUtil.decrypt(res.data.data.aesKey, privateKey)
  var plainData = aesUtil.decrypt(res.data.data.data, plainAes)
  return plainData
}

// 具体数据加密工具
function encryptUtil(json, publicKey1, publicKey2) {
  var genKey = aesUtil.genKey()
  var cipherData = aesUtil.encrypt(json, genKey)
  var cipherAesKey = rsaUtil.encrypt(genKey, publicKey1)
  var plainData = {
    'data': cipherData,
    'aesKey': cipherAesKey,
    'publicKey': publicKey2
  }
  return plainData
}

export default {
  // 导出函数，getUsers是vue调用getUsers()函数的接口
  aesUtil,
  rsaUtil,
  decryptUtil,
  encryptUtil
}
