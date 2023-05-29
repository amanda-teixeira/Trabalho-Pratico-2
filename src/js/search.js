// Import our custom CSS
import "../scss/styles.scss";


import { fetchProductsInCategory, fetchProducts } from './api'

async function handleSearch({ category, brand, minPrice, maxPrice }) {
    try {
      const products = category && category !== 'all' ? await fetchProductsInCategory(category) : await fetchProducts()
  
      console.log(products)
    } catch (error) {
      console.log(error);
    }
  }