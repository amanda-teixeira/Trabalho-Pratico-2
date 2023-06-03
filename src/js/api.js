const fakeStoreUrl = "https://diwserver.vps.webdock.cloud"

const fetchCategories = async () => {
    try {
        const response = await fetch(`${fakeStoreUrl}/products/categories`)

        return response.json()
    } catch (error) {
        console.log(errror)
        return []
    }
}

const fetchProductsByText = async (text) => {
    try {
        const response = await fetch(`${fakeStoreUrl}/products/search?query=${text}`)

        const data = await response.json()

        return data
    } catch (error) {
        return []
    }
}

const fetchProductsInCategory = async (category, quantity = 20, page = 1) => {
    try {
        console.log('quantity, page', quantity, page)
        const response = await fetch(`${fakeStoreUrl}/products/category/${category}?page=${page}&page_items=${quantity}`)
        
        const data = await response.json()

        console.log('data.products.length',data.products.length)

        return data
    } catch (error) {
        console.log(error)
        return []
    }
}

const fetchProducts = async (quantity = 20, page = 1) => {
    try {
        const response = await fetch(`${fakeStoreUrl}/products?page=${page}&page_items=${quantity}`)

        const data = await response.json()

        return data
    } catch (error) {
        console.log(error)
        return []
    }
}

const fetchProductById = async (productId) => {
    try {
        const response = await fetch(`${fakeStoreUrl}/products/${productId}`)

        const product = await response.json()

        return product
    } catch (error) {
        console.log(error)
        return null
    }
}

export { fetchCategories, fetchProductsInCategory, fetchProducts, fetchProductById, fetchProductsByText }