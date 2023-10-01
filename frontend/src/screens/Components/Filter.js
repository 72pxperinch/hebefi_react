import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listProducts } from "../../actions/productActions";
import "../CSS/Filter.css"

function Filter(props) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const category = props.category
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProducts(category));

    return () => {
      //
    };
  }, [category]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };
  const sortHandler = (e) => {
    setSortOrder(e.target.value);
  };

  useEffect(() =>{
    if (setSortOrder){
      dispatch(listProducts(category, searchKeyword, sortOrder));
    }
  }, [sortOrder])
  return (
    <div className="Filter">
      <form className="fltrFrm" onSubmit={submitHandler}>
        <input
          className="fltrInpt"
          name="searchKeyword"
          placeholder="Search Keyword"
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button className="button-2" type="submit">
          Search
        </button>
      </form>
      <div className="Sort">
        Sort By{" "}
        <select name="sortOrder" onChange={sortHandler}>
          <option value="">Newest</option>
          <option value="lowest">Lowest</option>
          <option value="highest">Highest</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;
