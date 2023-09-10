import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../CSS/Navbar.css"

function Navbar () {

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const [on, setOn] = useState("menu");
  const [active, setActive] = useState("hamburger");

  function toggle(event) {
    on === "menu" ? setOn("menu menu-down") : setOn("menu");
    active === "hamburger"
      ? setActive("hamburger is-active")
      : setActive("hamburger");

    event.preventDefault();
  }
  return (
    <header>
    <nav className="navbar">
      <div>
        <div className="navbar-wrap">
          <div>
            <div className="navItems">
              <div className="Logo">
                <div>
                  <Link to="/">
                    <div className="Logo-img"></div>
                    {/* <img
                      className="Logo-img"
                      src="/Assets/Logo.png"
                      loading="lazy"
                      alt=""
                    /> */}
                  </Link>
                </div>
                <div>
                  <button className={active} onClick={toggle}>
                    <div className="bar"></div>
                  </button>
                </div>
              </div>
              <nav role="navigation" className={on}>
                <div className="menu-wrap">
                  <ul className="menu-items">
                    <li>
                      <Link to="/category/Shirts" className="nav-link">
                        Shirts
                      </Link>
                    </li>
                    <li>
                      <Link to="/category/Pants" className="nav-link">
                        Pants
                      </Link>
                    </li>
                  </ul>
                  <ul className="menu-items">
                    <li>
                      <a href="/cart" className="nav-link">
                        Cart
                      </a>
                    </li>

                    {userInfo ? (
                      <li>
                        <Link to="/profile" className="nav-link">
                          {userInfo.name}
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link to="/signin" className="nav-link">
                          Sign In
                        </Link>
                      </li>
                    )}
                    {userInfo && userInfo.isAdmin && (
                      <div className="dropdown nav-link right">
                        <a href="/profile">Admin</a>
                        <ul className="dropdown-content">
                          <li>
                            <Link to="/orders">Orders</Link>
                            <Link to="/products">Products</Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div className="top-gap"></div>
  </header>
  )
}

export default Navbar;