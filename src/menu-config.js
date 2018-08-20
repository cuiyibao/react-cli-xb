import Home from './pages/home'
import God from './pages/god'
import Form from './pages/form'

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