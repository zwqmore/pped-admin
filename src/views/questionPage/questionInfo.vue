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
          <span>{{ row.quesId }}</span>
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
      <el-table-column label="解析" width="110px">
        <template slot-scope="{row}">
          <span v-if="row.analysis">{{ row.analysis }}</span>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="70px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.quesTime }}s</span>
        </template>
      </el-table-column>
      <el-table-column label="答题数" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.trueNum+row.falseNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="正确率" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.trueNum * 100/(row.trueNum+row.falseNum) }}%</span>
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
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status==0" size="mini" type="success" @click="abledQuestion(row)">
            上架
          </el-button>
          <el-button v-if="row.status==1" size="mini" type="danger" @click="disabledQuestion(row)">
            下架
          </el-button>
          <el-button size="mini" type="danger" @click="deleteQuestion(row)">
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
        style="width: 500px; margin-left:50px;"
      >

        <el-form-item label="问题" prop="quesName">
          <el-input v-model="temp.quesName" type="textarea" maxlength="40" show-word-limit />
        </el-form-item>
        <el-form-item label="类型" prop="typeId">
          <el-select v-model="temp.typeId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typesList" :key="item.typeId" :label="item.typeFrom" :value="item.typeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="A选项" prop="quesA">
          <el-input v-model="temp.quesA" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="B选项" prop="quesB">
          <el-input v-model="temp.quesB" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="C选项" prop="quesC">
          <el-input v-model="temp.quesC" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="D选项" prop="quesD">
          <el-input v-model="temp.quesD" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-select v-model="temp.answer" class="filter-item" placeholder="请选择">
            <el-option v-for="item in answerOptions" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="解析" prop="analysis">
          <el-input v-model="temp.analysis" type="textarea" maxlength="40" show-word-limit />
        </el-form-item>
        <el-form-item label="时间" prop="quesTime">
          <el-input v-model="temp.quesTime" type="number" />
        </el-form-item>

      </el-form>

      <el-form
        v-if="dialogStatus === 'create'"
        ref="createDataForm"
        :rules="createRules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 500px; margin-left:50px;"
      >

        <el-form-item label="问题" prop="quesName">
          <el-input v-model="temp.quesName" type="textarea" maxlength="40" show-word-limit />
        </el-form-item>
        <el-form-item label="类型" prop="typeId">
          <el-select v-model="temp.typeId" class="filter-item" placeholder="请选择">
            <el-option v-for="item in typesList" :key="item.typeId" :label="item.typeFrom" :value="item.typeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="A选项" prop="quesA">
          <el-input v-model="temp.quesA" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="B选项" prop="quesB">
          <el-input v-model="temp.quesB" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="C选项" prop="quesC">
          <el-input v-model="temp.quesC" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="D选项" prop="quesD">
          <el-input v-model="temp.quesD" type="text" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-select v-model="temp.answer" class="filter-item" placeholder="请选择">
            <el-option v-for="item in answerOptions" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="解析" prop="analysis">
          <el-input v-model="temp.analysis" type="textarea" maxlength="40" show-word-limit />
        </el-form-item>
        <el-form-item label="时间" prop="quesTime">
          <el-input v-model="temp.quesTime" type="number" />
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
  getQuestions,
  insertQuestion,
  updateQuestion,
  abledQuestion,
  disabledQuestion,
  deleteQuestion
} from '@/api/questionManage'
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
        0: 'info'
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
        sort: '+id'
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
      cityOptions: ['北京', '上海', '重庆'],
      /* calendarTypeOptions, */
      statusOptions: [{
        id: 0,
        value: '失效'
      },
      {
        id: 1,
        value: '生效'
      }
      ],
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
        quesName: [{
          required: true,
          message: '问题不能为空',
          trigger: 'change'
        }],
        typeId: [{
          required: true,
          message: '类型不能为空',
          trigger: 'change'
        }],
        quesA: [{
          required: true,
          message: '选项不能为空',
          trigger: 'change'
        }],
        quesB: [{
          required: true,
          message: '选项不能为空',
          trigger: 'change'
        }],
        quesC: [{
          required: true,
          message: '选项不能为空',
          trigger: 'change'
        }],
        quesD: [{
          required: true,
          message: '选项不能为空',
          trigger: 'change'
        }],
        answer: [{
          required: true,
          message: '答案不能为空',
          trigger: 'change'
        }],
        quesTime: [{
          required: true,
          message: '答题时间不能为空',
          trigger: 'change'
        }]
      },
      createRules: {
        quesName: [{
          required: true,
          message: '问题不能为空',
          trigger: 'change'
        }],
        typeId: [{
          required: true,
          message: '类型不能为空',
          trigger: 'change'
        }],
        quesA: [{
          required: true,
          message: '选项不能为空',
          trigger: 'change'
        }],
        quesB: [{
          required: true,
          message: '选项不能为空',
          trigger: 'change'
        }],
        quesC: [{
          required: true,
          message: '选项不能为空',
          trigger: 'change'
        }],
        quesD: [{
          required: true,
          message: '选项不能为空',
          trigger: 'change'
        }],
        answer: [{
          required: true,
          message: '答案不能为空',
          trigger: 'change'
        }],
        quesTime: [{
          required: true,
          message: '答题时间不能为空',
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
        return '失效'
      } else {
        return '生效'
      }
    },
    getList() {
      this.listLoading = true
      getQuestions(this.listQuery).then(response => {
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
        quesName: '',
        typeId: '',
        quesA: '',
        quesB: '',
        quesC: '',
        quesD: '',
        analysis: '',
        quesTime: 10,
        answer: '1'
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
          // console.log('createQuestion send', this.temp)
          const tempData = Object.assign({}, this.temp)
          insertQuestion(tempData).then(response => {
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
      if (!this.temp.analysis) {
        this.temp.analysis = ''
      }
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
          updateQuestion(tempData).then(response => {
            // console.log('update', response)
            if (response.success) {
              const index = this.list.findIndex(v => v.quesId === this.temp.quesId)
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
    disabledQuestion(row) {
      /* 下架*/
      // console.log('下架id', row.quesId)
      this.$confirm('确定下架问题' + row.quesId + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.quesId = row.quesId
        disabledQuestion(data).then(response => {
          // console.log('disabledQuestion', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.quesId === row.quesId)
            // console.log('下架后：', this.list[index])
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
    abledQuestion(row) {
      /* 上架*/
      // console.log('上架id', row.quesId)
      this.$confirm('确定上架问题' + row.quesId + '吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.quesId = row.quesId
        abledQuestion(data).then(response => {
          // console.log('abledQuestion', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.quesId === row.quesId)
            // console.log('上架后：', this.list[index])
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
    deleteQuestion(row) {
      /* 删除*/
      // console.log('删除id', row.quesId)
      this.$confirm('确定删除问题' + row.quesName + '，并清除该问题所有数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {}
        data.quesId = row.quesId
        deleteQuestion(data).then(response => {
          // console.log('deleteQuestion', response)
          if (response.success) {
            this.$notify({
              title: 'Success',
              message: '操作成功',
              type: 'success',
              duration: 800
            })
            const index = this.list.findIndex(v => v.quesId === row.quesId)
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
  padding: 5px 0 20px 0;
  }
</style>
