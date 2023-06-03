// Import our custom CSS
import "../scss/styles.scss";
import { fetchProductById } from "./api";

function productDetailsNotFound() {
    // TODO
}


function displayStarCounter(rating, starCounter, ratingCounter) {
    starCounter.innerHTML = ''; // Clear previous stars
  
    const filledStars = Math.floor(rating); // Number of filled stars (integer part)
    const hasHalfStar = rating % 1 >= 0.5; // Check if there is a half star
    const emptyStars = 5 - filledStars - hasHalfStar; // Number of empty stars
  
    const container = document.createElement('div');
    container.className = 'star-container';
  
    // Add filled stars
    for (let i = 0; i < filledStars; i++) {
      const filledStar = document.createElement('img');
      filledStar.src = require('../assets/icons/star-fill.svg');
      container.appendChild(filledStar);
    }
  
    // Add half star
    if (hasHalfStar) {
      const halfStar = document.createElement('img');
      halfStar.src = require('../assets/icons/star-half.svg');
      container.appendChild(halfStar);
    }
  
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      const emptyStar = document.createElement('img');
      emptyStar.src = require('../assets/icons/star-empty.svg');
      container.appendChild(emptyStar);
    }
  
    const ratingCounterElement = document.createElement("span");
    ratingCounterElement.textContent = ` (${ratingCounter})`;
    
    container.appendChild(ratingCounterElement);
    starCounter.appendChild(container);
  
}


function normalizePrice(price) {
    return parseFloat(price).toFixed(2).replace('.', ',');
}

function displayProductDetails(product) {
    console.log(product);
    const parent = document.getElementById("product-details");

    const productElement = document.createElement('div');

    const title = document.createElement("h3");
    title.textContent = product.title;
    title.className = "product-details-title"

    const imageElement = document.createElement('img');
    imageElement.src = product.image;
    imageElement.alt = product.title;
    imageElement.className = "product-details-image"
    
    const paragraphContainer = document.createElement('div');
    paragraphContainer.classList.add('details-paragraph-container');
    const reviewStatus = document.createElement('div');
    displayStarCounter(product.rating.rate, reviewStatus, product.rating.count);
    paragraphContainer.appendChild(reviewStatus);
    reviewStatus.classList.add("product-details-stars");
    
    const price = document.createElement('p');
    price.textContent = `R$: ${normalizePrice(product.price)}`;
    paragraphContainer.appendChild(price);
    price.classList.add("product-details-price");
    
    const description = document.createElement('p');
    description.textContent = product.description;
    paragraphContainer.appendChild(description);
    description.classList.add("product-details-description");
  
    
    productElement.appendChild(title);
    productElement.appendChild(imageElement);
    productElement.appendChild(paragraphContainer);

    parent.appendChild(productElement);

}

async function setup () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');

    if(!productId) return window.location.href = '/home.html'

    const product = await fetchProductById(productId);

    if (!product) {
        productDetailsNotFound()
    } else {
        displayProductDetails(product)
    }
}
  
if (window.location.pathname === '/details.html') {
    setup();
}