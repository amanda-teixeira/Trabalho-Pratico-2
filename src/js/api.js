const fakeStoreUrl = "https://fakestoreapi.com"

const fetchCategories = async () => {
    try {
        const response = await fetch(`${fakeStoreUrl}/products/categories`)

        return response.json()
    } catch (error) {
        console.log(errror)
        return []
    }
}

const fetchProductsInCategory = async (category) => {
    try {
        const response = await fetch(`${fakeStoreUrl}/products/category/${category}`)
        
        return response.json()
    } catch (error) {
        console.log(error)
        return []
    }
}

const fetchProducts = async () => {
    try {
        const response = await fetch(`${fakeStoreUrl}/products`)

        return response.json()
    } catch (error) {
        console.log(error)
        return []
    }
}

export { fetchCategories, fetchProductsInCategory, fetchProducts }