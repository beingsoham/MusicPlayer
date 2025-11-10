const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const artist = document.getElementById('artist');

// --- HOW TO ADD YOUR MUSIC ---
// 1. Add your music files (e.g., my-song.mp3) to the /music folder.
// 2. Add your cover images (e.g., my-song.jpg) to the /images folder.
// 3. Add the name of the song (without .mp3) to the 'songs' array below.
const songs = [
    {
        name: 'pal-pal',
        image: 'pal-pal.png', // Specify the full image name
        title: 'Pal Pal',
        artist: 'afusic'
    },
    {
        name: 'haseen',
        image: 'haseen.jpeg', // Specify the full image name
        title: 'Haseen',
        artist: 'Talwinder'
    }
]; // Example songs

// Keep track of song
let songIndex = 0; // Start with the first song

// Initially load song details into DOM
loadSong(songs[songIndex]);

// Update song details
function loadSong(songData) {
    title.innerText = songData.title;
    artist.innerText = songData.artist;
    audio.src = `music/${songData.name}.mp3`;
    cover.src = `images/${songData.image}`;
}

// Play song
function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');

    // The play() method returns a promise. We handle it to avoid errors.
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => console.error("Audio Playback Error:", error));
    }
}

// Pause song
function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    audio.pause();
}

// Previous song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Next song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Event listeners
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress); // For progress bar

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);
