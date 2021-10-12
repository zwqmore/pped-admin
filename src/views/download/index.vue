<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <!-- <a class="link-type link-title" target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/guide/advanced/theme.html">
        </a> -->
        <mallki class-name="mallki-text" text="每日一猿 pped" />
      </div>
      <div class="box-item">
        <span class="field-label">APP下载 : </span>
        <el-col class="text-center" style="padding-bottom: 40px;">
          <el-link target="_blank" :href="url" :underline="false" style="margin-left:15px">
            <button class="pan-btn green-btn">
              立即下载
            </button>
          </el-link>

        </el-col>
      </div>
    </el-card>

  </div>
</template>

<script>
import Mallki from '@/components/TextHoverEffect/Mallki'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
import { getDownload } from '@/api/public'

export default {
  name: 'Theme',
  components: { Mallki },
  data() {
    return {
      theme: false,
      url: process.env.VUE_APP_BASE_API + 'images/other/pped.apk'
      // url: process.env.VUE_APP_BASE_API + 'images/other/pped.apk'
      // url: 'http://localhost:8066/images/other/pped.apk'
    }
  },
  created() {
    getDownload().then(response => {
      this.url = response.obj
    })
  },
  methods: {
    download() {
      // console.log('down')
    }
  }
}
</script>

<style scoped>
.field-label{
  vertical-align: middle;
}
.box-card {
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
}

.block {
  padding: 30px 24px;
}

.tag-item {
  margin-right: 15px;
}
</style>
