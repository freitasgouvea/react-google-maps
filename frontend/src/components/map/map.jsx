import React, { Component } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios'
import Main from '../template/main'
import { Loader } from '@googlemaps/js-api-loader';

import iconSpot from '../../assets/imgs/place.svg'
import iconReport from '../../assets/imgs/warning.svg'

const headerProps = {
    icon: 'map',
    title: 'Mapa',
    subtitle: '/map'
}

const baseUrl = 'http://localhost:3001/spots'

const loader = new Loader({
    apiKey: "AIzaSyBTdaly7le-SH4H3nEofhl2UEWWYpX0WJE",
    version: "weekly",
    libraries: ["places"]
});

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spot: { type: '', address: '', cordinates: { lat: '', lng: '' }, maxHeight: '' },
            list: [],
            google: '',
            map: ''
        };
    }
    componentDidMount() {
        axios(baseUrl).then(resp => {
            resp.data.sort((a, b) => b.id - a.id);
            this.setState({ list: resp.data })
        })
        this.initMap()
    }
    initMap() {
        const defaultMapOptions = {
            center: {
                lat: -23.5489,
                lng: -46.6388
            },
            zoom: 12
        };
        loader.load().then((google) => {
            var map = new google.maps.Map(
                this.googleMapDiv,
                defaultMapOptions);
            if (this.state.list !== undefined && this.state.list.length >= 1) {
                for (const i of this.state.list) {
                    let imageIcon
                    if (i.type === 'spot') {
                        imageIcon = iconSpot
                    }
                    if (i.type === 'report') {
                        imageIcon = iconReport
                    }
                    const marker = new google.maps.Marker({
                        position: i.cordinates,
                        map,
                        title: i.address,
                        icon: imageIcon
                    });
                    const contentString =
                        '<div id="content">' +
                        '<div id="siteNotice">' +
                        "</div>" +
                        `<h5 id="firstHeading" class="firstHeading">${i.type}</h5>` +
                        '<div id="bodyContent">' +
                        `<p>endereço: <b>${i.address}</b></p>` +
                        `<p>latitude: <b>${i.cordinates.lat}</b></p>` +
                        `<p>longitude: <b>${i.cordinates.lng}</b></p>` +
                        `<p>altura: <b>${i.maxHeight}</b></p>` +
                        "</div>" +
                        "</div>";
                    const infowindow = new google.maps.InfoWindow({
                        content: contentString,
                    });
                    marker.addListener("click", () => {
                        infowindow.open({
                            anchor: marker,
                            map,
                            shouldFocus: true,
                        });
                    });
                }
            }
            this.setState({
                google: google,
                map: map
            });
        });
    }
    filter(event) {
        let list
        axios(baseUrl).then(resp => {
            list = resp.data
            this.setState({ list })
            if (event.target.value === null || event.target.value === 'all') {
                this.initMap()
            } else {
                list = this.state.list.filter(spot => spot.type === event.target.value)
                this.setState({ list })
                this.initMap()
            }
        })
    }
    render() {
        return (
            <Main {...headerProps}>
                <div className="row">
                    <div className="col-8 col-md-8">
                        <div className="form-group row align-items-center">
                            <label className="col-3 mt-2" for="filter">Filrar por tipo: </label>
                            <select className="form-control col-9" name="filter" onChange={e => this.filter(e)}>
                                <option value="all">Todos</option>
                                <option value="spot">Pontos</option>
                                <option value="report">Incidentes</option>
                            </select>
                        </div>
                    </div>
                    {/* <div className="col-1 col-md-1"></div>
                    <div className="col-2 col-md-2">
                        <div className="form-group row align-items-right">
                            <button className="btn btn-success" onClick={this.initMap}>Carregar Mapa</button>
                        </div>
                    </div>
                    <div className="col-1 col-md-1"></div> */}
                </div>
                <div ref={(ref) => { this.googleMapDiv = ref }} style={{ height: '66vh', width: '100%' }}></div>
            </Main>
        )
    }
}