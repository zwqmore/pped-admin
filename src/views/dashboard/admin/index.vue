<template>
  <div class="dashboard-editor-container">
    <github-corner class="github-corner" :git-url="gitUrl" />

    <panel-group :visits="876" :messages="2332" :purchases="34" :exercises="54342" @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" :title="title" />
    </el-row>

    <el-row :gutter="32">
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>-->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :pie-data="pieData" :pie-name="pieName" />
        </div>
      </el-col>

      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-left: 200px; margin-bottom:30px;">
        <box-card />
      </el-col>
      <!-- <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col> -->
    </el-row>

    <el-row :gutter="8">
      <!-- <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col> -->
      <!-- <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col> -->

    </el-row>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
/* import RaddarChart from './components/RaddarChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList' */
import BoxCard from './components/BoxCard'
import { getCensus } from '@/api/census'
import { getTypes } from '@/api/questionTypeManage'
import { getGit } from '@/api/public'

/* const lineChartData = {
  peoples: {
    lastData: [100, 120, 161, 134, 105, 160, 165, 122, 154, 198, 122],
    nowData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    lastData: [200, 192, 120, 144, 160, 130, 140],
    nowData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    lastData: [80, 100, 121, 104, 105, 90, 100],
    nowData: [120, 90, 100, 138, 142, 130, 130]
  },
  exercises: {
    lastData: [130, 140, 141, 142, 145, 150, 160],
    nowData: [120, 82, 91, 154, 162, 140, 130]
  }
} */

export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    PieChart,
    BoxCard
    /* RaddarChart,
    BarChart,
    TransactionTable,
    TodoList */
  },
  data() {
    return {
      gitUrl: '#',
      title: '',
      pieData: [],
      pieName: [],
      listData: {
        peoples: {
          lastData: [],
          nowData: []
        },
        messages: {
          lastData: [],
          nowData: []
        },
        purchases: {
          lastData: [],
          nowData: []
        },
        exercises: {
          lastData: [],
          nowData: []
        }
      },
      lineChartData: {}
    }
  },
  created() {
    this.getCen()
  },
  methods: {
    async getCen() {
      // console.log('1start')
      getCensus().then(response => {
        // console.log('getCensus', response)
        if (response.success) {
          this.listData.peoples.lastData = response.obj.lastPeoplesList.map(item => {
            return item.number
          })
          this.listData.peoples.nowData = response.obj.nowPeoplesList.map(item => {
            return item.number
          })
          this.listData.messages.lastData = response.obj.lastMessagesList.map(item => {
            return item.number
          })
          this.listData.messages.nowData = response.obj.nowMessagesList.map(item => {
            return item.number
          })
          this.listData.purchases.lastData = response.obj.lastPurchasesList.map(item => {
            return item.number
          })
          this.listData.purchases.nowData = response.obj.nowPurchasesList.map(item => {
            return item.number
          })
          this.listData.exercises.lastData = response.obj.lastExercisesList.map(item => {
            return item.number
          })
          this.listData.exercises.nowData = response.obj.nowExercisesList.map(item => {
            return item.number
          })
          this.lineChartData = this.listData.peoples
          this.title = '访问人数'
          this.getType()
        } else {
          this.$notify({
            title: 'Error',
            message: response.msg,
            type: 'error',
            duration: 1000
          })
          this.getType()
        }
      })
    },
    async getType() {
      getTypes().then(response => {
        // console.log('getTypes', response)
        if (response.success) {
          this.pieData = response.obj.map(item => {
            const data = {}
            data.name = item.typeName
            data.value = item.hit
            return data
          })
          this.pieName = response.obj.map(item => {
            return item.typeName
          })
          // console.log('da:', this.pieData)
          // console.log('nam:', this.pieName)
        } else {
          this.$notify({
            title: 'Error',
            message: response.msg,
            type: 'error',
            duration: 1000
          })
        }
        this.getGit()
      })
    },
    async getGit() {
      getGit().then(response => {
        this.gitUrl = response.obj
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = this.listData[type]
      if (type === 'peoples') {
        this.title = '访问人数'
      } else if (type === 'messages') {
        this.title = '互动次数'
      } else if (type === 'exercises') {
        this.title = '答题数目'
      } else if (type === 'purchases') {
        this.title = '消费量'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    width: 500px;
    background: #ffffff;
    margin-top: 0px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
