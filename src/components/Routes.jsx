import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import Home from '../pages/Home'
import SeekTool from '../pages/SeekTool'
import Profile from '../pages/Profile'
import Detail from '../pages/Detail'
import Discover from '../pages/Discover'



const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={Home}/>
            <Route path='/home' component={Home}/>
            <Route path='/:name.bit' component={Detail}/>
            <Route path='/seek' exact component={SeekTool}/>
            <Route path='/dashboard' component={Dashboard}/>
            <Route path='/customers' component={Customers}/>
            <Route path='/profile/:name' component={Profile}/>
            <Route path='/discover' component={Discover}/>
            
            
        </Switch>
    )
}

export default Routes
