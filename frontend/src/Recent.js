
import { useKeycloak } from '@react-keycloak/web';
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router';
import newAxios from './axiosInstance';

const Recent  = ( { stateSwitch } ) => {
  const { keycloak } = useKeycloak()
  const axiosInstance = newAxios(keycloak.token)
  const navigate = useNavigate()
  const host = process.env.REACT_APP_API_HOST
  const [recentAlbums, setRecentAlbums] = useState(undefined)
  const myState = useRef(false)
  myState.current = stateSwitch
  const recentAlbumRef = useRef([])
  recentAlbumRef.current = recentAlbums
  useEffect(() => {

    const fetchdata = async () => {
        const result = await axiosInstance.get(`${host}/recentalbums`)
        setRecentAlbums(result.data.albums)
    }
    if (keycloak.authenticated && !recentAlbums) {
      fetchdata()
    }
  }, [host, stateSwitch, axiosInstance, keycloak, recentAlbums])

  const handleClick = async (title) => {
    const result = await axiosInstance.get(`${host}/album/bytitle/${title}`)
    navigate(`/home/entries/${result.data.album._id}`, { replace: true, state: result.data.album })
  }


  return (
    <div className='Recent'>
        <span>Ostatnio dodane</span>
          <ol>
        { recentAlbums && recentAlbums.length > 0 ? recentAlbums.map(album => {
          return (
            <li>
              <button onClick={() => handleClick(album.title)}>
              {album.author} - <b>{album.title}</b>
              </button>
            </li>
          )
        }) : (
          <li>
            Brak nowych albumów
          </li>
        )}
        </ol>
    </div>
  );
}

export default Recent;
