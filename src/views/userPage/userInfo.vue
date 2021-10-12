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
        placeholder="昵称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.sex"
        placeholder="性别"
        clearable
        style="width: 90px;margin-left: 10px;"
        class="filter-item"
      >
        <el-option v-for="item in sexOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.city"
        placeholder="城市"
        clearable
        class="filter-item"
        style="width: 130px;margin-left: 10px;"
      >
        <!--        <el-option v-for="item in cityOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" /> -->
        <el-option v-for="item in cityOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" min-width="140px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.uname }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="性别" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" width="110">
        <template slot-scope="{row}">
          <span v-if="row.phone">{{ row.phone }}</span>
          <span v-else>未填写</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="170px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.email">{{ row.email }}</span>
          <span v-else>未填写</span>
        </template>
      </el-table-column>
      <el-table-column label="城市" width="90px" align="center">
        <template slot-scope="{row}">
          <span v-if="row.city">{{ row.city }}</span>
          <span v-else>未填写</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="Imp" width="80px">
        <template slot-scope="{row}">
          <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
        </template>
      </el-table-column> -->
      <el-table-column label="oppenid" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.oppenid">{{ row.oppenid }}</span>
          <span v-else>未注册</span>
        </template>
      </el-table-column>
      <el-table-column label="分数" align="center" width="90" prop="score" sortable="custom">
        <template slot-scope="{row}">
          <span v-if="row.score" class="link-type" @click="handleFetchPv(row.score)">{{ row.score }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="金币" align="center" width="90" prop="gold" sortable="custom">
        <template slot-scope="{row}">
          <span v-if="row.gold">{{ row.gold }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="60">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ stateFormat(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="注册时间" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.datein | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <!-- ,$index -->
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status==0" size="mini" type="success" @click="abledUser(row)">
            解封
          </el-button>
          <el-button v-if="row.status==1" size="mini" type="danger" @click="disabledUser(row)">
            封号
          </el-button>
          <el-button size="mini" type="danger" @click="deleteUser(row)">
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

        <el-form-item label="昵称" prop="uname">
          <el-input v-model="temp.uname" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="请选择">
            <el-option v-for="item in sexOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" type="text" maxlength="11" show-word-limit />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" type="email" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-select v-model="temp.city" class="filter-item" placeholder="请选择">
            <el-option v-for="item in cityOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="分数" prop="score">
          <el-input v-model="temp.score" type="number" />
        </el-form-item>
        <el-form-item label="金币" prop="gold">
          <el-input v-model="temp.gold" type="number" />
        </el-form-item>
        <!-- <el-form-item label="Date" prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item> -->

        <!-- <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item> -->
        <!-- <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item> -->
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

        <el-form-item label="昵称" prop="uname">
          <el-input v-model="temp.uname" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="请选择">
            <el-option v-for="item in sexOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" type="email" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" maxlength="16" show-word-limit />
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
  getUsers,
  insertUser,
  updateUser,
  disabledUser,
  abledUser,
  deleteUser
} from '@/api/userManage'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [{
  key: 'CN',
  display_name: 'China'
},
{
  key: 'US',
  display_name: 'USA'
},
{
  key: 'JP',
  display_name: 'Japan'
},
{
  key: 'EU',
  display_name: 'Eurozone'
}
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

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
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === null) {
        value = ''
      }
      if (!(value.length === 11 || value.length === 0)) {
        callback(new Error('手机号必须11位'))
      } else if (!this.checkNumber(value)) {
        callback(new Error('手机号有误'))
      } else {
        callback()
      }
    }
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
        sex: '',
        city: '',
        sort: '+id'
      },
      sexOptions: ['男', '女'],
      cityOptions: ['北京', '上海', '重庆'],
      /* calendarTypeOptions, */
      sortOptions: [{
        label: 'ID Ascending',
        key: '+id'
      }, {
        label: 'ID Descending',
        key: '-id'
      }],
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
        uname: [{
          required: true,
          message: '昵称不能为空',
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          trigger: 'blur',
          validator: validatePhone
        }]
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      createRules: {
        uname: [{
          required: true,
          message: '昵称不能为空',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '邮箱不能为空',
          trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '性别不能为空',
          trigger: 'blur'
        }],
        password: [{
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
        return '封号'
      } else {
        return '正常'
      }
    },
    getList() {
      this.listLoading = true
      getUsers(this.listQuery).then(response => {
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
      if (prop === 'score') {
        this.sortByScore(order)
      }
      if (prop === 'gold') {
        this.sortByGold(order)
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
    sortByScore(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+score'
      } else {
        this.listQuery.sort = '-score'
      }
      this.handleFilter()
    },
    sortByGold(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+gold'
      } else {
        this.listQuery.sort = '-gold'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        uname: '小白',
        sex: '男',
        email: '',
        password: ''
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
          // console.log('createUser send', this.temp)
          const tempData = Object.assign({}, this.temp)
          insertUser(tempData).then(response => {
            // console.log('insertUser', response)
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
          updateUser(tempData).then(response => {
            // console.log('update', response)
            if (response.success) {
              const index = this.list.findIndex(v => v.uid === this.temp.uid)
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
    disabledUser(row) {
      /* 封号*/
      // console.log('封号id', row.uid)
      this.$confirm('确定将用户' + row.uname + '封号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.uid = row.uid
        disabledUser(data).then(response => {
          // console.log('disabledUser', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.uid === row.uid)
            // console.log('封号后：', this.list[index])
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
    abledUser(row) {
      /* 解封*/
      // console.log('解封id', row.uid)
      this.$confirm('确定为用户' + row.uname + '解封吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.uid = row.uid
        abledUser(data).then(response => {
          // console.log('abledUser', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.uid === row.uid)
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
    deleteUser(row) {
      /* 删除*/
      // console.log('删除id', row.uid)
      this.$confirm('确定删除用户' + row.uname + '，并清除该用户所有数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.uid = row.uid
        deleteUser(data).then(response => {
          // console.log('deleteUser', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.uid === row.uid)
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
        const tHeader = ['ID', '昵称', '性别', '电话', '邮箱', '城市', 'oppenid', '分数', '金币', '状态']
        const filterVal = ['uid', 'uname', 'sex', 'phone', 'email', 'city', 'oppenid', 'score', 'gold', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'pped-user-table'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
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
