import React, { useNavigate } from 'react-router-dom';
import './NavBar.component.scss';
import logo from '../../assets/genesys-logo.png'

export function NavBar() {
    const navigate = useNavigate();

    return (
            <div className="nav__wrapper">
                <div className="nav__logo">
                    <img src={logo} width="200px" height="auto" alt="logo"/>
                </div>
                <div className="nav__link-section">
                    <ul className="nav">
                        <li className="nav__list-item">
                            <button className="nav__link" onClick={() => navigate('')}>Home</button>
                        </li>
                        <li className="nav__list-item">
                            <button className="nav__link" onClick={() => navigate('user-search')}>User Search</button>
                        </li>
                        <li className="nav__list-item">
                            <button className="nav__link" onClick={() => navigate('/queues')}>Queues</button>
                        </li>
                    </ul>
                </div>
            </div>
    );
}
