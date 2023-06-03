// Import our custom CSS
import "../scss/styles.scss";


import { fetchProductsInCategory, fetchProducts } from './api'

async function handleSearch({ category, brand, minPrice, maxPrice, text }) {
    try {
      const products = category && category !== 'all' ? await fetchProductsInCategory(category) : await fetchProducts()

      const filteredProducts = products.filter((product) => {
        if(minPrice && parseFloat(product.price) < parseFloat(minPrice)) return false
        if (maxPrice && parseFloat(product.price) > parseFloat(maxPrice)) return false

        if (brand && brand !== 'all') {
          if (!product.title.toLowerCase().includes(brand.toLowerCase())) return false
        }

        if (text) {
          if (!product.title.toLowerCase().includes(text.toLowerCase())) return false
        }

        return true

      })

      return filteredProducts
    } catch (error) {
      console.log(error);
    }
}


function normalizePrice(price) {
  return parseFloat(price).toFixed(2).replace('.', ',');
}

function cutString(string, maxLength) {
  if (maxLength >= string.length) {
    return string;
  }
  
  return `${string.slice(0, maxLength + 1)}...`;
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


function createProductElement(product) {
  const childDiv = document.createElement('div');
  childDiv.id = '-product-'+ product.id;
  childDiv.className = 'search-product-display';
  
  const imageElement = document.createElement('img');
  imageElement.src = product.image;
  imageElement.classList.add('search-product-display-image');
  imageElement.onclick = (e) => {
    e.preventDefault();
    window.location.href = './details.html?product=' + product.id;
  }
  
  const paragraphContainer = document.createElement('div');
  paragraphContainer.classList.add('paragraph-container');
  
  const title = document.createElement('a');
  title.textContent = cutString(product.title, 50);
  paragraphContainer.appendChild(title);
  title.classList.add("search-product-display-title");
  title.setAttribute('href', './details.html?product=' + product.id);

  const reviewStatus = document.createElement('div');
  displayStarCounter(product.rating.rate, reviewStatus, product.rating.count);
  paragraphContainer.appendChild(reviewStatus);
  reviewStatus.classList.add("search-product-display-stars");
  
  const price = document.createElement('p');
  price.textContent = `R$: ${normalizePrice(product.price)}`;
  paragraphContainer.appendChild(price);
  price.classList.add("search-product-display-price");
  
  childDiv.appendChild(imageElement);
  childDiv.appendChild(paragraphContainer);

  return childDiv;
}

function fillProductsDisplay(products) {
  const productsDisplay = document.getElementById("products-search-result");

  for (let i = 0; i < products.length; i++) {
    const currentProduct = products[i];
      const productElement = createProductElement(currentProduct);
      productsDisplay.append(productElement);
  }
}

function showNoProductsFound() {
  const productsDisplay = document.getElementById("products-search-result");
  const noProductsDiv = document.createElement('div');
  noProductsDiv.className = "no-products";
    
  const title = document.createElement('a');
  title.textContent = "No products found with filter, click to return to Home page";
  noProductsDiv.appendChild(title);
  title.classList.add("no-products-title");
  title.setAttribute('href', './home.html');

  productsDisplay.appendChild(noProductsDiv);
}

async function setup() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  const brand = urlParams.get('brand');
  const minPrice = urlParams.get('minPrice');
  const maxPrice = urlParams.get('maxPrice');
  const text = urlParams.get('text');

  const products = await handleSearch({category, brand, minPrice, maxPrice, text});

  if (products.length > 0) {
    fillProductsDisplay(products);
  } else {
    showNoProductsFound();
  }
}

if (window.location.pathname.includes('/search.html')) {
    setup();
}