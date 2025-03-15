const apiKey = '1a70e0bdc6d7463a9b34f857c408ce12';

const blogContainer = document.getElementById("blog-container");

const searchField = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
async function fetchRandomNews() {
    try{
      const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log(data);
      return data.articles || []; // Ensure it returns an empty array if no articles are found
    }catch(error){
        console.error("Error fetching random news", error);
        return[];
    }
}

// Fetch news basedd on search
async function fetchNews(query) {
    try{
        const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apiKey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        return data.articles || [];
    } catch (error){
        console.error("Error fectching search results", error);
        return[];
    }
}
searchButton.addEventListener("click", async ()=>{
    const searchQuery = searchField.value.trim();
    if (searchQuery === "") return; // Prevent empty searches
    try{
        const articles = await fetchNews(searchQuery);
        displayBlogs(articles);
    }
    catch (error){
        console.error("Error loading articles", error);
    }
});

// Display articles in the UI
function displayBlogs(articles){
    blogContainer.innerHTML = ""; // Clear previous content
    articles.forEach((article)=>{
        if (!article.urlToImage || !article.title || !article.description) return; // Skip invalid articles
        
        const blogCard = document.createElement("div")
        blogCard.classList.add("blog-card");
        
        const img = document.createElement("img");
        img.src = article.urlToImage;
        img.alt = article.title;
        
        const title = document.createElement("h2");
        const truncatedTitle = article.title.length > 30 ? article.title.slice(0, 30) + "..." : article.title;
        title.textContent = truncatedTitle;
        
        const description = document.createElement("p");
        const truncatedDescription = article.description ? (article.description.length > 120 ? article.description.slice(0, 120) + "..." : article.description) : "No description available.";
        description.textContent = truncatedDescription;
        
        blogCard.appendChild(img);
        blogCard.appendChild(title);
        blogCard.appendChild(description);
        
        blogCard.addEventListener("click", ()=>{
            window.open(article.url, "_blank");
        });
       
        blogContainer.appendChild(blogCard);
    });
};

// Load random news on page load
(async ()=>{
    try{
        const articles = await fetchRandomNews();
        displayBlogs(articles)
        console.log(articles);
    }
    catch (error){
        console.error("Error loading articles", error);
    }
})();