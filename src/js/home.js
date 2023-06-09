// Import our custom CSS
import "../scss/styles.scss";

import { fetchCategories, fetchProducts } from "./api";

import { redirectToSearch } from "./utils"

function firstLetterUpperCase(text) {
  return text.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
    return char.toUpperCase();
  });
}

async function fillCategories (categories)  {

  const select = document.getElementById("category-select");

  // Removing previous options
  for (let i = select.options.length - 1; i >= 0 ; i--) {
    select.remove(i);
  }

  // Setting All
  const option = document.createElement("option");
  option.text = "All";
  option.value = "all";
  select.appendChild(option);

  // Setting categories
  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement("option");
    option.text = firstLetterUpperCase(categories[i]);
    option.value = categories[i];
    select.appendChild(option);
  }
  
}
async function quickSearch() {

  const category = document.getElementById("category-select")?.value;

  const minPrice = document.getElementById("from")?.value;
  const maxPrice = document.getElementById("to")?.value;

  if (minPrice > maxPrice) {
    console.log('error min price higher than max', minPrice, maxPrice);
    alert("Preço mínimo não pode ser maior que preço máximo");
    return
  }

  await redirectToSearch({ category, minPrice, maxPrice });
}




async function setupQuickSearch() {
  
  const categories = await fetchCategories();
  fillCategories(categories);

  // Setting search button
  if (document.getElementById("quick-find-button")) {
    document.getElementById("quick-find-button").onclick = (e) => {
      e.preventDefault();
      quickSearch();
    }
  }
}

function updateCarouselItem(children, product) {
  children[1].src = product.image;

  children[1].onclick = (e) => {
    e.preventDefault();
    window.location.href = './details.html?product=' + product.id;
  }

  const texts = children[0].children;
  texts[0].innerHTML = product.title;
}

function selectRandomItems(arr, quantity) {
  // Make a copy of the original array
  const copyArray = [...arr];
  
  // Initialize an empty array to store the selected items
  const selectedItems = [];
  
  // Select three random items
  for (let i = 0; i <= quantity; i++) {
    // Generate a random index within the range of the remaining items
    const randomIndex = Math.floor(Math.random() * copyArray.length);
    
    // Remove the selected item from the copy array and add it to the selectedItems array
    const selectedItem = copyArray.splice(randomIndex, 1)[0];
    selectedItems.push(selectedItem);
  }
  
  return selectedItems;
}

function fillCarousel(products) {
  const carouselItems = document.querySelectorAll(".carousel-item");

  const carouselProducts = selectRandomItems(products, carouselItems.length);

  for (let i = 0; i < carouselItems.length; i++) {
    updateCarouselItem(carouselItems[i].children, carouselProducts[i]);
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


function createProductElement(product, type) {
  const childDiv = document.createElement('div');
  childDiv.id = type + '-product-'+ product.id;
  
  const imageElement = document.createElement('img');
  imageElement.src = product.image;
  imageElement.classList.add(type + '-image');
  imageElement.onclick = (e) => {
    e.preventDefault();
    window.location.href = './details.html?product=' + product.id;
  }
  
  const paragraphContainer = document.createElement('div');
  paragraphContainer.classList.add('paragraph-container');
  
  const title = document.createElement('a');
  title.textContent = cutString(product.title, 50);
  paragraphContainer.appendChild(title);
  title.classList.add(type + "-title");
  title.setAttribute('href', './details.html?product=' + product.id);

  const reviewStatus = document.createElement('div');
  displayStarCounter(product.rating.rate, reviewStatus, product.rating.count);
  paragraphContainer.appendChild(reviewStatus);
  reviewStatus.classList.add(type + "-stars");
  
  const price = document.createElement('p');
  price.textContent = `R$: ${normalizePrice(product.price)}`;
  paragraphContainer.appendChild(price);
  price.classList.add(type + "-price");
  
  childDiv.appendChild(imageElement);
  childDiv.appendChild(paragraphContainer);

  return childDiv;
}

function fillProductsDisplay(products, pageNumber) {
  const productsDisplay = document.querySelectorAll(".single-product-display");
  const pageOffset = pageNumber * 9;

  for (let i = 0; i < productsDisplay.length; i++) {
    const currentProduct = products[i + pageOffset];
    const productElement = createProductElement(currentProduct, 'display');
    productsDisplay[i].append(productElement);
  }
}

function addProductsToMostReviewed(products, count) {
  products.sort((a, b) => b.rating.count - a.rating.count);

  const reviews = document.getElementById("reviews");

  const previousProductCount = reviews.childElementCount - 1; // -1 because one of the child is the see more button

  for(let i = 0; i < count; i++) {
    const product = products[previousProductCount + i];

    const productElement = createProductElement(product, 'review');

    reviews.insertBefore(productElement, reviews.lastElementChild);
  }

}

function setupSeeMoreReviewsButton(products) {
  const button = document.getElementById("see-more-reviews");

  button.onclick = () => {
    addProductsToMostReviewed(products, 2);
  }
}

function setupNewsletter() {
  const button = document.getElementById("submit-newsletter");
  const input = document.getElementById("newsletter-input");
  const emailRegex = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/

  button.onclick = (event) => {
    event.preventDefault();
    if (input.value && emailRegex.test(input.value)) {
      input.value = ""
      alert("Obrigado por se registrar no nosso newsletter.");
    } else {
      alert("Email inválido.")
    }
  }
}

async function setup () {
  setupQuickSearch();
  const { products, current_page: page, total_pages: pageCount } = await fetchProducts();
  console.log('setup products', products, page, pageCount)
  fillCarousel(products);
  fillProductsDisplay(products, 0);
  addProductsToMostReviewed(products, 5);
  setupSeeMoreReviewsButton(products);
  setupNewsletter();
}

if (window.location.pathname.includes('/home')) {
  setup();
}