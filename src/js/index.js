// Import our custom CSS
import "../scss/styles.scss";

import { fetchCategories } from "./api";

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
      quickSearch()
    }
  }
}

async function fillCarrousel() {
  
}

async function fillProductsPage(pageNumber) {

}

async function setup () {
  setupQuickSearch();
  fillCarrousel();
  fillProductsPage(0);
}


setup()