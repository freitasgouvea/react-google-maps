import React, { Component } from 'react';
import axios from 'axios'
import Main from '../template/main'
import { Loader } from '@googlemaps/js-api-loader';

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
            const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
            for (const i of this.state.list) {
                const marker = new google.maps.Marker({
                    position: i.cordinates,
                    map,
                    title: i.address,
                    icon: image
                });
                const contentString =
                    '<div id="content">' +
                    '<div id="siteNotice">' +
                    "</div>" +
                    '<h1 id="firstHeading" class="firstHeading"></h1>' +
                    '<div id="bodyContent">' +
                    "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
                    "sandstone rock formation in the southern part of the " +
                    "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
                    "south west of the nearest large town, Alice Springs; 450&#160;km " +
                    "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
                    "features of the Uluru - Kata Tjuta National Park. Uluru is " +
                    "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
                    "Aboriginal people of the area. It has many springs, waterholes, " +
                    "rock caves and ancient paintings. Uluru is listed as a World " +
                    "Heritage Site.</p>" +
                    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
                    "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
                    "(last visited June 22, 2009).</p>" +
                    "</div>" +
                    "</div>";
                const infowindow = new google.maps.InfoWindow({
                    content: contentString,
                });
                marker.addListener("click", () => {
                    infowindow.open({
                        anchor: marker,
                        map,
                        shouldFocus: false,
                    });
                });
            }
            this.setState({
                google: google,
                map: map
            });
        });
    }
    filter(event) {
        let list
        if (event.target.value === null || event.target.value === 'all') {
            axios(baseUrl).then(resp => {
                list = resp.data
            })
        } else {
            list = this.state.list.filter(spot => spot.type === event.target.value)
        }
        this.setState({ list })
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
                    <div className="col-1 col-md-1"></div>
                    <div className="col-2 col-md-2">
                        <div className="form-group row align-items-right">
                            <button className="btn btn-success" onClick={this.initMap}>Carregar Mapa</button>
                        </div>
                    </div>
                    <div className="col-1 col-md-1"></div>
                </div>
                <div ref={(ref) => { this.googleMapDiv = ref }} style={{ height: '66vh', width: '100%' }}></div>
            </Main>
        )
    }
}