<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        type="number"
        placeholder="ID"
        style="width: 100px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="名称"
        style="width: 200px;margin-left: 10px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.roleId"
        placeholder="角色"
        clearable
        style="width: 160px;margin-left: 10px;"
        class="filter-item"
      >
        <el-option v-for="item in roleIdOptions" :key="item.roleId" :label="item.name" :value="item.roleId" />
      </el-select>
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
          <span>{{ row.adminId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" min-width="130px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="roleId" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ roleFormat(row.roleId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="60">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ stateFormat(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createDate" sortable="custom" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="登录时间" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.loginDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <!-- ,$index -->
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" :disabled="row.roleId==1" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status==0" size="mini" :disabled="row.roleId==1" type="success" @click="abledAdmin(row)">
            解封
          </el-button>
          <el-button v-if="row.status==1" size="mini" :disabled="row.roleId==1" type="danger" @click="disabledAdmin(row)">
            禁用
          </el-button>
          <el-button size="mini" type="danger" :disabled="row.roleId==1" @click="deleteAdmin(row)">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form
        v-if="dialogStatus === 'update'"
        ref="updateDataForm"
        :rules="updateRules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" type="text" maxlength="12" show-word-limit />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="temp.roleId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in roleIdOptions2" :key="item.roleId" :label="item.name" :value="item.roleId" />
          </el-select>
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" type="text" maxlength="12" show-word-limit />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="temp.roleId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in roleIdOptions2" :key="item.roleId" :label="item.name" :value="item.roleId" />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input v-model="temp.pass" type="password" maxlength="16" show-word-limit />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
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
  getAdmins,
  insertAdmin,
  updateAdmin,
  disabledAdmin,
  abledAdmin,
  deleteAdmin
} from '@/api/adminManage'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        id: '',
        name: '',
        roleId: '',
        sort: '+id'
      },
      roleIdOptions: [],
      roleIdOptions2: [],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      updateRules: {
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        }],
        roleId: [{
          required: true,
          message: '角色不能为空',
          trigger: 'blur'
        }]
      },
      createRules: {
        name: [{
          required: true,
          message: '名称不能为空',
          trigger: 'blur'
        }],
        roleId: [{
          required: true,
          message: '角色不能为空',
          trigger: 'blur'
        }],
        pass: [{
          required: true,
          trigger: 'blur',
          validator: validatePassword
        }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
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
    stateFormat(row) {
      if (row === 0) {
        return '禁用'
      } else {
        return '正常'
      }
    },
    roleFormat(roleId) {
      const index = this.roleIdOptions.findIndex(v => v.roleId === roleId)
      return this.roleIdOptions[index].name
    },
    getList() {
      this.listLoading = true
      getAdmins(this.listQuery).then(response => {
        // console.log(response)
        this.roleIdOptions = response.list
        this.roleIdOptions2 = JSON.parse(JSON.stringify(response.list))
        const index2 = this.roleIdOptions.findIndex(v => v.roleId === 1)
        this.roleIdOptions2.splice(index2, 1)
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
    /* handleModifyStatus(row, status) {
        this.$message({
          message: '操作Success',
          type: 'success'
        })
        row.status = status
      }, */
    sortChange(data) {
      const {
        prop,
        order
      } = data
      // console.log(prop)
      // console.log(order)
      if (prop === 'id') {
        this.sortByID(order)
      }
      if (prop === 'createDate') {
        this.sortByCreateDate(order)
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
    sortByCreateDate(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+date'
      } else {
        this.listQuery.sort = '-date'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        name: '普通管理员',
        roleId: 2
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
          // console.log('createAdmin send', this.temp)
          const tempData = Object.assign({}, this.temp)
          insertAdmin(tempData).then(response => {
            // console.log('insertAdmin', response)
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
      /* 编辑某个人打开编辑窗口*/
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
          updateAdmin(tempData).then(response => {
            // console.log('update', response)
            if (response.success) {
              this.handleFilter()
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
    disabledAdmin(row) {
      // console.log('禁用id', row.adminId)
      this.$confirm('确定禁用管理员' + row.name + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.adminId = row.adminId
        disabledAdmin(data).then(response => {
          // console.log('disabledAdmin', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.adminId === row.adminId)
            // console.log('禁用后：', this.list[index])
            this.list[index].status = 0
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
    abledAdmin(row) {
      /* 解封*/
      // console.log('解封id', row.adminId)
      this.$confirm('确定为管理员' + row.name + '解封吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.adminId = row.adminId
        abledAdmin(data).then(response => {
          // console.log('abledAdmin', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.adminId === row.adminId)
            // console.log('解封后：', this.list[index])
            this.list[index].status = 1
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
    deleteAdmin(row) {
      /* 删除*/
      // console.log('删除id', row.adminId)
      this.$confirm('确定删除管理员' + row.name + '，并清除该管理员所有数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.adminId = row.adminId
        deleteAdmin(data).then(response => {
          // console.log('deleteAdmin', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.adminId === row.adminId)
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
        const tHeader = ['ID', '名称', '角色', '状态', '创建时间', '登录时间', '更新时间']
        const filterVal = ['adminId', 'name', 'roleId', 'status', 'createDate', 'loginDate', 'updateDate']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'pped-admin-table'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'roleId') {
          return this.roleFormat(v[j])
        } else if (j === 'status') {
          return this.stateFormat(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
