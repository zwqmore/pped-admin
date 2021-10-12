<template>
  <div class="components-container">
    <aside>drag-list base on
      <a href="https://github.com/SortableJS/Vue.Draggable" target="_blank">Vue.Draggable</a>
    </aside>

    <button @click="finish">完成</button>
    <button type="button" @click="open">打开</button>

    <div>
      <el-dialog title="权限" :visible.sync="isopen">
        <div class="editor-container">
          <dnd-list :list1="list1" :list2="list2" list1-title="List" list2-title="Article pool" />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isopen = false">
            取消
          </el-button>
          <el-button type="primary" @click="finish">
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>

  </div>

</template>

<script>
import DndList from '@/components/DndList'
import { fetchList } from '@/api/article'

export default {
  name: 'DndListDemo',
  components: { DndList },
  data() {
    return {
      isopen: false,
      list1: [],
      list2: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    open() {
      this.isopen = true
    },
    getData() {
      this.listLoading = true
      this.list1.push({
        id: 1,
        author: '12',
        title: 'editUser'
      })
      this.list1.push({
        id: 2,
        author: '112',
        title: 'editUser2'
      })
      this.list2.push({
        id: 3,
        author: '122',
        title: 'editUser3'
      })
      this.listLoading = false
    },
    finish() {
      this.isopen = false
      console.log('list1', this.list1)
      console.log('list2', this.list2)
    }
  }
}
</script>
