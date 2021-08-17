import React, { Component } from 'react';
import axios from 'axios'
import Main from '../template/main'
import { Loader } from '@googlemaps/js-api-loader';

const headerProps = {
    icon: 'car',
    title: 'Trânsito',
    subtitle: '/traffic'
}

const baseUrl = 'http://localhost:3001/spots'

const loader = new Loader({
    apiKey: "AIzaSyBTdaly7le-SH4H3nEofhl2UEWWYpX0WJE",
    version: "weekly",
    libraries: ["places"]
});

export default class Traffic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spot: { type: '', address: '', cordinates: { lat: '', lng: '' }, maxHeight: '' },
            list: []
        };
    }
    componentDidMount() {
        axios(baseUrl).then(resp => {
            resp.data.sort((a, b) => b.id - a.id);
            this.setState({ list: resp.data })
        })
        const defaultMapOptions = {
            center: {
                lat: -23.5489,
                lng: -46.6388
            },
            zoom: 12
        };
        loader.load().then((google) => {
            const map = new google.maps.Map(
                this.googleMapDiv,
                defaultMapOptions);
            const trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
            this.setState({
                google: google,
                map: map
            });
        });
    }
    render() {
        return (
            <Main {...headerProps}>
                <div ref={(ref) => { this.googleMapDiv = ref }} style={{ height: '66vh', width: '100%' }}></div>
            </Main>
        )
    }
}