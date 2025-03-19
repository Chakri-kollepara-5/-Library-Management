document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const searchResults = document.getElementById("searchResults");
    const spinner = document.getElementById("spinner");
    const themeToggle = document.getElementById("themeToggle");

    function toggleTheme() {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "☀️ Light Mode";
        } else {
            themeToggle.textContent = "🌙 Dark Mode";
        }
    }

    themeToggle.addEventListener("click", toggleTheme);

    function fetchBooks(query) {
        if (query.trim() === "") {
            searchResults.innerHTML = "<p class='text-center text-muted'>Type a book title to search</p>";
            return;
        }

        spinner.classList.remove("d-none");
        searchResults.innerHTML = "";

        fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
            .then(response => response.json())
            .then(data => {
                spinner.classList.add("d-none");

                if (!data.items) {
                    searchResults.innerHTML = "<p class='text-center text-danger'>No books found!</p>";
                    return;
                }

                searchResults.innerHTML = data.items.map(item => {
                    const book = item.volumeInfo;
                    return `
                        <div class="book-item">
                            <img src="${book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/60'}" alt="Book Cover">
                            <div>
                                <p class="book-title">${book.title}</p>
                                <p class="book-author">${book.authors ? book.authors.join(', ') : 'Unknown Author'}</p>
                                <p class="book-description">${book.description ? book.description.substring(0, 100) + "..." : "No description available."}</p>
                            </div>
                        </div>
                    `;
                }).join("");
            })
            .catch(error => {
                spinner.classList.add("d-none");
                searchResults.innerHTML = "<p class='text-center text-danger'>Error fetching data. Try again later.</p>";
            });
    }

    function debounce(func, delay) {
        let timer;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }

    searchInput.addEventListener("input", debounce(() => {
        fetchBooks(searchInput.value);
    }, 500));

    searchBtn.addEventListener("click", () => {
        fetchBooks(searchInput.value);
    });
});