// Import our custom CSS
import "../scss/styles.scss";

import { fetchCategories, fetchProducts } from "./api";

const brandCategoriesMap = new Map([
  ["Apple", ["Electronics"]],
  ["Samsung", ["Electronics"]],
  ["LG", ["Electronics"]],
  ["Casio", ["Electronics", "Jewelry"]],
  ["Tiffany & Co.", ["Jewelry"]],
  ["Pandora", ["Jewelry"]],
  ["Cartier", ["Jewelry"]],
  ["Rolex", ["Jewelry"]],
  ["H&M", ["Men's Clothing", "Women's Clothing"]],
  ["Zara", ["Men's Clothing", "Women's Clothing"]],
  ["Nike", ["Men's Clothing", "Women's Clothing"]],
  ["Adidas", ["Men's Clothing", "Women's Clothing"]],
  ["Levi's", ["Men's Clothing", "Women's Clothing"]],
  ["Gucci", ["Men's Clothing", "Women's Clothing"]],
  ["Prada", ["Men's Clothing", "Women's Clothing"]],
  ["Victoria's Secret", ["Women's Clothing"]]
]);

let products = []

function firstLetterUpperCase(text) {
  return text.toLowerCase().replace(/(?:^|\s)\S/g, function (char) {
    return char.toUpperCase();
  });
}

async function fillCategories (categories)  {

  console.log(categories)
  const select = document.getElementById("category-select")

  // Removing previous options
  for (let i = select.options.length - 1; i >= 0 ; i--) {
    console.log('removing', i, select)
    select.remove(i)
  }

  // Setting All
  const option = document.createElement("option");
  option.text = "All"
  option.value = "all"
  select.appendChild(option);

  // Setting categories
  for (let i = 0; i < categories.length; i++) {
    const option = document.createElement("option");
    option.text = firstLetterUpperCase(categories[i]);
    option.value = categories[i];
    select.appendChild(option);
  }
  
}

async function fillBrand () {
  const select = document.getElementById("brand-select")
  const brands = Array.from(brandCategoriesMap.keys())

  // Setting All
  const option = document.createElement("option");
  option.text = "All"
  option.value = "all"
  select.appendChild(option);

  // Setting brands
  for (let i = 0; i < brands.length; i++) {
    const option = document.createElement("option");
    option.text = [brands[i]];
    option.value = brands[i];
    select.appendChild(option);
  }
}

async function quickSearch() {
  const brand = document.getElementById("brand-select")?.value

  const category = document.getElementById("category-select")?.value

  const minPrice = document.getElementById("from")?.value
  const maxPrice = document.getElementById("to")?.value

  if (minPrice > maxPrice) {
    console.log('error min price higher than max', minPrice, maxPrice);
    alert("Preço mínimo não pode ser maior que preço máximo")
    return
  }

  await redirectToSearch({ category, brand, minPrice, maxPrice })
}

async function redirectToSearch({ category, brand, minPrice, maxPrice, text}) {
  let queryParams = ''

  if (category) {
    queryParams += `category=${encodeURIComponent(category)}&`
  }
  if (brand) {
    queryParams += `brand=${encodeURIComponent(brand)}&`
  }
  if (minPrice) {
    queryParams += `minPrice=${encodeURIComponent(minPrice)}&`
  }
  if (maxPrice) {
    queryParams += `maxPrice=${encodeURIComponent(maxPrice)}&`
  }
  if (text) {
    queryParams += `text=${encodeURIComponent(text)}&`
  }
  
  // Remove trailing '&'
  queryParams = queryParams.slice(0, -1);

  window.location.href = 'search.html?' + queryParams
}


async function setupQuickSearch() {
  
  const categories = await fetchCategories();
  fillCategories(categories);
  fillBrand();

  const brandSelect = document.getElementById("brand-select")
  brandSelect.onchange = async (e) => {
    const selectedOption = brandSelect[brandSelect.selectedIndex];

    const availableCategories = brandCategoriesMap.get(selectedOption.value)
    if (selectedOption.value === "all") {
      fillCategories(categories)
    } else {
      fillCategories(availableCategories);
    }
};

  // Setting search button
  if (document.getElementById("quick-find-button")) {
    document.getElementById("quick-find-button").onclick = (e) => {
      e.preventDefault();
      quickSearch();
    }
  }
}

function updateCarouselItem(children, product) {
  children[1].src = product.image

  children[1].onclick = (e) => {
    e.preventDefault();
    window.location.href = 'details.html?product=' + product.id
  }

  const texts = children[0].children
  texts[0].innerHTML = product.title
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
  console.log(products);
  const carouselItems = document.querySelectorAll(".carousel-item");

  console.log(carouselItems);

  const carouselProducts = selectRandomItems(products, carouselItems.length);

  for (let i = 0; i < carouselItems.length; i++) {
    updateCarouselItem(carouselItems[i].children, carouselProducts[i]);
  }
}

function fillProductsPage(products, pageNumber) {

}

function addProductsToMostReviewed(products, count) {
  products.sort((a, b) => b.rating.count - a.rating.count);

  const reviews = document.getElementById("reviews");

  const previousProductCount = reviews.childElementCount - 1 // -1 because one of the child is the see more button

  for(let i = 0; i < count; i++) {
    const product = products[previousProductCount + i];

    const childDiv = document.createElement('div');
    childDiv.id = 'review-product-'+ product.id;
    
    const imageElement = document.createElement('img');
    imageElement.src = product.image;
    imageElement.classList.add('review-image');
    imageElement.onclick = (e) => {
      e.preventDefault();
      window.location.href = 'details.html?product=' + product.id
    }
    
    const paragraphContainer = document.createElement('div');
    paragraphContainer.classList.add('paragraph-container');
    
    const title = document.createElement('a');
    title.textContent = product.title;
    paragraphContainer.appendChild(title);
    title.classList.add("review-title")
    title.setAttribute('href', 'details.html?product=' + product.id)
    
    const reviewStatus = document.createElement('p');
    reviewStatus.textContent = product.title;
    paragraphContainer.appendChild(reviewStatus);
    reviewStatus.classList.add("review-stars")
    
    const price = document.createElement('p');
    price.textContent = `R$: ${product.price}`;
    paragraphContainer.appendChild(price);
    price.classList.add("review-price")
    
    childDiv.appendChild(imageElement);
    childDiv.appendChild(paragraphContainer);

    reviews.insertBefore(childDiv, reviews.lastElementChild)
  }

}

function setupSeeMoreReviewsButton(products) {
  const button = document.getElementById("see-more-reviews");

  button.onclick = () => {
    addProductsToMostReviewed(products, 2)
  }
}

async function setup () {
  setupQuickSearch();
  products = await fetchProducts();
  fillCarousel(products);
  fillProductsPage(products, 0);
  addProductsToMostReviewed(products, 5);
  setupSeeMoreReviewsButton(products);
}

if (window.location.pathname === '/home.html') {
  setup()
}