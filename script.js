const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const movieGrid = document.getElementById('movieGrid');
const statusMessage = document.getElementById('statusMessage');
const resultsCount = document.getElementById('resultsCount');
const suggestBtns = document.querySelectorAll('.suggest-btn');

// Fungsi utama carian
async function searchMovies(query) {
    if (!query) {
        statusMessage.textContent = "Carian masih berjalan.";
        statusMessage.className = 'primary';
        movieGrid.innerHTML = '';
        resultsCount.textContent = '';
        return;
    }

    // Paparkan keadaan Loading
    movieGrid.innerHTML = '';
    statusMessage.textContent = "Sedang mencari data...";
    statusMessage.className = 'loading';
    resultsCount.textContent = '';
    // memanggil API TVMaze
    try {
        // Fetch data dari API TVMaze berdasarkan query carian
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
        const data = await response.json();

        if (data.length === 0) {
            statusMessage.textContent = 'Movie not found';
            statusMessage.className = 'error';
            return;
        }

        statusMessage.textContent = '';
        statusMessage.className = 'info';
        resultsCount.textContent = `Dijumpai ${data.length} hasil untuk "${query}"`;
        
        // Paparkan maklumat
        data.forEach(item => {
            const show = item.show;
            const card = document.createElement('div');
            card.classList.add('movie-card');

            // Poster, Tajuk, dan Tahun
            const poster = show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=Tiada+Imej';
            const year = show.premiered ? show.premiered.split('-')[0] : 'N/A';
            const type = show.type || 'Siri TV';
            // Membina kandungan kad
            card.innerHTML = `
                <img src="${poster}" alt="${show.name}">
                <div class="movie-info">
                    <h3>${show.name}</h3>
                    <div class="meta-data">
                        <p>${type}</p>
                        <p>${year}</p>
                    </div>
                </div>
            `;
            movieGrid.appendChild(card);
        });
        // Menangani ralat fetch
    } catch (error) {
        statusMessage.textContent = "Ralat teknikal berlaku. Sila cuba lagi.";
        console.error("Fetch Error:", error);
    }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    searchMovies(searchInput.value.trim());
});

// Sokongan butang 'Enter'
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchMovies(searchInput.value.trim());
    }
});

// Logik untuk butang cadangan
suggestBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        searchInput.value = btn.textContent;
        searchMovies(btn.textContent);
    });
});