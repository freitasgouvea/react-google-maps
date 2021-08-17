import './nav.css'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="menu-area">
        <nav className="menu">
            <Link to="/">
                <i className="fa fa-home"></i> Início
            </Link>
            <Link to="/map">
                <i className="fa fa-map"></i> Mapa
            </Link>
            <Link to="/spot">
                <i className="fa fa-map-pin"></i> Pontos
            </Link>
        </nav>
    </aside>