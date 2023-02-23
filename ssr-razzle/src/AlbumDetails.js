import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router';
import axiosInstance from './axiosInstance';

const AlbumDetails  = () => {
  const [stateSwitch, initialData] = useOutletContext()
  const host = process.env.REACT_APP_API_HOST || "http://localhost:5000"
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
    if ( locstate !== null ) {
      setState(locstate)
    }
  }, [id, locstate, host])

  const handleDelete = async () => {
    await axiosInstance.delete(`${host}/albums/delete/${state._id}`)
      .then(res => {
        navigate("/home/entries", { replace: true })
      }, err => {
        console.log(err)
      })
      stateSwitch()
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

AlbumDetails.requestInitialData = (path) => {
  const id = path.split("/")[3]
  return axiosInstance.get(`http://localhost:5000/album/${id}`)
      .then(response => response.data)
}

export default AlbumDetails;
