import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Rating from "./Components/Rating";
import Filter from "./Components/Filter";
import "./CSS/HomeScreen.css";
import Hero from "./Components/Hero";
import AboutUs from "./Components/AbtUs";

function HomeScreen(props) {
  const category = props.match.params.id ? props.match.params.id : "";
  const productList = useSelector((state) => state.productList);
  const st = useSelector((state) => state)
  console.log(st)
  const { products, loading, error } = productList;

  return (
    <>
      <Hero />
      <div className="HomeBox">
        <h1 className="heading">OUR PRODUCTS</h1>
        <Filter readit={category} />
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div>
            {products.length > 0 && (
              <div className="product-list">
                {products.map((card, index) => (
                  <div key={index} className="product">
                    <Link to={"/product/" + card.product_id}>
                      <img
                        src={card.images[0]}
                        loading="lazy"
                        alt=""
                        className="product-img"
                      />
                    </Link>
                    <div className="product-info">
                      <div className="product-name">
                        <Link to={"/product/" + card._id}>{card.name}</Link>
                      </div>
                      <p className="paragraph-2">{card.brand}</p>
                      <p className="paragraph">Rs. {card.price}</p>
                    </div>
                    {/* <div className="product-rating">
                      <Rating
                        value={card.rating}
                        text={card.numReviews + " reviews"}
                      />
                    </div> */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <AboutUs />
    </>
  );
}
export default HomeScreen;
