<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        placeholder="ID"
        style="width: 130px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="类型名"
        style="width: 200px;margin-left: 10px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        导出
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- :class-name="getSortClass('id')" -->
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="70">
        <template slot-scope="{row}">
          <span>{{ row.typeId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型名" min-width="140px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.typeName }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column prop="img" label="图标" align="center" width="90">
        <template slot-scope="{row}">
          <img :src="getImg(row.typeImg)" alt="" width="60" height="60">
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.typeFrom }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.typeDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column label="点击数" prop="hit" width="110px" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.hit }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="updateImg(row)">
            修改图标
          </el-button>
          <el-button size="mini" type="danger" @click="deleteQuestionType(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="dialogClose">

      <el-form
        v-if="dialogStatus === 'update'"
        ref="updateDataForm"
        :rules="updateRules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 500px; margin-left:50px;"
      >

        <el-form-item label="类型名" prop="typeName">
          <el-input v-model="temp.typeName" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="类型" prop="typeFrom">
          <el-input v-model="temp.typeFrom" type="text" maxlength="12" show-word-limit />
        </el-form-item>
        <el-form-item label="描述" prop="typeDesc">
          <el-input v-model="temp.typeDesc" type="textarea" maxlength="30" show-word-limit />
        </el-form-item>

      </el-form>

      <el-form
        v-if="dialogStatus === 'create'"
        ref="createDataForm"
        :rules="createRules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >

        <el-form-item label="类型名" prop="typeName">
          <el-input v-model="temp.typeName" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="类型" prop="typeFrom">
          <el-input v-model="temp.typeFrom" type="text" maxlength="12" show-word-limit />
        </el-form-item>
        <el-form-item label="描述" prop="typeDesc">
          <el-input v-model="temp.typeDesc" type="textarea" maxlength="30" show-word-limit />
        </el-form-item>

      </el-form>

      <el-upload
        v-if="dialogStatus === 'updateImg'"
        ref="upload"
        class="upload-demo"
        name="uploadFile"
        :data="updateImgData"
        :action="imgUrl"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :on-exceed="uploadOutNum"
        :multiple="false"
        :auto-upload="false"
        list-type="picture"
        accept=".png, .jpg"
        :limit="1"
        :before-upload="beforeAvatarUpload"
        :on-change="onChange"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button v-if="dialogStatus!='updateImg'" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPv } from '@/api/article'
import {
  getQuestionTypes,
  insertQuestionType,
  updateQuestionType,
  deleteQuestionType
} from '@/api/questionTypeManage'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import passUtil from '@/utils/passUtil.js'
import storage from '@/utils/storage.js'
import { getToken, getId } from '@/utils/auth'
import store from '@/store'
import { MessageBox } from 'element-ui'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info'
        // deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      updateImgTypeId: '',
      updateImgData: {},
      imgUrl: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        id: '',
        name: '',
        sort: '+id'
      },

      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        updateImg: 'Upload'
      },
      dialogPvVisible: false,
      pvData: [],
      updateRules: {
        typeName: [{
          required: true,
          message: '类型名不能为空',
          trigger: 'change'
        }],
        typeFrom: [{
          required: true,
          message: '类型不能为空',
          trigger: 'change'
        }],
        typeDesc: [{
          required: true,
          message: '描述不能为空',
          trigger: 'change'
        }]
      },
      createRules: {
        typeName: [{
          required: true,
          message: '类型名不能为空',
          trigger: 'change'
        }],
        typeFrom: [{
          required: true,
          message: '类型不能为空',
          trigger: 'change'
        }],
        typeDesc: [{
          required: true,
          message: '描述不能为空',
          trigger: 'change'
        }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getPKey() {
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
    },
    enc(data) {
      const json = JSON.stringify(data)
      // console.log('over')
      return passUtil.encryptUtil(json, storage.get('publicKey'), storage.get('jsPublicKey')) // 数据，后端公key，前端公key
    },
    dialogClose() {
      if (this.dialogStatus === 'updateImg') {
        this.$refs.upload.clearFiles()
      }
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadOutNum() {
      this.$message.warning('请先移出上传列表的图片')
    },
    beforeAvatarUpload(file) {
      // console.log(file)
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'png'
      const extension2 = testmsg === 'jpg'
      const isLt500KB = file.size / 1024 < 500
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 png、jpg格式!',
          type: 'warning'
        })
        return false
      }
      if (!isLt500KB) {
        this.$message({
          message: '上传文件大小不能超过 500KB!',
          type: 'warning'
        })
        return false
      }
      return extension || extension2 && isLt500KB
    },
    uploadSuccess(response, file, fileList) {
      // console.log('upsuccess')
      this.$refs.upload.clearFiles()
      // console.log(response)
      let res = {}
      if ('flag' in response) {
        if (!response.flag) {
          this.$message({
            message: response.msg,
            type: 'error'
          })
          return
        } else {
          const plainAes = passUtil.rsaUtil.decrypt(response.data.aesKey, storage.get('jsPrivateKey'))
          const plainData = passUtil.aesUtil.decrypt(response.data.data, plainAes)
          // console.log('解密后:', plainData)
          res = plainData
        }
      } else {
        res = response
      }
      //
      if (!res.success) {
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
        this.$message({
          message: response.data.msg,
          type: 'error'
        })
        return
      } else {
        this.handleFilter()
        this.$notify({
          title: 'Success',
          message: '操作成功',
          type: 'success',
          duration: 800
        })
        this.dialogFormVisible = false
      }
    },
    uploadError(err, file, fileList) {
      // console.log('uperror')
      this.$refs.upload.clearFiles()
      // console.log(err)
    },
    updateImg(row) {
      this.imgUrl = process.env.VUE_APP_BASE_API + 'managequestiontype/updateImg'
      this.updateImgData = {}
      this.updateImgTypeId = row.typeId
      this.dialogStatus = 'updateImg'
      this.dialogFormVisible = true
    },
    onChange(file, fileList) {
      // console.log('change', Object.keys(this.updateImgData).length)
      if (Object.keys(this.updateImgData).length === 0) {
        this.getPKey()
        // console.log('uploadData')
        const data = {}
        data.aid = getId() * 1
        data.token = getToken()
        data.typeId = this.updateImgTypeId * 1
        data.curTime = Date.parse(new Date())
        // console.log('senddata', data)
        const encData = this.enc(data)
        // console.log('encdata', encData)
        this.updateImgData.json = JSON.stringify(encData)
      }
    },
    getImg: function(path) {
      return process.env.VUE_APP_BASE_API + 'images/other/' + path
    },
    checkNumber: function(theObj) {
      if (theObj === '') {
        return true
      }
      var reg = /^[0-9]+\.?[0-9]*$/
      if (reg.test(theObj)) {
        return true
      }
      return false
    },

    getList() {
      this.listLoading = true
      getQuestionTypes(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.obj.list
        this.total = response.obj.total
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const {
        prop,
        order
      } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
      if (prop === 'hit') {
        this.sortByHit(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    sortByHit(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+hit'
      } else {
        this.listQuery.sort = '-hit'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        typeName: '',
        typeFrom: '',
        typeDesc: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['createDataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['createDataForm'].validate(valid => {
        if (valid) {
          // console.log('createQuestionType send', this.temp)
          const tempData = Object.assign({}, this.temp)
          insertQuestionType(tempData).then(response => {
            // console.log('insertQuestionType', response)
            if (response.success) {
              this.dialogFormVisible = false
              this.handleFilter()
              this.$notify({
                title: 'Success',
                message: '添加成功',
                type: 'success',
                duration: 800
              })
            } else {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Error',
                message: response.msg,
                type: 'error',
                duration: 1000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      /* 编辑某类型打开编辑窗口*/
      // //console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      // console.log(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // dom元素更新后执行，因此这里能正确打印更改之后的值
        this.$refs['updateDataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['updateDataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // console.log(tempData)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateQuestionType(tempData).then(response => {
            // console.log('update', response)
            if (response.success) {
              const index = this.list.findIndex(v => v.typeId === this.temp.typeId)
              // console.log('find', index)
              /* splice,删除位置，删除个数，添加对象*/
              this.list.splice(index, 1, this.temp)
              // console.log('list:', this.list)
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '更新成功',
                type: 'success',
                duration: 800
              })
            } else {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Error',
                message: response.msg,
                type: 'error',
                duration: 1000
              })
            }
          })
        }
      })
    },
    deleteQuestionType(row) {
      /* 删除*/
      // console.log('删除id', row.quesId)
      this.$confirm('确定删除类型：' + row.typeName + '，并清除该类型所有数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.typeId = row.typeId
        deleteQuestionType(data).then(response => {
          // console.log('deleteQuestionType', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.typeId === row.typeId)
            this.list.splice(index, 1)
            // console.log('删除后：', this.list[index])
          } else {
            this.$notify({
              title: 'Error',
              message: response.msg,
              type: 'error',
              duration: 1000
            })
          }
        })
      }).catch(() => {
        /* this.$message({
              type: 'info',
              message: '已取消'
            }); */
      })
    },

    /* 阅读统计*/
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '类型名', '类型', '描述', '图标', '点击量']
        const filterVal = ['typeId', 'typeName', 'typeFrom', 'typeDesc', 'typeImg', 'hit']
        const data = this.formatJson(filterVal)
        // console.log('data', data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'pped-question-type-table'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style type="text/css">
  .el-textarea__inner{
  padding: 5px 0 20px 0;
  }
</style>
