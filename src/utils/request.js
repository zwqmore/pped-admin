import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import passUtil from '@/utils/passUtil.js'
import storage from '@/utils/storage.js'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    /* if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    } */
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    /* console.log('response最原始:', response.data) */
    let res = {}
    if ('flag' in response.data) {
      if (!response.data.flag) {
        Message({
          message: response.data.msg || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(response.data.msg || 'Error'))
      } else {
        const plainAes = passUtil.rsaUtil.decrypt(response.data.data.aesKey, storage.get('jsPrivateKey'))
        const plainData = passUtil.aesUtil.decrypt(response.data.data.data, plainAes)
        /* console.log('解密后:', plainData) */
        res = plainData
      }
    } else {
      res = response.data
    }

    // if the custom code is not 20000, it is judged as an error.
    if (!res.success) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 5009 || res.code === 5010 || res.code === 5013) {
        // to re-login
        MessageBox.confirm('身份信息异常，请重新登录!', '提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      /* console.log('yes') */
      return res
    }
  },
  error => {
    // console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
