import { useState, useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router';
import { Link } from 'react-router-dom';
import axiosInstance from './axiosInstance';
import 'isomorphic-fetch'

const AlbumList  = () => {
  const [stateSwitch, initialData] = useOutletContext()
  const host = process.env.RAZZLE_API_HOST
  const [albums, setAlbums] = useState([])
  const albumref = useRef([])
  if ( initialData) {
    if ( initialData.albums ) {
      if ( initialData.albums.length > 0 && albums.length === 0) {
        setAlbums(initialData.albums)
      }
    }
  }

  useEffect(() => {

    if (!albums || albums.length === 0)
    AlbumList.requestInitialData("path")
      .then(data => {
        setAlbums(data.albums)
      })
      .catch(err => console.log(err))
  }, [host])


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
                </li>
            )
          }) : <></>}
          </ul>
    </div>
  );
}

AlbumList.requestInitialData = (path) => {
  const host = process.env.RAZZLE_API_HOST
  return axiosInstance.get(`${host}/albums`)
    .then(data => data.data)
}

export default AlbumList;
