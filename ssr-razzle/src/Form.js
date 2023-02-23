import { useState } from 'react'
import { useLocation, useNavigate, useOutletContext } from 'react-router';
import axiosInstance from './axiosInstance';

const Form  = () => {
  const [stateSwitch, initialData] = useOutletContext()
  const host = process.env.RAZZLE_API_HOST
  const locstate = useLocation().state
  const path = useLocation().pathname
  const navigate = useNavigate()
  const [songFields, setSongFields] = useState([])
  const [initialValues, setInitialValues] = useState({
    title: "",
    author: "",
    year: "",
    songs: []
  })

  if ( locstate !== null && initialValues.title === "" ) {
    setInitialValues({
      title: locstate.state.title,
      author: locstate.state.author,
      year: locstate.state.year,
      songs: locstate.state.songs
    })
    const newSongFields = locstate.state.songs.map((song, index) => index )
    setSongFields(newSongFields)
  }

  const handleChange = (e) => {
    const field = e.target.name
    const value = e.target.value
    if ( field.indexOf("song") !== -1) {
        const index = parseInt(field.split("song")[1])
        var newSongs = initialValues.songs
        newSongs[index] = value
        setInitialValues({
            ...initialValues,
            songs: newSongs
        })
    }
    else {
        setInitialValues({
            ...initialValues,
            [field]: value
        })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if ( path.indexOf("add") !== -1) {
      await axiosInstance.post(`${host}/albums/add`, initialValues)
        .then(res => {
            console.log(res)
        }, err => console.log(err))
      stateSwitch()
      navigate("/home/entries", { replace: true })
    }

    else if (path.indexOf("edit") !== -1) {
      await axiosInstance.put(`${host}/albums/edit/${locstate.state._id}`, initialValues)
        .then(res => {
            console.log(res)
        }, err => console.log(err))
      stateSwitch()
      navigate("/home/entries", { replace: true })
    }
  }
  
  const addFields = () => {

    setSongFields([...songFields, songFields.length])

  }

  const deleteField = (index) => {

    var newSongFields = songFields
    newSongFields.pop()
    setSongFields(newSongFields)
    var newSongs = initialValues.songs
    newSongs.splice(index, 1)
    setInitialValues({
        ...initialValues,
        songs: newSongs
    })

  }

  return (
    <div className='Albumform'>
        <span className='title'>
          {path.indexOf("add") !== -1 ? "Dodaj album" : "Edytuj album"}
        </span>
        <form onSubmit={values => handleSubmit(values)} >
            <label>
                Tytuł
            </label>
            <input type="text" name="title" value={initialValues.title} onChange={e => handleChange(e)} required/>
            <label>
                Autor
            </label>
            <input type="text" name="author" value={initialValues.author} onChange={e => handleChange(e)} required/>
            <label>
              Rok wydania
            </label>
            <input type="text" name="year" value={initialValues.year} onChange={e => handleChange(e)} required/>
            {songFields.map(songField => {
                return (
                    <>
                    <label>
                        Piosenka {songField}
                    </label>
                    <input type="text" name={`song${songField}`} value={initialValues.songs[songField]} onChange={e => handleChange(e)} required={true}/>
                    <button type="button" onClick={() => deleteField(songField)} className="delete">Usuń piosenkę</button>
                    </>
                )
            })}
            <button type="button" onClick={() => addFields()} className="addsong">Dodaj piosenkę</button>
            <button type="submit" className='submit'>Wyślij</button>
        </form>
    </div>
  );
}

export default Form;
