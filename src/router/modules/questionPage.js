/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const questionPageRouter = {
  path: '/questionPage',
  component: Layout,
  redirect: '/questionPage/questionInfo',
  name: 'questionPage',
  meta: {
    title: '题库管理',
    icon: 'form',
    roles: ['ALL', 'editquestion']
  },
  children: [
    {
      path: 'questionInfo',
      component: () => import('@/views/questionPage/questionInfo'),
      name: 'questionInfo',
      meta: { title: '题库信息' }
    },
    {
      path: 'questionTypeInfo',
      component: () => import('@/views/questionPage/questionTypeInfo'),
      name: 'questionTypeInfo',
      meta: { title: '类型设置' }
    }
    /*
    {
      path: 'inline-edit-table',
      component: () => import('@/views/table/inline-edit-table'),
      name: 'InlineEditTable',
      meta: { title: 'Table 内编辑' }
    },
    {
      path: 'complex-table',
      component: () => import('@/views/table/complex-table'),
      name: 'ComplexTable',
      meta: { title: '综合 Table' }
    } */
  ]
}
export default questionPageRouter
