const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
export const getProducts = async (page=1) => {


  const response = await fetch(`${BASE_API_URL}items?_page=${page}`);
  const data = await response.json();
  return data;
};
