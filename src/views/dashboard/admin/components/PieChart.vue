<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '340px'
    },
    pieData: { type: Array }
  },
  data() {
    return { chart: null }
  },
  watch: {
    pieData: {
      deep: true,
      handler(val) {
        this.setOption(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // console.log('data', this.pieData)
      // console.log('nam', this.pieName)
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOption(this.pieData)
    },
    setOption(pieData) {
      const pieName = pieData.map(item => {
        return item.typeName
      })
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '1',
          data: pieName
        },
        series: [
          {
            name: '类型作答数',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: pieData,
            animationEasing: 'cubicInOut',
            animationDuration: 4600
          }
        ]
      })
    }

  }
}
</script>
