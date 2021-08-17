import React, { Component } from 'react';
import axios from 'axios'
import Main from '../template/main'

const headerProps = {
    icon: 'map-pin',
    title: 'Pontos',
    subtitle: '/spots'
}

const baseUrl = 'http://localhost:3001/spots'

const initialState = {
    spot: { type: '', address: '', cordinates: { lat: '', lng: '' }, maxHeight: '' },
    list: [],
    formVisible: false,
    listVisible: true
}

export default class SpotCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            resp.data.sort((a, b) => b.id - a.id);
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ spot: initialState.spot, formVisible: false, listVisible: true })
    }

    add() {
        this.setState({ spot: initialState.spot, formVisible: true, listVisible: false })
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
        const cordinates = { ...this.state.spot.cordinates }
        cordinates[event.target.name] = event.target.value
        this.setState({ spot: { cordinates } })
    }

    renderForm() {
        if (this.state.formVisible) {
            return (
                <div className="row">
                    <div className="col-6">
                        <div ref={(ref) => { this.googleMapDiv = ref }} style={{ height: '66vh', width: '100%' }}></div>
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

    load(spot) {
        this.setState({ spot, formVisible: true, listVisible: false })
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
                                <th>ID</th>
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
                    <td>{spot.id}</td>
                    <td>{spot.address}</td>
                    <td>{spot.cordinates.lat}</td>
                    <td>{spot.cordinates.lng}</td>
                    <td>{spot.maxHeight}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(spot)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
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