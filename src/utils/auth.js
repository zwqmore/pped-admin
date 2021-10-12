import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const ID = 'Admin-Id'
const Roles = 'Admin-Roles'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getId() {
  return Cookies.get(ID)
}

export function setId(id) {
  return Cookies.set(ID, id)
}

export function removeId() {
  return Cookies.remove(ID)
}

export function getRoles() {
  return Cookies.get(Roles)
}

export function setRoles(roles) {
  return Cookies.set(Roles, roles)
}

export function removeRoles() {
  return Cookies.remove(Roles)
}
