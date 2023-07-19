const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/music')


app.use(express.json());

// Ini untuk reset playlist lagu atau pun menambah playlist.
// This is to reset a playlist or add songs to a playlist.

let playlist = [
    {title: 'Bintang kecil', artist: 'Sule', album: 'Bintang kecil',
    url: 'https://www.youtube.com/watch?v=K9X_hP3ffs8', playCount: 0},
    {title: 'Pelangi-Pelangi',artist: 'Tom Cruise', album: 'Pelangi-Pelangi',
        url: 'https://www.youtube.com/watch?v=7Ps_sPbbNSk',playCount: 1},
    {title: 'Indonesia Raya', artist: 'WR Supratman', album: 'Indonesia Raya',
        url: 'https://www.youtube.com/watch?v=-zfjrmiTJ7U', playCount: 100
    }];

// Menambah lagu di playlist.
// Adding songs to a playlist (use POST).
app.post('/playlist', (req, res) => {
    const { title, artists, url } = req.body;
    const song = { title, artists, url, playCount: 0 };
    playlist.push(song);
    res.status(201).json({ message: 'Song added to the playlist.' });
});

// Play lagu.
// Play song.
app.get('/playlist/play', (req, res) => {
    if (playlist.length > 0) {
        let maxPlayCount = -1;
        let maxPlayCountIndex = -1;

        for (let i = 0; i < playlist.length; i++) {
            if (playlist[i].playCount > maxPlayCount) {
                maxPlayCount = playlist[i].playCount;
                maxPlayCountIndex = i;
            }
        }

        if (maxPlayCountIndex !== -1) {
            playlist[maxPlayCountIndex].playCount++;
            res.json({ song: playlist[maxPlayCountIndex] });
        } else {
            res.status(404).json({ message: 'No songs in the playlist have been played yet.' });
        }
    } else {
        res.status(404).json({ message: 'Playlist is empty.' });
    }
});

// Mendapatkan playlist lagu.
// Obtaining a playlist of songs (use GET).
app.get('/playlist', (req, res) => {
    res.json({ playlist });
});

// Mendapatkan lagu yang paling sering diputar.
// Getting the most frequently played song (use GET).
app.get('/playlist/most-played', (req, res) => {
    const sortedPlaylist = [...playlist].sort((a, b) => b.playCount - a.playCount);
    res.json({ playlist: sortedPlaylist });
});

// Random playlist
function generateRandomPlaylistData() {
    const titles = ['Lagu Cicak-Cicak Dinding', 'Lagu Balonku ada 5', 'Lagu Delman', 'Lagu Baby Shark', 'Lagu Topi saya bundar',
    'Bintang Kecil', 'Indonesia Raya', 'Pelangi-Pelangi'];
    const artists = [['Shinchan'], ['Naruto'], ['MrBean'], ['JkRowling'], ['Messi'],['Sule'], ['WR Supratman'], ['Tom Cruise']];
    const urls = [
        'https://www.youtube.com/watch?v=7YPaiOolF1g',
        'https://www.youtube.com/watch?v=xeNnbpjIR_s',
        'https://www.youtube.com/watch?v=pq2XmGL-UkQ',
        'https://www.youtube.com/watch?v=XqZsoesa55w',
        'https://www.youtube.com/watch?v=2e9htREsOIw'
    ];

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * titles.length);
        const song = {
            title: titles[randomIndex],
            artists: artists[randomIndex],
            url: urls[randomIndex],
            playCount: Math.floor(Math.random() * 100)
        };
        playlist.push(song);
    }
}

// function random playlist
generateRandomPlaylistData();

// Start server at http://localhost:3000
app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});
