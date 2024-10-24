import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listProducts } from "../actions/productActions";
import "./CSS/CategoryScreen.css";
import Rating from "./Components/Rating";

function CategoryScreen(props) {
  const category = props.match.params.id ? props.match.params.id : "";
  const productList = useSelector((state) => state.productList);
  const { products, loading, error } = productList;
  const dispatch = useDispatch();
  const st = useSelector((state) => state)
  console.log(st)
  useEffect(() => {
    dispatch(listProducts(category));

    return () => {
      //
    };
  }, [category]);


  return (
    <>
      <div className="CatBox">
        {category && <h1 className="heading">{category}</h1>}
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
                    <Link to={"/product/" + card._id}>
                      <img
                        src={card.image}
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
    </>
  );
}
export default CategoryScreen;
