import React, { Component } from 'react';
import axios from 'axios'
import Main from '../template/main'

const headerProps = {
    icon: 'map-pin',
    title: 'Pontos',
    subtitle: 'home/spots'
}

const baseUrl = 'http://localhost:3001/spots'

const initialState = {
    spot: { serialNumber: '', address: '', lat: '', lng: '', maxHeight: '' },
    list: [],
    formVisible: false,
    listVisible: true
}

export default class SpotCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
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
        list.unshift(spot)
        return list
    }

    updateField(event) {
        const spot = { ...this.state.spot }
        spot[event.target.name] = event.target.value
        this.setState({ spot })
    }

    renderForm() {
        if (this.state.formVisible) {
            return (
                <div>
                    <div className="form">
                        <div className="row">
                            <div className="col-12 col-md-12">
                                <div className="form-group">
                                    <label>Endereço</label>
                                    <input type="text" className="form-control" name="address"
                                        value={this.state.spot.address}
                                        onChange={e => this.updateField(e)}
                                        placeholder="Endereço do Ponto" />
                                </div>
                            </div>
                            <div className="col-6 col-md-6">
                                <div className="form-group">
                                    <label>Serial Number</label>
                                    <input type="text" className="form-control" name="serialNumber"
                                        value={this.state.spot.serialNumber}
                                        onChange={e => this.updateField(e)}
                                        placeholder="Serial Number do Equipamento" />
                                </div>
                            </div>
                            <div className="col-6 col-md-6">
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
                    <td>{spot.lat}</td>
                    <td>{spot.lng}</td>
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