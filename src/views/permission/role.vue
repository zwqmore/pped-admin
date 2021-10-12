<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        placeholder="ID"
        style="width: 110px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="角色"
        style="width: 170px;margin-left: 10px;"
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
      <el-table-column label="ID" prop="roleId" sortable="custom" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.roleId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="name" width="110">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" prop="createDate" width="160px" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" :disabled="row.roleId==1" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" :disabled="row.roleId==1" @click="deleteRole(row)">
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
        ref="updateDataForm"
        :rules="updateRules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 500px; margin-left:50px;"
      >

        <el-form-item label="角色" prop="name">
          <el-input v-model="temp.name" type="text" maxlength="12" show-word-limit />
        </el-form-item>
        <div class="editor-container">
          <dnd-list :list1="roleRight" :list2="allRight" list1-title="角色权限" list2-title="权限列表" />
        </div>

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
  </div>
</template>

<script>
import { fetchPv } from '@/api/article'
import { getRoles, getRight, getRights, updateRole, createRole, deleteRole } from '@/api/role'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import DndList from '@/components/DndList'

export default {
  name: 'ComplexTable',
  components: { Pagination, DndList },
  directives: { waves },
  filters: {},
  data() {
    return {
      roleRight: [],
      allRight: [],
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
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      pvData: [],
      downloadLoading: false,
      updateRules: {
        name: [{
          required: true,
          message: '名字不能为空',
          trigger: 'change'
        }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRoles(this.listQuery).then(response => {
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
    handleCreate() {
      const data = {}
      getRights(data).then(response => {
        // console.log('getRights', response)
        if (response.success) {
          this.roleRight = []
          this.allRight = response.obj
          /* 替换属性和过滤重复*/
          for (var i = 0; i < this.allRight.length; i++) {
            this.allRight[i].id = this.allRight[i].rightId
            this.allRight[i].title = this.allRight[i].name
          }
          this.dialogStatus = 'create'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            // dom元素更新后执行，因此这里能正确打印更改之后的值
            this.$refs['updateDataForm'].clearValidate()
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
    },
    handleUpdate(row) {
      const data = {}
      data.id = row.roleId
      this.temp = Object.assign({}, row)
      getRight(data).then(response => {
        // console.log('getRight', response)
        if (response.success) {
          this.roleRight = response.list
          this.allRight = response.obj
          /* 替换属性和过滤重复*/
          for (var i = 0; i < this.roleRight.length; i++) {
            this.roleRight[i].id = this.roleRight[i].rightId
            this.roleRight[i].title = this.roleRight[i].name
          }
          for (i = 0; i < this.allRight.length; i++) {
            this.allRight[i].id = this.allRight[i].rightId
            this.allRight[i].title = this.allRight[i].name
          }
          const idSet = this.roleRight.reduce((acc, v) => {
            acc[v.id] = true
            return acc
          }, {})
          this.allRight = this.allRight.filter(v => !idSet[v.id])
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            // dom元素更新后执行，因此这里能正确打印更改之后的值
            this.$refs['updateDataForm'].clearValidate()
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
    },
    createData() {
      this.$refs['updateDataForm'].validate(valid => {
        if (valid) {
          const tempData = { name: this.temp.name }
          // console.log(tempData)
          const rightIdList = []
          for (var i = 0; i < this.roleRight.length; i++) {
            rightIdList.push(this.roleRight[i].rightId)
          }
          tempData.roleIdList = rightIdList
          createRole(tempData).then(response => {
            // console.log('createRole', response)
            if (response.success) {
              this.handleFilter()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '创建成功',
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
    updateData() {
      this.$refs['updateDataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // console.log(tempData)
          const rightIdList = []
          for (var i = 0; i < this.roleRight.length; i++) {
            rightIdList.push(this.roleRight[i].rightId)
          }
          tempData.roleIdList = rightIdList
          updateRole(tempData).then(response => {
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
    sortChange(data) {
      const {
        prop,
        order
      } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
      if (prop === 'createDate') {
        this.sortCreateDate(order)
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
    sortCreateDate(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+date'
      } else {
        this.listQuery.sort = '-date'
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
    deleteRole(row) {
      /* 删除*/
      // console.log('删除id', row.roleId)
      this.$confirm('确定删除角色' + row.name + '，并清除该角色所有数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.roleId = row.roleId
        deleteRole(data).then(response => {
          // console.log('deleteRole', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.roleId === row.roleId)
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
        const tHeader = ['角色ID', '角色名', '创建时间']
        const filterVal = ['roleId', 'name', 'createDate']
        const data = this.formatJson(filterVal)
        // console.log('data', data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'pped-role-table'
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
