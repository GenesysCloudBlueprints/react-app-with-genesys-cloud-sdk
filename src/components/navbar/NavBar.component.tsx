import { useHistory } from 'react-router-dom';
import './NavBar.component.scss';
import logo from '../../assets/genesys-logo.png'

export function NavBar() {
    const history = useHistory();

    return (
            <div className="nav__wrapper">
                <div className="nav__logo">
                    <img src={logo} width="200px" height="auto" alt="logo"/>
                </div>
                <div className="nav__link-section">
                    <ul className="nav">
                        <li className="nav__list-item">
                            <button className="nav__link" onClick={() => history.push('')}>Home</button>
                        </li>
                        <li className="nav__list-item">
                            <button className="nav__link" onClick={() => history.push('user-search')}>User Search</button>
                        </li>
                        <li className="nav__list-item">
                            <button className="nav__link" onClick={() => history.push('/queues')}>Queues</button>
                        </li>
                    </ul>
                </div>
            </div>
    );
}
