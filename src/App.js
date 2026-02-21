import "./App.css";
import { useEffect, useState, useRef } from "react";
import { getProducts } from "./service/products.service";

function App() {
  const [productList, setProductList] = useState([]);
  const ref = useRef(null);
  const pageNo = useRef(1);

  const fetchProducts = async (page) => {
    const data = await getProducts(page);

    setProductList((prev) => {
      // Store and remove duplicate Ids of data
      const existingIds = new Set(prev.map((p) => p.id));
      // Check for Duplicate entries from received data
      const newItems = data.data.filter((item) => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });
  };

  useEffect(() => {
    ref.current.addEventListener("scroll", () => {
      const div = ref.current;

      // Fetch new data when scroll reaches near to end
      if (
        div.scrollTop + div.getBoundingClientRect().height >
        div.scrollHeight
      ) {
        ++pageNo.current;
        fetchProducts(pageNo.current);
      }
    });

    fetchProducts();
  }, []);

  return (
    <div className="App">
      <div ref={ref} className="list-container">
        {productList?.map((product) => {
          return (
            <div className="list-item" key={product.id}>
              <div className="category">{product.category}</div>
              <div className="name">{product.name}</div>
              <div className="price">{product.price}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
