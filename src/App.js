import "./App.css";
import { useEffect, useState, useRef } from "react";
import { getProducts } from "./service/products.service";

function App() {
  const [productList, setProductList] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef(null);
  const pageNo = useRef(1);
  const hasMore = useRef(true);
  const isFetching = useRef(false);

  const fetchProducts = async (page) => {
    if (!hasMore.current || isFetching.current) return;
    isFetching.current = true;

    const data = await getProducts(page);

    if (data.data.length === 0) {
      hasMore.current = false;
      setIsComplete(true);
      isFetching.current = false;
      return;
    }

    setProductList((prev) => {
      // Store existing Ids to check for duplicates
      const existingIds = new Set(prev.map((p) => p.id));
      // Filter out duplicate entries from received data
      const newItems = data.data.filter((item) => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });

    isFetching.current = false;
  };

  useEffect(() => {
    ref.current.addEventListener("scroll", () => {
      const div = ref.current;

      // Fetch new data when scroll reaches near to end
      if (
        div.scrollTop + div.getBoundingClientRect().height >
        div.scrollHeight - 100
      ) {
        if (!hasMore.current || isFetching.current) return;
        ++pageNo.current;
        fetchProducts(pageNo.current);
      }
    });

    fetchProducts(pageNo.current);
  }, []);

  return (
    <div className="App">
      <div ref={ref} className="list-container">
        {productList?.map((product) => {
          return (
            <div className="list-item" key={product.id}>
              <div className="category">{product.category}</div>
              <div className="name">{product.name}</div>
              <div className="price">Price: {product.price}</div>
            </div>
          );
        })}
        

        {isComplete && <div className="end-of-list">No more items</div>}
      
      </div>
    </div>
  );
}

export default App;
