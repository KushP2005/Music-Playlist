function getSong() {
    let songName = document.getElementById('song').value;
    if(songName === '') {
        return alert('Please enter a song');
    }


    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById('searchHeader').textContent = `Songs matching: ${songName}`;
            const response = JSON.parse(xhr.responseText);
            populateSongsTable(response.results);
        }
    }
    xhr.open('GET', `/songs?title=${encodeURIComponent(songName)}`, true);
    xhr.send();
}

function populateSongsTable(songs) {
    const tableBody = document.getElementById('songsTableBody'); 

    for (const song of songs) {
        const row = document.createElement('tr');
        row.setAttribute('data-track-id', song.trackId);
        row.innerHTML = `
            <td>
                <button onclick="addToPlaylist(${song.trackId})">+</button>
            </td>
            <td>${song.trackName}</td>
            <td>${song.artistName}</td>
            <td><img src="${song.artworkUrl100}" alt="${song.trackName}" height="50"></td>
        `;
        tableBody.appendChild(row);
    }
}

function moveUp(button) {
    const row = button.closest('tr');
    const prev = row.previousElementSibling;
    if (prev) { // If it exists
        row.parentNode.insertBefore(row, prev);
        savePlaylist();
    }
}

function moveDown(button) {
    const row = button.closest('tr');
    const next = row.nextElementSibling;
    if (next) {
        row.parentNode.insertBefore(next, row);
        savePlaylist();
    }
}

function addToPlaylist(trackId) {
    const songRow = document.querySelector(`tr[data-track-id="${trackId}"]`);
    if (!songRow) return;

    const playlistTbody = document.getElementById('playlistTableBody');

    // Clone the row and modify
    const playlistRow = songRow.cloneNode(true);
    playlistRow.innerHTML = `
        <td>
            <button onclick="this.closest('tr').remove(); savePlaylist();">-</button>
            <button onclick="moveUp(this)">&#x2b06</button>
            <button onclick="moveDown(this)">&#11015</button>
        </td>
        <td>${songRow.cells[1].textContent}</td>
        <td>${songRow.cells[2].textContent}</td>
        <td>${songRow.cells[3].innerHTML}</td>
    `;
    
    playlistTbody.appendChild(playlistRow);
    savePlaylist();
}

function savePlaylist() {
    const playlistRows = document.getElementById('playlistTableBody').getElementsByTagName('tr');
    const playlist = [];
    
    for (const row of playlistRows) {
        playlist.push({
            trackId: row.getAttribute('data-track-id'),
            trackName: row.cells[1].textContent,
            artistName: row.cells[2].textContent,
            artworkUrl100: row.cells[3].querySelector('img').src
        });
    }
    
    localStorage.setItem('savedPlaylist', JSON.stringify(playlist));
}

// Modify the loadPlaylist function to include the new buttons
function loadPlaylist() {
    const savedPlaylist = localStorage.getItem('savedPlaylist');
    if (savedPlaylist) {
        const playlist = JSON.parse(savedPlaylist);
        const playlistTbody = document.getElementById('playlistTableBody');
        playlistTbody.innerHTML = ''; 
        
        for (const song of playlist) {
            const row = document.createElement('tr');
            row.setAttribute('data-track-id', song.trackId);
            row.innerHTML = `
                <td>
                    <button onclick="this.closest('tr').remove(); savePlaylist();">-</button>
                    <button onclick="moveUp(this)">&#x2b06</button>
                    <button onclick="moveDown(this)">&#11015</button>
                </td>
                <td>${song.trackName}</td>
                <td>${song.artistName}</td>
                <td><img src="${song.artworkUrl100}" alt="${song.trackName}" height="50"></td>
            `;
            playlistTbody.appendChild(row);
        }
    }
}



const ENTER=13

function handleKeyUp(event) {
event.preventDefault()
   if (event.keyCode === ENTER) {
      document.getElementById("submit_button").click()
  }
}


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('submit_button').addEventListener('click', getSong)
    document.getElementById('song').addEventListener('keyup', handleKeyUp)

    //add key handler for the document as a whole, not separate elements.
    document.addEventListener('keyup', handleKeyUp)
    loadPlaylist();
})
