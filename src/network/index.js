import axios from 'axios'
import qs from 'qs'
import { baseUrl, rTab } from '../config/global-config'
import Mock from 'mockjs'
import { browserHistory } from 'react-router';

const config = {
    baseURL: baseUrl,
    timeout: 5000,
    // `withCredentials`指示是否跨站点访问控制请求
    // withCredentials: true,
    paramsSerializer: function paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'brackets' })
    },
}

export const net = axios.create(config)

//添加请求拦截器
net.interceptors.request.use(
    (request) => {
        return request
    }, ((error) => {
        Promise.reject(error)
    })
)

//添加响应拦截器
net.interceptors.response.use(
    (response) => {
        if (response.data.ec === 101) {
            browserHistory.push('/login')
            return
        }
        return Promise.resolve(response.data);
    }, ((error) => {
        return Promise.reject(error)
    })
)


export function request(mockData, ajax){
    return new Promise((resolve, reject) => {
        if(rTab){
            ajax(resolve)
        }else {
            resolve(Mock.mock(mockData))
        }
    })
}