import asyncComponent from '../utils/asyncComponent'
const Home = asyncComponent(() => import('../pages/home'))
const God = asyncComponent(() => import('../pages/god'))
const Form = asyncComponent(() => import('../pages/form'))

export const menuConfig = [{
    title: '主页',
    url: '/',
    component: Home
}, {
    title: '列表展示',
    url: '/list',
    children: [{
        title: '商品',
        url: '/list/god',
        component: God,
    },{
        title: '表单',
        url: "/list/form",
        component: Form,
    }]
}]