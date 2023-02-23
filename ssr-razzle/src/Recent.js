import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router';
import axiosInstance from './axiosInstance';

const Recent  = ( { stateSwitch } ) => {


  const navigate = useNavigate()
  const host = process.env.RAZZLE_API_HOST
  const [recentAlbums, setRecentAlbums] = useState([])
  const myState = useRef(false)
  myState.current = stateSwitch
  const recentAlbumRef = useRef([])
  recentAlbumRef.current = recentAlbums
  useEffect(() => {

    Recent.requestInitialData("path")
      .then(data => setRecentAlbums(data.albums))
  }, [host, stateSwitch])

  const renderList = () => {
    if (recentAlbums !== undefined) {
      if (recentAlbums.length > 0) {
        return recentAlbums.map(album => {
          return (
            <li>
              <button onClick={() => handleClick(album.title)}>
              {album.author} - <b>{album.title}</b>
              </button>
            </li>
          )
        })
      }
      
    }
    return (
      <li>
        Brak nowych albumów
      </li>
    )
  }

  const handleClick = async (title) => {
    const result = await axiosInstance.get(`${host}/album/bytitle/${title}`)
    navigate(`/home/entries/${result.data.album._id}`, { replace: true, state: result.data.album })
  }

  return (
    <div className='Recent'>
        <span>Ostatnio dodane</span>
          <ol>
            {renderList()}
          </ol>
    </div>
  );
}

Recent.requestInitialData = (path) => {
  const host = process.env.RAZZLE_API_HOST
  return axiosInstance(`${host}/recentalbums`)
      .then(response => response.data)
}

export default Recent;
