const API_KEY = "BrhXNPr7KISeyRVmlLP9edR8zz48YKDBRCYgSnfglR8";
const API_URL = "https://api.unsplash.com/search/photos";
const imageContainer = document.getElementById("imageContainer");
const searchButton = document.getElementById("searchImageButton");
const searchInput = document.getElementById("searchImageInput");
const generateMore = document.getElementById("generateMore");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");

let currentPage = 1;

function setLoading(loading) {
  loadingIndicator.style.display = loading ? "block" : "none";
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = message ? "block" : "none";
}

function searchImages(query, page = 1) {
  setLoading(true);
  showError("");

  const headers = new Headers({
    "Authorization": `Client-ID ${API_KEY}`
  });

  const params = new URLSearchParams({
    query: query,
    page: page,
  });

  fetch(`${API_URL}?${params}`, { method: "GET", headers: headers })
    .then(response => response.json())
    .then(data => {
      setLoading(false);

      if (page === 1) {
        imageContainer.innerHTML = "";
      }

      if (data.results.length === 0) {
        if (page === 1) showError("No images found. Try a different search.");
        return;
      }

      data.results.forEach(result => {
        const imageCard = document.createElement("div");
        imageCard.className = "image-card";

        const imageLink = document.createElement("a");
        imageLink.href = result.links.html;
        imageLink.target = "_blank";

        const imageElement = document.createElement("div");
        imageElement.className = "image";
        const img = document.createElement("img");
        img.src = result.urls.regular;
        img.alt = result.description || `Image related to ${query}`;
        imageElement.appendChild(img);

        imageLink.appendChild(imageElement);
        imageCard.appendChild(imageLink);
        imageContainer.appendChild(imageCard);
      });
    })
    .catch(error => {
      setLoading(false);
      console.error("Error:", error);
      showError("Something went wrong. Please try again.");
    });
}

// Add event listener for "Enter" key on the input field
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default form submission behavior
    searchButton.click(); // Trigger the click event on the search button
  }
});

// Existing click event for the search button
searchButton.addEventListener("click", () => {
  generateMore.style.display = "block"; 
  currentPage = 1; 
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    searchImages(searchTerm, currentPage);
  } else {
    showError("Please enter a search term.");
  }
});

generateMore.addEventListener("click", () => {
  currentPage++; 
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    searchImages(searchTerm, currentPage);
  }
});

searchImages(""); // Initial call
