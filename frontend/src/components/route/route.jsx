import React, { Component } from 'react';
import axios from 'axios'
import Main from '../template/main'
import { Loader } from '@googlemaps/js-api-loader';

const headerProps = {
    icon: 'road',
    title: 'Rotas',
    subtitle: '/route'
}

const baseUrl = 'http://localhost:3001/spots'

const loader = new Loader({
    apiKey: process.env.API_KEY,
    version: "weekly",
    libraries: ["places"]
});

var directionsService
var directionsRenderer
var map

export default class Route extends Component {
    constructor(props) {
        super(props);
        this.state = {
            spot: { type: '', address: '', cordinates: { lat: '', lng: '' }, maxHeight: '' },
            list: [],
            directionsService: {},
            directionsRenderer: {},
            request: { destination: 'Estadio Morumbi', origin: 'Praça da Sé', travelMode: 'DRIVING' }
        };
        this.calcRoute = this.calcRoute.bind(this);
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
            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer({draggable: true});
            map = new google.maps.Map(
                this.googleMapDiv,
                defaultMapOptions);
            directionsRenderer.setMap(map);
            this.setState({
                google: google,
                map: map,
                directionsService: directionsService,
                directionsRenderer: directionsRenderer
            });
        });
    }
    updateRequest(event) {
        const { name, value } = event.target;
    
        this.setState(prevState => ({
            request: {
                ...prevState.request,
                [name]: value
            }
        }));
    }
    calcRoute() {
        if (this.state.directionsService !== undefined) {
            this.state.directionsService.route(this.state.request, (result, status) => {
                if (status === 'OK') {
                    this.state.directionsRenderer.setDirections(result);
                }
            });
        }
    }
    render() {
        return (
            <Main {...headerProps}>
                <div className="row">
                    <div className="col-4 col-md-4">
                        <div className="form-group row align-items-center">
                            <label className="col-3 mt-2" for="origin">Início: </label>
                            <input type="text" className="form-control col-9" name="origin"
                                onChange={e => this.updateRequest(e)} />
                            {/* <select className="form-control col-9" name="origin" onChange={e => this.updateRequest(e)}>
                                <option value="Praça da Sé">Praça da Sé</option>
                                <option value="Estadio Morumbi">Estadio Morumbi</option>
                            </select> */}
                        </div>
                    </div>
                    <div className="col-4 col-md-4">
                        <div className="form-group row align-items-center">
                            <label className="col-3 mt-2">Destino: </label>
                            <input type="text" className="form-control col-9" name="destination"
                                onChange={e => this.updateRequest(e)} />
                            {/* <select className="form-control col-9" name="destination" onChange={e => this.updateRequest(e)}>
                                <option value="Estadio Morumbi">Estadio Morumbi</option>
                                <option value="Praça da Sé">Praça da Sé</option>
                            </select> */}
                        </div>
                    </div>
                    <div className="col-1 col-md-1"></div>
                    <div className="col-2 col-md-2">
                        <div className="form-group row align-items-right">
                            <button className="btn btn-success" onClick={this.calcRoute}>Calcular Rota</button>
                        </div>
                    </div>
                    <div className="col-1 col-md-1"></div>
                </div>
                <div ref={(ref) => { this.googleMapDiv = ref }} style={{ height: '66vh', width: '100%' }}></div>
            </Main>
        )
    }
}
