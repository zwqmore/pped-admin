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
        placeholder="问题"
        style="width: 200px;margin-left: 10px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.typeId"
        placeholder="类型"
        clearable
        style="width: 90px;margin-left: 10px;"
        class="filter-item"
      >
        <el-option v-for="item in typesList" :key="item.typeId" :label="item.typeFrom" :value="item.typeId" />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 130px;margin-left: 10px;"
      >
        <el-option v-for="item in statusOptions" :key="item.id" :label="item.value" :value="item.id" />
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
          <span>{{ row.auditId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问题" min-width="140px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.quesName }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="类型" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ typeIdFormat(row.typeId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="选项A" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.quesA }}</span>
        </template>
      </el-table-column>
      <el-table-column label="选项B" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.quesB }}</span>
        </template>
      </el-table-column>
      <el-table-column label="选项C" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.quesC }}</span>
        </template>
      </el-table-column>
      <el-table-column label="选项D" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.quesD }}</span>
        </template>
      </el-table-column>
      <el-table-column label="答案" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ answerFormat(row.answer) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="70px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.quesTime }}s</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="80">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ stateFormat(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" prop="dateIn" sortable="custom" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.dateIn | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="dateUpdate" sortable="custom" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.dateUpdate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="row.status!=1" size="mini" type="success" @click="auditPass(row)">
            通过
          </el-button>
          <el-button v-if="row.status==0" size="mini" type="danger" @click="handleOut(row)">
            否决
          </el-button>
          <el-button size="mini" type="danger" @click="deleteAudit(row)">
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
        v-if="dialogStatus === 'auditOut'"
        ref="DataForm"
        :rules="auditOutRules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 500px; margin-left:50px;"
      >
        <el-form-item label="否决原因" prop="reply">
          <el-input v-model="temp.reply" type="textarea" maxlength="40" show-word-limit />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='auditOut'?auditOut():auditOut()">
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
  getAudits,
  auditOut,
  auditPass,
  deleteAudit
} from '@/api/auditManage'
import waves from '@/directive/waves' // waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'info',
        2: 'danger'
        // deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      typesList: null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        id: '',
        name: '',
        typeId: '',
        status: '',
        sort: '-date'
      },
      answerOptions: [{
        id: '1',
        value: 'A'
      },
      {
        id: '2',
        value: 'B'
      },
      {
        id: '3',
        value: 'C'
      },
      {
        id: '4',
        value: 'D'
      }
      ],
      /* calendarTypeOptions, */
      statusOptions: [{
        id: 0,
        value: '未审核'
      },
      {
        id: 1,
        value: '通过'
      },
      {
        id: 2,
        value: '未通过'
      }
      ],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        auditOut: 'reject'
      },
      dialogPvVisible: false,
      pvData: [],
      auditOutRules: { reply: [{ required: false }] },
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
    typeIdFormat(typeId) {
      const index = this.typesList.findIndex(v => v.typeId === typeId)
      return this.typesList[index].typeFrom
    },
    answerFormat(id) {
      if (id === '1') {
        return 'A'
      } else if (id === '2') {
        return 'B'
      } else if (id === '3') {
        return 'C'
      } else {
        return 'D'
      }
    },
    stateFormat(row) {
      if (row === 0) {
        return '未审核'
      } else if (row === 1) {
        return '通过'
      } else {
        return '未通过'
      }
    },
    getList() {
      this.listLoading = true
      getAudits(this.listQuery).then(response => {
        // console.log(response)
        this.typesList = response.list
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
      // console.log(prop)
      // console.log(order)
      if (prop === 'id') {
        this.sortByID(order)
      }
      if (prop === 'dateIn') {
        this.sortByDateIn(order)
      } else if (prop === 'dateUpdate') {
        this.sortByDateUpdate(order)
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
    sortByDateIn(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+dateIn'
      } else {
        this.listQuery.sort = '-dateIn'
      }
      this.handleFilter()
    },
    sortByDateUpdate(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+dateUpdate'
      } else {
        this.listQuery.sort = '-dateUpdate'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        quesName: '',
        typeId: '',
        quesA: '',
        quesB: '',
        quesC: '',
        quesD: '',
        quesTime: 10,
        answer: '1'
      }
    },
    handleOut(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.reply = ''
      // console.log(this.temp)
      this.dialogStatus = 'auditOut'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        // dom元素更新后执行，因此这里能正确打印更改之后的值
        this.$refs['DataForm'].clearValidate()
      })
    },
    auditOut(row) {
      /* 否决*/
      this.$refs['DataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // console.log(tempData)
          const data = {}
          data.auditId = tempData.auditId
          data.reply = tempData.reply
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          auditOut(data).then(response => {
            // console.log('auditOut', response)
            if (response.success) {
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: '更新成功',
                type: 'success',
                duration: 800
              })
              this.handleFilter()
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
    auditPass(row) {
      /* 通过*/
      // console.log('通过id', row.auditId)
      this.$confirm('确定通过并上架问题' + row.auditId + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.auditId = row.auditId
        auditPass(data).then(response => {
          // console.log('auditPass', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            this.handleFilter()
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
    deleteAudit(row) {
      /* 删除*/
      // console.log('删除id', row.auditId)
      this.$confirm('确定删除待审核问题:' + row.quesName, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.auditId = row.auditId
        deleteAudit(data).then(response => {
          // console.log('deleteAudit', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.auditId === row.auditId)
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
        const tHeader = ['ID', '题目', '类型', '选项A', '选项B', '选项C', '选项D',
          '答案', '时间', '正确数', '错误数', '状态', '创建时间', '下架时间', '更新时间']
        const filterVal = ['quesId', 'quesName', 'typeId', 'quesA', 'quesB',
          'quesC', 'quesD', 'answer', 'quesTime', 'trueNum', 'falseNum', 'status', 'quesDatein', 'quesDateout', 'quesDateupdate']
        const data = this.formatJson(filterVal)
        // console.log('data', data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'pped-question-table'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      /* return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      })) */
      const excelList = this.list
      return excelList.map(v => filterVal.map(j => {
        if (j === 'typeId') {
          return this.typeIdFormat(v[j])
        } else if (j === 'answer') {
          return this.answerFormat(v[j])
        } else if (j === 'quesTime') {
          return v[j] + 's'
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

<style type="text/css">
  .el-textarea__inner{
  padding: 5px 0 40px 0;
  }
</style>
