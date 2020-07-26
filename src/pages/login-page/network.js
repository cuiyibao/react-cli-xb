import { request, net } from '../../network'

export function postLogin(params) {
    return new Promise((resolve, reject) => {
        net.post('/api/login', params).then((data) => {
            console.log('@#$data', res)
        })
    })
}