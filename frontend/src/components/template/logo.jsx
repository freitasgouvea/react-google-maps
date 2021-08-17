import './logo.css'
import ecsLogo from '../../assets/imgs/ecs.svg'
import React from 'react'
import { Link } from 'react-router-dom'

export default props =>
    <aside className="logo">
        <Link to="/" className="logo">
            <img src={ecsLogo} alt="logo" />
        </Link>
    </aside>