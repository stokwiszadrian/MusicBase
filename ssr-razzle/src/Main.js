import './styles/App.css';
import logo from "./result.svg"
import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import Recent from './Recent';
import { useKeycloak } from "@react-keycloak/ssr";

function Main( props ) {
  const { keycloak, initialized } = useKeycloak()
  const initialData = props.initialData
  const [stateSwitch, setStateSwitch] = useState(false)

  const handleSwitch = () => {
    setStateSwitch(!stateSwitch)
  }

  return (
    <div className="App">
      <nav>
      <img src={logo} alt="Vinyl" />
      <span>Kącik muzyczny</span>
      <img src={logo} alt="Vinyl" />
        <ul>
          <li>
            <Link to="/home">Strona domowa</Link>
          </li>
          {keycloak.authenticated ? (
            <>
            <li>
            <Link to="/home/entries">Lista albumów</Link>
            </li>
            <li>
            <Link to="/home/add">Dodaj album</Link>
          </li>
          </>
          ) : (
            <></>
          )}
        </ul>
      </nav>
      <div className='main'>
        <div className='recent'>
          {keycloak.authenticated ? (
            <Recent stateSwitch={stateSwitch}/>
          ) : (
            <></>
          )}
        </div>
        <div className='outlet'>
          <Outlet context={[handleSwitch, initialData]}/>
        </div>
      </div>
    </div>
  );
}

export default Main;
