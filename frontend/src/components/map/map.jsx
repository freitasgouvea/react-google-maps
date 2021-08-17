import React, { Component } from 'react';
import Main from '../template/main'

const headerProps = {
    icon: 'map',
    title: 'Mapa',
    subtitle: 'home/map'
}

export default class Map extends Component {
    render() {
        return (
            <Main {...headerProps}>
                Mapa
            </Main>
        )
    }
}