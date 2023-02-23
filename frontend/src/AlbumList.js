
import { useKeycloak } from '@react-keycloak/web';
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import newAxios from './axiosInstance';
import NotAuthorized from './NotAuthorized';

const AlbumList  = () => {
  const { keycloak } = useKeycloak();

  const axiosInstance = newAxios(keycloak.token)

  const host = process.env.REACT_APP_API_HOST
  const [albums, setAlbums] = useState([])
  const albumref = useRef([])
  albumref.current = albums
  useEffect(() => {

    const fetchdata = async () => {
      
      if ( albumref.current.length === 0 ) {
        const result = await axiosInstance.get(`${host}/albums`)
        setAlbums(result.data.albums)
      }
    }
    if (keycloak.authenticated) {
      fetchdata()
    }
  }, [host, axiosInstance, keycloak])

  
  if (!keycloak.authenticated) {
    return (
      <NotAuthorized />
    )
  }

  return (
    <div className='Albumlist'>
      <span>Wszystkie albumy</span>
            <ul>
          { albums ? albums.map(album => {
            
            return (
                <li key={album._id}>
                    <Link to={`/home/entries/${album._id}`} state={album}>
                        <div>
                        {album.author} - <b>{album.title}</b>
                        </div>
                        <div className='albumyear'>
                          {album.year}
                        </div>
                    </Link>
                    {/* <div>
                        <div>
                        {album.author} - <b>{album.title}</b>
                        </div>
                        <div className='albumyear'>
                          {album.year}
                        </div>
                    </div> */}
                </li>
            )
          }) : <></>}
          </ul>
    </div>
  );
}

export default AlbumList;
