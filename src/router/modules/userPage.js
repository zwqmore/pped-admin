/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const userPageRouter = {
  path: '/userPage',
  component: Layout,
  redirect: '/userPage/userInfo',
  name: 'userPage',
  meta: {
    title: '用户管理',
    icon: 'peoples',
    roles: ['ALL', 'edituser']
  },
  children: [
    {
      path: 'userInfo',
      component: () => import('@/views/userPage/userInfo'),
      name: 'userInfo',
      meta: { title: '用户信息' }
    }
    /* {
      path: 'drag-table',
      component: () => import('@/views/table/drag-table'),
      name: 'DragTable',
      meta: { title: '拖拽 Table' }
    },
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
export default userPageRouter
