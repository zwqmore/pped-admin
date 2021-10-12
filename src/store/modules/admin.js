import { login, logout, getInfo, getPublicKey } from '@/api/admin'
import { getToken, setToken, removeToken, setId, getId, removeId, setRoles, getRoles, removeRoles } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import storage from '@/utils/storage.js'

const state = {
  token: getToken(),
  id: getId(),
  name: '',
  lastLoginTime: '',
  role: '',
  avatar: process.env.VUE_APP_BASE_API + 'images/other/pped.png',
  introduction: '',
  roles: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_LASTLOGINTIME: (state, lastLoginTime) => {
    state.lastLoginTime = lastLoginTime
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // 进入时从local更新数据
  freshData({ commit }) {
    // console.log('freshData')
    if (storage.get('adminInfo')) {
      // console.log('hasadmininfo')
      const adminInfo = storage.get('adminInfo')
      // console.log('storage,adminInfo', adminInfo)

      if ('name' in adminInfo) {
        commit('SET_NAME', storage.get('adminInfo').name)
      }

      if ('lastLoginTime' in adminInfo) {
        commit('SET_LASTLOGINTIME', storage.get('adminInfo').lastLoginTime)
      }

      if ('role' in adminInfo) {
        commit('SET_ROLE', storage.get('adminInfo').role)
      }
    }
  },
  // 移出rsa的key
  removeRsaKey() {
    // console.log('remove')
    storage.remove('jsPublicKey')
    storage.remove('jsPrivateKey')
  },
  // get publicKey
  getPublicKey() {
    getPublicKey().then(response => {
      storage.remove('publicKey')
      storage.set('publicKey', response.obj, 60 * 24 * 1)
    }).catch(error => {
    })
  },
  // admin login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        // console.log('actionsLogin', response)
        commit('SET_TOKEN', response.list[0])
        commit('SET_ID', response.obj.aid)
        commit('SET_LASTLOGINTIME', response.obj.loginDate)
        // console.log('adminInfo', state)
        setToken(response.list[0])
        setId(response.obj.aid)
        const adminInfo = {}
        adminInfo.lastLoginTime = response.obj.loginDate
        storage.set('adminInfo', adminInfo)
        resolve()
      }).catch(error => {
        // console.log('actionsLoin', '失败')
        // console.log(error)
        reject(error)
      })
    })
  },

  // get admin info
  getInfo({ commit, state }) {
    // console.log('getinfo,router')
    // console.log('state', state)
    return new Promise((resolve, reject) => {
      getInfo(getId(), getToken()).then(response => {
        // console.log('storeData', response)

        if (!response.success) {
          reject('信息个人获取失败，请重新登录')
        }
        // console.log('1')
        // roles must be a non-empty array
        if (!response.obj.roles || response.obj.roles.length <= 0) {
          reject('没有权限！')
        }
        commit('SET_ROLES', response.obj.roles)
        commit('SET_NAME', response.obj.name)
        commit('SET_ROLE', response.obj.role)
        setRoles(response.obj.roles)
        var adminInfo = storage.get('adminInfo')
        // console.log('admin', adminInfo)
        adminInfo.name = response.obj.name
        adminInfo.role = response.obj.role
        storage.set('adminInfo', adminInfo)
        // console.log('getInfo返回成功')
        resolve(response.obj)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // admin logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(getId(), getToken()).then(() => {
        // console.log('退出登录，清理信息')
        commit('SET_TOKEN', '')
        commit('SET_ID', 0)
        commit('SET_ROLES', [])
        removeToken()
        removeRoles()
        removeId()
        // console.log(state)
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    // console.log('changeRoles')
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
