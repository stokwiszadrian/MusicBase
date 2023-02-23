const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios').default

app.use(cors())
app.use(express.json())

require('dotenv').config('./.env');

const authurl = process.env.AUTH_URL
const api = process.env.API_URL
const keycloak_conf = {
    client_id: "api-client",
    client_secret: "RAgYHLmKECELJ5Y6ZrIY5LvnQFqWO61N",
    grant_type: "client_credentials"
}
const encoded = new URLSearchParams(Object.entries(keycloak_conf)).toString()

const newAxios = (token) => {
    const axiosInstance = axios.create()
    axiosInstance.interceptors.request.use(
        config => {
            config.headers['Authorization'] = 'Bearer ' + token
            return config
        },
        error => {
            Promise.reject(error)
        })

    axiosInstance.interceptors.response.use((response) => {
        return response
    }, (error) => {
        return Promise.reject(error)
    })

    return axiosInstance
}


app.get("/", async (req, res) => {
    const grant = await axios.post(authurl, encoded)
    const axiosInstance = newAxios(grant.data.access_token)
    const result = await axiosInstance.get(`${api}`)
    res.send(result.data)
})


app.post("/albums", async (req, res) => {
    const grant = await axios.post(authurl, encoded)
    const axiosInstance = newAxios(grant.data.access_token)
    const albums = req.body.albums
    if (typeof albums === 'undefined') {
        res.send("EMPTY")
    }
    else {
        for ( const album of albums) {
            await axiosInstance.post(`${api}/albums/add`, album)
        }
        res.send("OK")     
    }
})

app.get("/albums", async (req, res) => {
    const grant = await axios.post(authurl, encoded)
    const axiosInstance = newAxios(grant.data.access_token)
    const result = await axiosInstance.get(`${api}/albums`)
    res.send(result.data)
})

app.get("/albums/:author", async (req, res) => {
    const grant = await axios.post(authurl, encoded)
    const axiosInstance = newAxios(grant.data.access_token)
    const result = await axiosInstance.get(`${api}/albums`)
    const albums = result.data.albums
    if (albums.length >= 0) {
        const filtered = albums.filter(album => album.author == req.params.author)
        res.send({
            albums: filtered
        })
    }
    else {
        res.send({
            albums: []
        })
    }
})

app.get("/albums/author/count", async (req, res) => {
    const grant = await axios.post(authurl, encoded)
    const axiosInstance = newAxios(grant.data.access_token)
    const result = await axiosInstance.get(`${api}/albums`)
    const albums = result.data.albums
    if (albums.length >= 0) {
        const reduced = albums.reduce((acc, cur) => {
            if (acc[cur.author]) {
                return {
                    ...acc,
                    [cur.author]: acc[cur.author] + 1
                }
            } else {
                return {
                    ...acc,
                    [cur.author]: 1
                }
            }
        }, {})
        res.send({
            ...reduced
        })
    }
    else {
        res.send({
            albums: []
        })
    }
})

app.get("/albums/songs/count", async (req, res) => {
    const grant = await axios.post(authurl, encoded)
    const axiosInstance = newAxios(grant.data.access_token)
    const result = await axiosInstance.get(`${api}/albums`)
    const albums = result.data.albums
    if (albums.length >= 0) {
        const reduced = albums.reduce((acc, cur) => {
            const numSongs = cur.songs.length || 0
            return {
                ...acc,
                [cur.title]: numSongs
            }
        }, {})
        res.send({
            ...reduced
        })
    }
    else {
        res.send({
            albums: []
        })
    }
})


app.put("/albums/edit/:id", async ( req, res ) => {
    const grant = await axios.post(authurl, encoded)
    const axiosInstance = newAxios(grant.data.access_token)
    const result = await axiosInstance.put(`${api}/albums/edit/${req.params.id}`, req.body)
    res.send(result.data)
})

app.delete("/albums/delete/:id", async (req, res) => {
    const grant = await axios.post(authurl, encoded)
    const axiosInstance = newAxios(grant.data.access_token)
    const result = await axiosInstance.delete(`${api}/albums/delete/${req.params.id}`)
    res.send(result.data)
})

const port = 6000
app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});
