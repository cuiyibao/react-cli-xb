import asyncComponent from '../utils/asyncComponent'
const HomePage = asyncComponent(() => import('../pages/home-page'))
// const LoginPage = asyncComponent(() => import('../pages/login-page'))

// export const menuConfig = [{
//     title: '主页',
//     url: '/',
//     component: Home
// }, {
//     title: '列表展示',
//     url: '/list',
//     children: [{
//         title: '商品',
//         url: '/list/god',
//         component: God,
//     },{
//         title: '表单',
//         url: "/list/form",
//         component: Form,
//     }]
// }]

export const menuConfig = [{
    key: 'home',
    title: '首页',
    url: '/',
    component: HomePage
}]