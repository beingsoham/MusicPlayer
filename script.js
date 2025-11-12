const musicContainer = document.getElementById('now-playing-view');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const artist = document.getElementById('artist');
const favBtn = document.getElementById('fav-btn');
const loopBtn = document.getElementById('loop-btn');
const volumeSlider = document.getElementById('volume-slider');
const searchInput = document.getElementById('search-input');
const playlist = document.getElementById('playlist'); // The queue on the right
const songGrid = document.getElementById('song-grid'); // The library grid

// View containers
const libraryView = document.getElementById('library-view');
const nowPlayingView = document.getElementById('now-playing-view');

// For sidebar on mobile
const burgerMenu = document.getElementById('burger-menu');
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');

// --- HOW TO ADD YOUR MUSIC ---
// 1. Add your music files (e.g., my-song.mp3) to the /music folder.
// 2. Add your cover images (e.g., my-song.jpg) to the /images folder.
// 3. Add the name of the song (without .mp3) to the 'songs' array below.
// 4. Add a `favorite` property, set to `true` or `false`.
const songs = [
    {
        name: 'pal-pal',
        image: 'pal-pal.png', // Specify the full image name
        title: 'Pal Pal',
        artist: 'afusic',
        favorite: false
    },
    {
        name: 'haseen',
        image: 'haseen.jpeg', // Specify the full image name
        title: 'Haseen',
        artist: 'Talwinder',
        favorite: true
    },
    {
        name: 'pyari-amaanat',
        image: 'pyari-amaanat.png',
        title: 'Pyari Amaanat',
        artist: 'Arpit Bala',
        favorite: false
    }
]; // Example songs

// Keep track of song
let songIndex = 0; // Start with the first song

// Initially load song details into DOM
updatePlaylist(songs);
createSongCards();
loadSong(songs[songIndex]);
showNowPlayingView(); // Start by showing the player

// Update playlist/queue in the right sidebar
function updatePlaylist(songsToShow) {
    playlist.innerHTML = ''; // Clear existing playlist
    songsToShow.forEach((song, index) => {
        const li = document.createElement('li');
        li.dataset.index = songs.findIndex(s => s.name === song.name); // Use original index
        li.innerText = `${song.title} - ${song.artist}`;
        playlist.appendChild(li);
    });
}

// Update song details
function loadSong(songData) {
    title.innerText = songData.title;
    artist.innerText = songData.artist;
    audio.src = `music/${songData.name}.mp3`;
    cover.src = `images/${songData.image}`;

    // Update favorite button UI
    if (favBtn) {
        const heartIcon = favBtn.querySelector('i');
        if (songData.favorite) {
            heartIcon.classList.remove('far'); // 'far' is regular
            heartIcon.classList.add('fas');   // 'fas' is solid
        } else {
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
        }
    }

    // Highlight the current song in the playlist
    const currentPlaying = document.querySelector('.playlist li.playing');
    if (currentPlaying) {
        currentPlaying.classList.remove('playing');
    }
    document.querySelector(`.playlist li[data-index="${songIndex}"]`).classList.add('playing');
}

// Create song cards in the library view
function createSongCards() {
    songGrid.innerHTML = ''; // Clear existing cards
    songs.forEach((song, index) => {
        const card = document.createElement('div');
        card.classList.add('song-card');
        card.dataset.index = index;

        card.innerHTML = `
            <img src="images/${song.image}" alt="${song.title}">
            <h4>${song.title}</h4>
            <p>${song.artist}</p>
        `;

        songGrid.appendChild(card);
    });
}

// --- View Management ---
function showLibraryView() {
    libraryView.classList.remove('hidden');
    nowPlayingView.classList.add('hidden');
}

function showNowPlayingView() {
    libraryView.classList.add('hidden');
    nowPlayingView.classList.remove('hidden');
}

// Event listener for the Home button
document.getElementById('home-btn').addEventListener('click', (e) => {
    e.preventDefault(); // Prevent link from navigating
    showLibraryView();
});

// Event listener for the Browse button
document.getElementById('browse-btn').addEventListener('click', (e) => {
    e.preventDefault();
    showLibraryView();
    searchInput.focus(); // Focus the search bar
});


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

// Toggle favorite status
favBtn.addEventListener('click', () => {
    const currentSong = songs[songIndex];
    currentSong.favorite = !currentSong.favorite;

    // Update the icon
    const heartIcon = favBtn.querySelector('i');
    heartIcon.classList.toggle('fas');
    heartIcon.classList.toggle('far');
});

// Play song from library grid on click
songGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.song-card');
    if (card) {
        songIndex = parseInt(card.dataset.index);
        loadSong(songs[songIndex]);
        playSong();
        showNowPlayingView(); // Switch back to the player view
    }
});

// Play song from playlist on click
playlist.addEventListener('click', (e) => {
    if (e.target && e.target.matches('li')) {
        songIndex = parseInt(e.target.dataset.index);
        loadSong(songs[songIndex]);
        playSong();
        if (sidebar.classList.contains('show')) {
            sidebar.classList.remove('show'); // Hide sidebar on mobile after selection
        }
    }
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredSongs = songs.filter(song => {
        return song.title.toLowerCase().includes(searchTerm) ||
               song.artist.toLowerCase().includes(searchTerm);
    });
    // Update the "Up Next" queue with search results
    updatePlaylist(filteredSongs);
});

// Sidebar mobile functionality
burgerMenu.addEventListener('click', () => sidebar.classList.add('show'));
closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('show'));


// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress); // For progress bar

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);

// Volume control
volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

// Loop functionality
loopBtn.addEventListener('click', () => {
    audio.loop = !audio.loop;
    // Visually indicate if loop is active
    if (audio.loop) {
        loopBtn.style.color = '#1db954'; // Spotify Green
    } else {
        loopBtn.style.color = '#b3b3b3'; // Default color
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts if user is typing in the search bar
    if (e.target === searchInput) {
        return;
    }

    switch (e.key) {
        case ' ': // Spacebar for Play/Pause
            e.preventDefault(); // Prevent page from scrolling
            const isPlaying = musicContainer.classList.contains('play');
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
            break;
        case 'ArrowRight': // Right Arrow to forward
            audio.currentTime += 10;
            break;
        case 'ArrowLeft': // Left Arrow to rewind
            audio.currentTime -= 10;
            break;
    }
});
