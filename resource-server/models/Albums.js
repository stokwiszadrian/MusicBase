const { Schema, model } = require('mongoose');

// Schema domyślnie dodaje unikalne pole _id, dlatego pomijamy je w deklaracji
const AlbumSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    year: {
        type: Number,
        required: true
    },
    songs: {
        type: Array,
        "default": []
    }
});

module.exports = model('Albums', AlbumSchema);