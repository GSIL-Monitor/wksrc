import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
const _importMobile = require('./_import_mobile_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import MobileLayout from '@/mobileViews/layout/MobileLayout'
import DefaultLayout from '@/mobileViews/layout/DefaultLayout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/mobile/login', component: () => import('@/views/login/mobileLogin'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '/agent',
    component: Layout,
    redirect: '/agent/index',
    hidden: true,
    children: [{
      path: 'index',
      // name: 'agent-index',
      hidden: true,
      component: () => import('@/views/agent')
    }]
  },
  {
    path: '/mobile/agent',
    component: MobileLayout,
    redirect: '/mobile/agent/index',
    hidden: true,
    children: [{
      path: 'index',
      // name: 'agent-index',
      hidden: true,
      component: () => import('@/views/agent')
    }]
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    hidden: true,
    children: [
      {
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
    },
      {
      path: 'changePassword',
      component: () => import('@/components/User/changePassword'),
    }
  ]
  },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/guide/index'),
  //     name: 'guide',
  //     meta: { title: 'guide', icon: 'guide', noCache: true }
  //   }]
  // },
  {
    path: '/mobile',
    component: DefaultLayout,
    redirect: '/mobile/dashboard',
    name: '手机端首页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/mobileViews/dashboard/index')
    }]
  },
]

export default new Router({
  // mode: 'history', // 后端支持可开
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const mobileRouterMap = [
  {
    path: '/mobile',
    component: Layout,
    name: '手机端首页',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/mobileViews/dashboard/index'),
    }]
  }

]

export const asyncRouterMap = [
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/index',
    name: 'admin',
    alwaysShow: true,
    meta: {
      icon: 'user',
      title: '用户管理'
    },
    children: [
      {
        path: 'index',
        name: 'admin-index',
        component: _import('admin/Index'),
        meta: {
          title: '平台用户',
          icon: 'table'
        }
      },
      {
        path: 'user',
        name: 'user-index',
        // component: _import('admin/user'),
        component: () => import('@/views/admin/user'),
        meta: {
          title: '员工用户',
          icon: 'table'
        }
      },
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '/role/index',
    name: 'role',
    alwaysShow: true,
    meta: {
      icon: 'tab',
      title: '权限管理',
    },
    children: [
      {
        path: 'index',
        name: 'roleIndex',
        component: _import('role/Index'),
        meta: {
          title: '角色管理',
          icon: 'table'
        }
      },
      {
        path: 'permission',
        name: 'permission',
        component: _import('permission/Index'),
        meta: {
          title: '功能管理',
          icon: 'table'
        }
      }
    ]
  },

  {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    name: 'product',
    alwaysShow: true,
    meta: {
      icon: 'tab',
      title: '商品管理'
    },
    children: [
      {
        path: 'index',
        name: 'product-index',
        component: () => import('@/views/product/index'),
        meta: {
          title: '产品管理',
          icon: 'table'
        }
      },
      {
        path: 'category/index',
        name: 'product-category',
        component: () => import('@/views/product/category/index'),
        meta: {
          title: '分类管理',
          icon: 'table'
        }
      },
      {
        path: 'config/:sid/:id/:activeName',
        props: true,
        name: 'product-config',
        hidden: true,
        component: () => import('@/views/product/config'),
        meta: {
          title: '产品设置',
          icon: 'table'
        }
      },
      {
        path: 'create',
        props: true,
        name: 'product-create',
        hidden: true,
        component: () => import('@/views/product/create'),
        meta: {
          title: '新增产品',
          icon: 'table'
        }
      },
      {
        path: 'edit/:id',
        props: true,
        name: 'product-edit',
        hidden: true,
        component: () => import('@/views/product/edit'),
        meta: {
          title: '产品编辑',
          icon: 'table'
        }
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/index',
    name: 'shop',
    alwaysShow: true,
    meta: {
      icon: 'tab',
      title: '店铺管理'
    },
    children: [
      {
        path: 'index',
        name: 'shop-index',
        component: () => import('@/views/shop/index'),
        meta: {
          title: '店铺管理',
          icon: 'table'
        }
      },
      {
        path: 'area',
        name: 'shop-area',
        component: () => import('@/views/shop/area'),
        meta: {
          title: '店铺区域管理',
          icon: 'table'
        }
      },
      {
        path: 'workArea',
        name: 'work-area',
        component: () => import('@/views/shop/workArea'),
        meta: {
          title: '工作区域管理',
          icon: 'table'
        }
      },
      {
        path: 'desk',
        name: 'desk-index',
        component: () => import('@/views/shop/desk'),
        meta: {
          title: '餐桌(房间)管理',
          icon: 'table'
        }
      }
    ]
  },
    {
    path: '/customer',
    component: Layout,
    redirect: '/customer/index',
    name: 'customer',
    alwaysShow: true,
    meta: {
      icon: 'tab',
      title: '顾客会员管理'
    },
    children: [
      {
        path: 'index',
        name: 'customer-index',
        component: () => import('@/views/customer/index'),
        meta: {
          title: '顾客管理',
          icon: 'table'
        }
      },
      {
        path: 'batchTopup',
        name: 'batch-topup',
        component: () => import('@/views/customer/batchTopup'),
        meta: {
          title: '会员批量充值',
          icon: 'table'
        }
      },
      {
        path: 'loadBatchTpl',
        name: 'batch-load',
        hidden: true,
        component: () => import('@/views/customer/components/excelTeamplate'),
        meta: {
          title: '下载批量充值模板',
          icon: 'table'
        }
      },
      {
        path: 'address/:id',
        props:true,
        name: 'cust-addr',
        hidden: true,
        component: () => import('@/views/customer/components/address'),
        meta: {
          title: '管理顾客地址',
          icon: 'table'
        }
      },
      // {
      //   path: 'staffcfg',
      //   name: 'staff-cfg',
      //   component: () => import('@/views/customer/staffcfg'),
      //   meta: {
      //     title: '员工就餐设置',
      //     icon: 'table'
      //   }
      // },
      {
        path: 'members',
        name: 'customer-members',
        component: () => import('@/views/customer/members'),
        meta: {
          title: '会员设置',
          icon: 'table'
        }
      },
      {
        path:'moneyLog/:id',
        props:true,
        name:'customer-moneyLog',
        hidden: true,
        component:() =>import('@/views/customer/MoneyLog'),
        mate:{
          title:'金额记录',
          icon: 'table'
        }
      },
    ]
  },
    {
    path: '/print',
    component: Layout,
    redirect: '/print/index',
    name: 'print',
    alwaysShow: true,
    meta: {
      icon: 'tab',
      title: '打印管理'
    },
    children: [
      {
        path: 'index',
        name: 'print-index',
        component: () => import('@/views/print/index'),
        meta: {
          title: '打印机设置管理',
          icon: 'table'
        }
      },
      {
        path: 'ptemplate',
        name: 'print-template',
        component: () => import('@/views/print/ptemplate'),
        meta: {
          title: '打印模板管理',
          icon: 'table'
        }
      },
    ]
  },
  {
    path: '/payInfo',
    component: Layout,
    redirect: '/payInfo/index',
    name: 'payInfo',
    alwaysShow: true,
    meta: {
      icon: 'tab',
      title: '交易中心'
    },
    children: [
      {
        path: 'index',
        name: 'payInfo-index',
        component: () => import('@/views/pay/index'),
        meta: {
          title: '交易记录',
          icon: 'table'
        }
      },
      {
        path: 'invoice',
        name: 'payInfo-invoice',
        component: () => import('@/views/pay/invoice'),
        meta: {
          title: '发票记录',
          icon: 'table'
        }
      },
      {
        path: 'order',
        name: 'payInfo-order',
        component: () => import('@/views/pay/order'),
        meta: {
          title: '订单记录',
          icon: 'table'
        }
      },
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/index',
    name: 'data',
    alwaysShow: true,
    meta: {
      icon: 'tab',
      title: '数据统计'
    },
    children: [
      {
        path: 'index',
        name: 'data-index',
        component: () => import('@/views/data/revenue'),
        meta: {
          title: '营收统计',
          icon: 'table'
        }
      },
      {
        path: 'topupData',
        name: 'topup-data',
        component: () => import('@/views/data/topup'),
        meta: {
          title: '充值报表',
          icon: 'table'
        }
      },
      {
        path: 'cashier',
        name: 'data-cashier',
        component: () => import('@/views/data/cashier'),
        meta: {
          title: '收银交班',
          icon: 'table'
        }
      },
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/dictionary',
    name: 'system',
    alwaysShow: true,
    meta: {
      icon: 'table',
      title: '系统设置'
    },
    children: [
      {
        path: 'dictionary',
        name: 'system-dictionary',
        component: () => import('@/views/system/Dictionary/index'),
        meta: {
          title: '数据字典'
        }
      },
      {
        path: 'androidVersion',
        name: 'android-version',
        component: () => import('@/views/system/androidVersion'),
        meta: {
          title: '安卓版本发布',
          roles: ['admin']
        }
      }
    ]
  },


  // {
  //   path: '/teachmanage',
  //   component: Layout,
  //   redirect: '/teachmanage/session',
  //   name: 'teachermanage',
  //   alwaysShow: true,
  //   meta: {
  //     // roles: ['admin', 'user'],
  //     icon: 'tubiao',
  //     title: '教学过程管理'
  //   },
  //   children: [
  //     {
  //       path: 'session',
  //       name: 'teachermanage-session',
  //       component: _import('teachmanage/Session'),
  //       meta: {
  //         title: '学期管理',
  //         icon: 'zonghe'
  //       }
  //     }
  //   ]
  // }
  // ,
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [{
  //     path: 'page',
  //     component: () => import('@/views/permission/page'),
  //     name: 'pagePermission',
  //     meta: {
  //       title: 'pagePermission',
  //       roles: ['admin'] // or you can only set roles in sub nav
  //     }
  //   }, {
  //     path: 'directive',
  //     component: () => import('@/views/permission/directive'),
  //     name: 'directivePermission',
  //     meta: {
  //       title: 'directivePermission'
  //       // if do not set roles, means: this page does not require permission
  //     }
  //   }]
  // }
  // ,

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/svg-icons/index'),
  //     name: 'icons',
  //     meta: { title: 'icons', icon: 'icon', noCache: true }
  //   }]
  // },

  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'component-demo',
  //   meta: {
  //     title: 'components',
  //     icon: 'component'
  //   },
  //   children: [
  //     { path: 'tinymce', component: () => import('@/views/components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
  //     { path: 'markdown', component: () => import('@/views/components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
  //     { path: 'json-editor', component: () => import('@/views/components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
  //     { path: 'splitpane', component: () => import('@/views/components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
  //     { path: 'avatar-upload', component: () => import('@/views/components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
  //     { path: 'dropzone', component: () => import('@/views/components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
  //     { path: 'sticky', component: () => import('@/views/components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
  //     { path: 'count-to', component: () => import('@/views/components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
  //     { path: 'mixin', component: () => import('@/views/components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
  //     { path: 'back-to-top', component: () => import('@/views/components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
  //     { path: 'drag-dialog', component: () => import('@/views/components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
  //     { path: 'dnd-list', component: () => import('@/views/components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
  //     { path: 'drag-kanban', component: () => import('@/views/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
  //   ]
  // },

  // {
  //   path: '/charts',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'charts',
  //   meta: {
  //     title: 'charts',
  //     icon: 'chart'
  //   },
  //   children: [
  //     { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
  //     { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
  //     { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
  //   ]
  // }
  // ,

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/tab/index'),
  //     name: 'tab',
  //     meta: { title: 'tab', icon: 'tab' }
  //   }]
  // },

  // {
  //   path: '/table',
  //   component: Layout,
  //   redirect: '/table/complex-table',
  //   name: 'table',
  //   meta: {
  //     title: 'Table',
  //     icon: 'table'
  //   },
  //   children: [
  //     { path: 'dynamic-table', component: () => import('@/views/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
  //     { path: 'drag-table', component: () => import('@/views/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
  //     { path: 'inline-edit-table', component: () => import('@/views/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
  //     { path: 'tree-table', component: () => import('@/views/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
  //     { path: 'custom-tree-table', component: () => import('@/views/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
  //     { path: 'complex-table', component: () => import('@/views/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
  //   ]
  // },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'example',
  //   meta: {
  //     title: 'example',
  //     icon: 'example'
  //   },
  //   children: [
  //     { path: 'create', component: () => import('@/views/example/create'), name: 'createArticle', meta: { title: 'createArticle', icon: 'edit' }},
  //     { path: 'edit/:id(\\d+)', component: () => import('@/views/example/edit'), name: 'editArticle', meta: { title: 'editArticle', noCache: true }, hidden: true },
  //     { path: 'list', component: () => import('@/views/example/list'), name: 'articleList', meta: { title: 'articleList', icon: 'list' }}
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     { path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
  //     { path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'log', component: () => import('@/views/errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     { path: 'export-excel', component: () => import('@/views/excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
  //     { path: 'export-selected-excel', component: () => import('@/views/excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
  //     { path: 'upload-excel', component: () => import('@/views/excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
  //   ]
  // }
  // ,

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   meta: { title: 'zip', icon: 'zip' },
  //   children: [{ path: 'download', component: () => import('@/views/zip/index'), name: 'exportZip', meta: { title: 'exportZip' }}]
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'index', component: () => import('@/views/theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'index', component: () => import('@/views/clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  // },

  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [{ path: 'index', component: () => import('@/views/i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  // },

  /**
   * 手机端路由
   */
  {
    path: '/mobile/desk',
    component: MobileLayout,
    redirect: '/mobile/desk/index',
    name: 'm-desk-index',
    hidden: true,
    children: [
    {
      path: 'index',
      component: () => import('@/mobileViews/desk/index')
    },
    {
      path: 'deskBook/:id',
      component: () => import('@/mobileViews/desk/deskBook')
    },
  ]
  },

  {
    path: '/mobile/shop',
    component: MobileLayout,
    redirect: '/mobile/shop/index',
    name: 'm-shop-index',
    hidden: true,
    children: [
      {
        path: 'index/:type/:did',
        component: () => import('@/mobileViews/shop/pages/index/index')
      },
      {
        path: 'index/:type/:did/:oid',
        component: () => import('@/mobileViews/shop/pages/index/index')
      },
      {
        path: 'order',
        component: () => import('@/mobileViews/shop/pages/order/index')
      },
      {
        path: 'order/add/:did/:oid',
        component: () => import('@/mobileViews/shop/pages/order/add/index')
      },
      {
        path: 'order/detail',
        component: () => import('@/mobileViews/shop/pages/order/detail/index')
      },
      {
        path: 'order/list/:did',
        component: () => import('@/mobileViews/shop/pages/order/list/index')
      },
      {
        path: 'order/list',
        component: () => import('@/mobileViews/shop/pages/order/list/index')
      },
      {
        path: 'pay/:did/:oid',
        component: () => import('@/mobileViews/shop/pages/pay/index')
      },
      {
        path: 'pay/payed',
        component: () => import('@/mobileViews/shop/pages/pay/payed/index')
      }
    ]
  },


  {
    path:'/mobile/member',
    component:MobileLayout,
    hidden:true,
    children:[
      {
        path:'mopen',
        name:'member-open',
        component:() => import('@/mobileViews/member/open')
      },
      {
        path:'mtopup',
        name:'member-topup',
        component:() => import('@/mobileViews/member/topup')
      },
      {
        path:'mergeId',
        name:'merge-id',
        component:() => import('@/mobileViews/member/mergeId')
      },
      {
        path:'pay',
        component:() => import('@/mobileViews/member/pay/index')
      },
    ]
  },
  {
    path:'/mobile/userCentre',
    component:MobileLayout,
    hidden:true,
    children:[
      {
        path:'index',
        name:'user-centre',
        component:() => import('@/mobileViews/user/index')
      },
      
    ]
  },


  { path: '/mobile/*', redirect: '/404', hidden: true },
  { path: '*', redirect: '/404', hidden: true }

]
