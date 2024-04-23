import React, { Component } from 'react';
import ReactDom from 'react-dom'
import axios from 'axios'
import Main from '../template/main'
import { Loader } from '@googlemaps/js-api-loader';

const headerProps = {
    icon: 'map-pin',
    title: 'Pontos',
    subtitle: '/spots'
}

const baseUrl = 'http://localhost:3001/spots'

const loader = new Loader({
    apiKey: process.env.API_KEY,
    version: "weekly",
    libraries: ["places"]
});

const initialState = {
    spot: { type: '', address: '', cordinates: { lat: 0, lng: 0 }, maxHeight: '' },
    list: [],
    formVisible: false,
    listVisible: true
}

export default class SpotCrud extends Component {

    state = { ...initialState }

    componentDidMount() {
        axios(baseUrl).then(resp => {
            resp.data.sort((a, b) => b.id - a.id);
            this.setState({ list: resp.data })
        })
    }

    initMap() {
        let cordinates
        let defaultMapOptions = {
            center: {
                lat: -23.5489,
                lng: -46.6388
            },
            zoom: 15,
            clickableIcons: false,
            disableDefaultUI: true,
            fullscreenControl: true,
            zoomControl: true,
            scaleControl: true
        }
        if (this.state.spot.id) {
            defaultMapOptions['center'] = {
                lat: parseFloat(this.state.spot.cordinates.lat),
                lng: parseFloat(this.state.spot.cordinates.lng)
            }
            cordinates = {
                lat: parseFloat(this.state.spot.cordinates.lat),
                lng: parseFloat(this.state.spot.cordinates.lng)
            }
        } else {
            cordinates = {
                lat: parseFloat(defaultMapOptions.center.lat),
                lng: parseFloat(defaultMapOptions.center.lng)
            }
        }
        loader.load().then((google) => {
            const map = new google.maps.Map(
                this.googleMapDiv,
                defaultMapOptions);

            this.marker = new google.maps.Marker({
                position: cordinates,
                map: map,
                draggable: true
            });

            const input = ReactDom.findDOMNode(this.addressInput)
            const searchBox = new google.maps.places.SearchBox(input);
            map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            map.addListener("bounds_changed", () => {
                searchBox.setBounds(map.getBounds());
            });

            searchBox.addListener("places_changed", () => {
                const places = searchBox.getPlaces();
                if (places.length === 0) {
                    return;
                }
                const place = places[0]
                this.marker.setMap(null);
                const bounds = new google.maps.LatLngBounds();
                if (!place.geometry || !place.geometry.location) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                this.marker = new google.maps.Marker({
                    position: place.geometry.location,
                    map: map,
                    draggable: true
                })
                this.setState({
                    marker: this.marker
                });
                const lat = this.marker.getPosition().lat();
                const lng = this.marker.getPosition().lng();
                const cord = { lat: lat, lng: lng }
                this.updateCordinates(cord);
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat: lat, lng: lng } }, (res) => {
                    if (res == null || res.length === 0) {
                        return;
                    } else {
                        this.updateAddress(res[0].formatted_address)
                    }
                });
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
                map.fitBounds(bounds);
            });

            google.maps.event.addListener(map, "click", (event) => {
                this.marker.setMap(null);
                this.marker = new google.maps.Marker({
                    position: event.latLng,
                    map: map,
                    draggable: true
                });
                this.setState({
                    marker: this.marker
                });
                const lat = this.marker.getPosition().lat();
                const lng = this.marker.getPosition().lng();
                const cord = { lat: lat, lng: lng }
                this.updateCordinates(cord);
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat: lat, lng: lng } }, (res) => {
                    if (res == null || res.length === 0) {
                        return;
                    } else {
                        this.updateAddress(res[0].formatted_address)
                    }
                });
            });

            google.maps.event.addListener(this.marker, "drag", (event) => {
                const lat = this.marker.getPosition().lat();
                const lng = this.marker.getPosition().lng();
                const cord = { lat: lat, lng: lng }
                this.updateCordinates(cord);
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat: lat, lng: lng } }, (res) => {
                    if (res == null || res.length === 0) {
                        return;
                    } else {
                        this.updateAddress(res[0].formatted_address)
                    }
                });
            });

            google.maps.event.addListener(this.marker, "dragend", (event) => {
                const lat = this.marker.getPosition().lat();
                const lng = this.marker.getPosition().lng();
                const cord = { lat: lat, lng: lng }
                this.updateCordinates(cord);
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat: lat, lng: lng } }, (res) => {
                    if (res == null || res.length === 0) {
                        return;
                    } else {
                        this.updateAddress(res[0].formatted_address)
                    }
                });
            });

            this.setState({
                google: google,
                map: map,
                marker: this.marker
            });
        });
    }

    updateCordinates(latLng) {
        const spot = { ...this.state.spot }
        spot['cordinates'] = { lat: latLng.lat, lng: latLng.lng }
        this.setState({ spot })
    }

    updateAddress(address) {
        const spot = { ...this.state.spot }
        spot['address'] = address
        this.setState({ spot })
    }

    clear() {
        this.setState({ spot: initialState.spot, formVisible: false, listVisible: true })
    }

    add() {
        this.setState({ spot: initialState.spot, formVisible: true, listVisible: false })
        this.initMap()
    }

    save() {
        const spot = this.state.spot
        const method = spot.id ? 'put' : 'post'
        const url = spot.id ? `${baseUrl}/${spot.id}` : baseUrl
        axios[method](url, spot)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ spot: initialState.spot, list, formVisible: false, listVisible: true })
            })
    }

    getUpdatedList(spot) {
        const list = this.state.list.filter(s => s.id !== spot.id)
        list.push(spot)
        list.sort((a, b) => b.id - a.id);
        return list
    }

    updateField(event) {
        const spot = { ...this.state.spot }
        spot[event.target.name] = event.target.value
        this.setState({ spot })
    }

    updateCordinateField(event) {
        const spot = { ...this.state.spot }
        if (event.target.name === 'lat') {
            spot['cordinates'].lat = event.target.value
        }
        if (event.target.name === 'lng') {
            spot['cordinates'].lng = event.target.value
        }
        this.setState({ spot })
    }

    renderMap() {
        return (
            <div>
                <input className="form-control form-control-sm" type="text" placeholder="Pesquisar" ref={ref => this.addressInput = ref} />
                <div ref={(ref) => { this.googleMapDiv = ref }} style={{ height: '66vh', width: '100%' }}></div>
            </div>
        )
    }

    renderForm() {
        if (this.state.formVisible) {
            return (
                <div className="row">
                    <div className="col-6">
                        {this.renderMap()}
                    </div>
                    <div className="col-6">
                        <div className="form">
                            <div className="row">
                                <div className="col-9 col-md-9">
                                    <div className="form-group">
                                        <label>Endereço</label>
                                        <input type="text" className="form-control" name="address"
                                            value={this.state.spot.address}
                                            onChange={e => this.updateField(e)}
                                            placeholder="Endereço do Ponto" />
                                    </div>
                                </div>
                                <div className="col-3 col-md-3">
                                    <div className="form-group">
                                        <label>Tipo</label>
                                        <select className="form-control" name="type"
                                            value={this.state.spot.type}
                                            onChange={e => this.updateField(e)}>
                                            <option value="">Selecionar</option>
                                            <option value="spot">spot</option>
                                            <option value="report">incidente</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-4 col-md-4">
                                    <div className="form-group">
                                        <label>Latidude</label>
                                        <input type="text" className="form-control" name="lat"
                                            value={this.state.spot.cordinates.lat}
                                            onChange={e => this.updateCordinateField(e)}
                                            placeholder="Latitude do Ponto" />
                                    </div>
                                </div>
                                <div className="col-4 col-md-4">
                                    <div className="form-group">
                                        <label>Longitude</label>
                                        <input type="text" className="form-control" name="lng"
                                            value={this.state.spot.cordinates.lng}
                                            onChange={e => this.updateCordinateField(e)}
                                            placeholder="Longitude do Ponto" />
                                    </div>
                                </div>
                                <div className="col-4 col-md-4">
                                    <div className="form-group">
                                        <label>Altura Máxima</label>
                                        <input type="number" className="form-control" name="maxHeight"
                                            value={this.state.spot.maxHeight}
                                            onChange={e => this.updateField(e)}
                                            placeholder="Altura Máxima do Ponto" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-12 d-flex justify-content-end">
                                <button className="btn btn-primary" onClick={e => this.save(e)}>
                                    Salvar
                                </button>
                                <button className="btn btn-secondary ml-2" onClick={e => this.clear(e)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return null
        }
    }

    load(spotParam) {
        this.setState({ spot: spotParam, formVisible: true, listVisible: false })
        setTimeout(() => {
            this.initMap()
        }, 100);
    }

    remove(spot) {
        axios.delete(`${baseUrl}/${spot.id}`).then(resp => {
            const list = this.state.list.filter(s => s !== spot)
            this.setState({ list })
        })
    }

    renderTable() {
        if (this.state.listVisible) {
            return (
                <div>
                    <table className="table mt-4">
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Endereço</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Altura Máxima</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderRows()}
                        </tbody>
                    </table>
                    <hr />
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <button className="btn btn-block btn-primary" onClick={e => this.add(e)}>
                                Adicionar Ponto
                            </button>
                        </div>
                    </div>
                </div>
            )
        } else {
            return null
        }
    }

    renderRows() {
        return this.state.list.map(spot => {
            return (
                <tr key={spot.id}>
                    <td>{spot.type}</td>
                    <td>{spot.address}</td>
                    <td>{spot.cordinates.lat}</td>
                    <td>{spot.cordinates.lng}</td>
                    <td>{spot.maxHeight}</td>
                    <td>
                        <button className="btn btn-sm btn-warning"
                            onClick={() => this.load(spot)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-danger ml-2"
                            onClick={() => this.remove(spot)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}
