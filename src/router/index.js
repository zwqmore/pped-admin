import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import tableRouter from './modules/table'
import userPage from './modules/userPage.js'
import questionPageRouter from './modules/questionPage.js'
import auditPageRouter from './modules/auditPage.js'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基础页面
 * all roles can be accessed
 */
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect/index')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/auth-redirect',
  component: () => import('@/views/login/auth-redirect'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/error-page/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/error-page/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    name: 'Dashboard',
    meta: {
      title: '主页',
      icon: 'dashboard',
      affix: true
    }
  }]
},
{
  path: '/profile',
  component: Layout,
  redirect: '/profile/index',
  hidden: true,
  children: [{
    path: 'index',
    component: () => import('@/views/profile/index'),
    name: 'Profile',
    meta: {
      title: '个人信息',
      icon: 'user',
      noCache: true
    }
  }]
}
]

/**
 * asyncRoutes
 * 根据权限访问的页面
 */
export const asyncRoutes = [{
  path: '/permission',
  component: Layout,
  redirect: '/permission/page',
  alwaysShow: true, // will always show the root menu
  name: 'Permission',
  meta: {
    title: '权限',
    icon: 'lock',
    roles: ['ALL', 'permission']
  },
  children: [/* {
    path: 'page',
    component: () => import('@/views/permission/page'),
    name: 'PagePermission',
    meta: {
      title: '页面权限',
      roles: ['ALL', 'permission']
    }
  },
  {
    path: 'directive',
    component: () => import('@/views/permission/directive'),
    name: 'DirectivePermission',
    meta: {
      title: '指令权限',
      roles: ['ALL', 'permission']
      // if do not set roles, means: this page does not require permission
    }
  }, */
    {
      path: 'role',
      component: () => import('@/views/permission/role'),
      name: 'RolePermission',
      meta: {
        title: '角色权限',
        roles: ['ALL', 'permission']
      }
    }
  ]
},
{
  path: '/adminPage',
  component: Layout,
  redirect: '/adminPage/adminInfo',
  alwaysShow: true, // will always show the root menu
  name: 'AdminPage',
  meta: {
    title: '管理员',
    icon: 'el-icon-user-solid',
    roles: ['ALL', 'editadmin'] // you can set roles in root nav
  },
  children: [{
    path: 'adminInfo',
    component: () => import('@/views/adminPage/adminInfo'),
    name: 'adminInfo',
    meta: {
      title: '管理员信息',
      roles: ['ALL', 'editadmin']
    }
  }, {
    path: 'adminAction',
    component: () => import('@/views/adminPage/adminAction'),
    name: 'adminAction',
    meta: {
      title: '管理员操作记录',
      roles: ['ALL', 'editadmin']
    }
  }]
},

/** when your routing map is too long, you can split it into small modules **/
userPage,
questionPageRouter,
auditPageRouter,
/* componentsRouter, */
/* tableRouter, */

/* {
  path: '/example',
  component: Layout,
  redirect: '/example/list',
  name: 'Example',
  meta: {
    title: '综合实例',
    icon: 'el-icon-s-help'
  },
  children: [{
    path: 'create',
    component: () => import('@/views/example/create'),
    name: 'CreateArticle',
    meta: {
      title: '创建文章',
      icon: 'edit'
    }
  },
  {
    path: 'edit/:id(\\d+)',
    component: () => import('@/views/example/edit'),
    name: 'EditArticle',
    meta: {
      title: '编辑文章',
      noCache: true,
      activeMenu: '/example/list'
    },
    hidden: true
  },
  {
    path: 'list',
    component: () => import('@/views/example/list'),
    name: 'ArticleList',
    meta: {
      title: '文章列表',
      icon: 'list'
    }
  }
  ]
}, */
/* {
  path: '/error',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ErrorPages',
  meta: {
    title: '错误页面',
    icon: '404'
  },
  children: [{
    path: '401',
    component: () => import('@/views/error-page/401'),
    name: 'Page401',
    meta: {
      title: '401',
      noCache: true
    }
  },
  {
    path: '404',
    component: () => import('@/views/error-page/404'),
    name: 'Page404',
    meta: {
      title: '404',
      noCache: true
    }
  }
  ]
}, */

/* {
  path: '/error-log',
  component: Layout,
  children: [{
    path: 'log',
    component: () => import('@/views/error-log/index'),
    name: 'ErrorLog',
    meta: {
      title: '错误日志',
      icon: 'bug'
    }
  }]
}, */

/* {
  path: '/excel',
  component: Layout,
  redirect: '/excel/export-excel',
  name: 'Excel',
  meta: {
    title: 'Excel',
    icon: 'excel'
  },
  children: [{
    path: 'export-excel',
    component: () => import('@/views/excel/export-excel'),
    name: 'ExportExcel',
    meta: { title: '导出Excel' }
  },
  {
    path: 'export-selected-excel',
    component: () => import('@/views/excel/select-excel'),
    name: 'SelectExcel',
    meta: { title: '导出已选择项' }
  },
  {
    path: 'export-merge-header',
    component: () => import('@/views/excel/merge-header'),
    name: 'MergeHeader',
    meta: { title: '导出多级表头' }
  },
  {
    path: 'upload-excel',
    component: () => import('@/views/excel/upload-excel'),
    name: 'UploadExcel',
    meta: { title: '上传Excel' }
  }
  ]
}, */

{
  path: '/theme',
  component: Layout,
  children: [{
    path: 'index',
    component: () => import('@/views/theme/index'),
    name: 'Theme',
    meta: {
      title: '换肤',
      icon: 'theme'
    }
  }]
},
{
  path: '/download',
  component: Layout,
  children: [{
    path: 'index',
    component: () => import('@/views/download/index'),
    name: 'Download',
    meta: {
      title: 'APP下载',
      icon: 'el-icon-download'
    }
  }]
},

// 404 page must be placed at the end !!!
{
  path: '*',
  redirect: '/404',
  hidden: true
}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
