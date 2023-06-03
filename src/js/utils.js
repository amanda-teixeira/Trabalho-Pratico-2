const redirectToSearch = async ({ category, minPrice, maxPrice, text, page = 1 }) => {
    console.log('redirect to page', page)
    let queryParams = '';
  
    if (category) {
      queryParams += `category=${encodeURIComponent(category)}&`;
    }
    if (minPrice) {
      queryParams += `minPrice=${encodeURIComponent(minPrice)}&`;
    }
    if (maxPrice) {
      queryParams += `maxPrice=${encodeURIComponent(maxPrice)}&`;
    }
    if (text) {
      queryParams += `text=${encodeURIComponent(text)}&`;
    }

    queryParams += `page=${page}`;
  
    console.log(queryParams);
    window.location.href = './search.html?' + queryParams;
  }

export { redirectToSearch }