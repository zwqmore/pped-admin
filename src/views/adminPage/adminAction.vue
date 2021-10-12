<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        placeholder="管理员ID"
        style="width: 110px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.name"
        placeholder="管理员名称"
        style="width: 170px;margin-left: 10px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.acType"
        placeholder="操作类型"
        clearable
        style="width: 120px;margin-left: 10px;"
        class="filter-item"
      >
        <el-option v-for="item in acTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.contentType"
        placeholder="操作对象"
        clearable
        style="width: 120px;margin-left: 10px;"
        class="filter-item"
      >
        <el-option v-for="item in contentTypeOptions" :key="item" :label="item" :value="item" />
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
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        添加
      </el-button> -->
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
      <el-table-column label="管理员ID" prop="id" sortable="custom" align="center" width="110">
        <template slot-scope="{row}">
          <span>{{ row.adminId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理员名称" prop="name" width="110">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作类型" prop="acType" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.acType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作对象" prop="contentType" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.contentType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="acContent" minlength="210px">
        <template slot-scope="{row}">
          <span>{{ row.acContent }}</span>
        </template>
      </el-table-column>

      <el-table-column label="时间" prop="acDate" width="160px" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.acDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{}">
          <el-button type="primary" size="mini" :disabled="true">
            编辑
          </el-button>
          <el-button size="mini" type="danger" :disabled="true">
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
import { getAdminActionList } from '@/api/adminActionList'
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
      list: null,
      total: 0,
      listLoading: true,
      acTypeOptions: [
        'INSERT',
        'UPDATE',
        'DELETE',
        'OTHER'
      ],
      contentTypeOptions: [
        'USER',
        'QUESTION',
        'PERMISSION',
        'OTHER'
      ],
      listQuery: {
        page: 1,
        limit: 10,
        id: '',
        name: '',
        acType: '',
        contentType: '',
        sort: '-date'
      },
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      pvData: [],
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAdminActionList(this.listQuery).then(response => {
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
      if (prop === 'acDate') {
        this.sortAcDate(order)
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
    sortAcDate(order) {
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
        const tHeader = ['管理员ID', '管理员名称', '操作类型', '操作对象', '内容', '时间']
        const filterVal = ['adminId', 'name', 'acType', 'contentType', 'acContent', 'acDate']
        const data = this.formatJson(filterVal)
        // console.log('data', data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'pped-adminActionList-table'
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
