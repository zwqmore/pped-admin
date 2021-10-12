import Layout from '@/layout'

const auditPageRouter = {
  path: '/auditPage',
  component: Layout,
  redirect: '/auditPage/auditInfo',
  name: 'auditPage',
  meta: {
    title: '审核',
    icon: 'el-icon-s-check',
    roles: ['ALL', 'auditquestion']
  },
  children: [
    {
      path: 'auditInfo',
      component: () => import('@/views/auditPage/auditInfo'),
      name: 'auditInfo',
      meta: { title: '审核题目' }
    }
  ]
}
export default auditPageRouter
