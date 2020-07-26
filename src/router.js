import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import App from './app'

import { menuConfig as routerConfig } from './config/menu-config'

import ErrorPage from './components/404'
import LoginPage from './pages/login-page'

let routeList = [];

(function getRouter(list, key) {
    list.forEach((item, index) => {
        let Id = String(index)
        key ? Id += key : Id = String(index)
        if (item.children && item.children.length) {
            getRouter(item.children, Id)
        } else {
            routeList.push(<Route path={item.url} key={Id} component={item.component} />)
        }
    })
})(routerConfig)

routeList.concat([
    <Route path="*" key="-1" component={ErrorPage} />
])


export function getApp() {
    return (
        <Router history={browserHistory}>
            <Route path="/login" key="-2" component={LoginPage} />
            <Route path="" component={App}>
                {routeList}
            </Route>
        </Router>
    )
}
