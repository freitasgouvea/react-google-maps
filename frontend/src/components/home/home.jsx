import React from 'react'
import Main from '../template/main'
import { Link } from 'react-router-dom'

import mapImg from '../../assets/imgs/mapa.png'
import rotaImg from '../../assets/imgs/rota.png'
import trafegoImg from '../../assets/imgs/trafego.png'

export default props =>
    <Main icon="home" title="Início"
        subtitle="Sistema para testar o uso de mapas React!">
        <div className='h4'>Bem Vindo!</div>
        <hr />
        <p>Sistema para testar o Google Maps em React</p>
        <p>Documentação: <a href="https://developers.google.com/maps/documentation/javascript/overview">https://developers.google.com/maps/documentation/javascript/overview</a></p>
        <div className="card-group">
            <Link to="/map" className="card">
                <img className="card-img-top" src={mapImg} alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title">Mapa</h5>
                    <p className="card-text">Visualização e filtro dos pontos em um mapa.</p>
                </div>
            </Link>
            <Link to="/route" className="card">
                <img className="card-img-top" src={rotaImg} alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title">Rotas</h5>
                    <p className="card-text">Visualização, pesquisa e edição de uma rota em um mapa.</p>
                </div>
            </Link>
            <Link to="/traffic" className="card">
                <img className="card-img-top" src={trafegoImg} alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title">Trafego</h5>
                    <p className="card-text">Visualização dos dados do trânsito em tempo real.</p>                    
                </div>
            </Link>
        </div>
    </Main>