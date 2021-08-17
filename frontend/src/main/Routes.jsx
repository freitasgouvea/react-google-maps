import React from 'react'
import { Switch, Route, Redirect } from 'react-router'

import Home from '../components/home/home'
import Map from '../components/map/map'
import SpotCrud from '../components/spot/spot'
import Traffic from '../components/traffic/traffic'

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/map' component={Map} />
        <Route path='/spot' component={SpotCrud} />
        <Route path='/traffic' component={Traffic} />
        <Redirect from='*' to='/' />
    </Switch>