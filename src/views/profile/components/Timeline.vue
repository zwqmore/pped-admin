<template>
  <div class="block">
    <el-timeline v-loading="listLoading">
      <el-timeline-item v-for="(item,index) of list" :key="index" :timestamp="item.acDate" placement="top">
        <el-card>
          <h4>{{ item.acType }} {{ item.contentType }}</h4>
          <p>{{ item.acContent }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getActionList } from '@/api/adminActionList.js'
export default {
  data() {
    return {
      listLoading: true,
      list: [],
      timeline: [
        {
          title: '添加题目',
          content: '添加题目，编号：433',
          date: '2019/4/20 20:46'
        },
        {
          title: '更新用户信息',
          content: '更新用户信息，用户id:45',
          date: '2019/4/21 20:46'
        },
        {
          title: '删除题目',
          content: '删除题目，编号：122',
          date: '2019/4/22 20:46'
        },
        {
          title: 'Release New Version',
          content: 'PanJiaChen committed',
          date: '2019/4/23 20:46'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getActionList().then(response => {
        // console.log(response)
        this.list = response.obj
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    }
  }
}
</script>
