<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getPublicKey } from '@/api/public'
import storage from '@/utils/storage.js'
export default {
  name: 'App',
  beforeCreate() {
    // console.log('beforeCreate')
    getPublicKey().then(response => {
      // console.log('getPublicKey')
      storage.remove('publicKey')
      storage.set('publicKey', response.obj, 60 * 24 * 1)
    }).catch(error => {
    })
    // console.log('createdafter')
    /* this.$store.dispatch('user/freshData')
    this.$store.dispatch('user/removeRsaKey')
    this.$store.dispatch('user/getPublicKey') */
  },
  created() {
    /* console.log('createAppvue')
    this.$store.dispatch('user/freshData')
    this.$store.dispatch('user/removeRsaKey')
    this.$store.dispatch('user/getPublicKey') */
  }
}
</script>
