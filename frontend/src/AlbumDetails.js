import { useKeycloak } from '@react-keycloak/web';
import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router';
import newAxios from './axiosInstance';
import NotAuthorized from './NotAuthorized';

const AlbumDetails  = () => {
  const { keycloak } = useKeycloak()
  const axiosInstance = newAxios(keycloak.token)
  const stateSwitch = useOutletContext()
  const host = process.env.REACT_APP_API_HOST
  const navigate = useNavigate()
  const [state, setState] = useState({
    _id: "",
    author: "",
    title: "",
    year: 0,
    songs: []
  })

  const locstate = useLocation().state
  const { id } = useParams()
  useEffect(() => {
    if ( locstate === null && keycloak.authenticated) {
      axiosInstance.get(`${host}/album/${id}`)
        .then(res => setState(res.data.album))
        .catch(rej => console.log(rej))
    }
    else {
      setState(locstate)
    }
  }, [id, locstate, host, axiosInstance, keycloak])

  const handleDelete = async () => {
    await axiosInstance.delete(`${host}/albums/delete/${state._id}`)
      .then(res => {
        navigate("/home/entries", { replace: true })
      }, err => {
        console.log(err)
      })
      stateSwitch()
  }

  if (!keycloak.authenticated) {
    return (
      <NotAuthorized />
    )
  }

  return (
    <div className='Albumdetails'>
        <span className='title'>{state.author} - {state.title}</span>
        <button onClick={() => navigate("/home/edit", { replace: true, state: {state} })} className='edit'>Edytuj</button>
        <button onClick={() => handleDelete()} className='delete'>Usuń</button>
        <span className='year'>{state.year}, {state.songs.length} utworów</span>
        <ul>
        {state.songs.length > 0 ? state.songs.map(song => {
            return (
                <li key={song}>
                    {song}
                </li>
            )
        }) : 
          <li>
            <b>Brak zapisanych piosenek</b>
          </li>}
        </ul>
    </div>
  );
}

export default AlbumDetails;
