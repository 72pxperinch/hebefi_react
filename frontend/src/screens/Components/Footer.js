import React from "react";
import "../CSS/Footer.css";

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="footerWrap">
        <div className="footerItems">
          <a href="#">
            <img
              src="https://uploads-ssl.webflow.com/64b0e4ee2a38198b994e7182/64db7cbf9e0e204830a13bc1_Asset%202.png"
              loading="lazy"
              alt=""
              className="footerImg"
            />
          </a>
          <div className="footerGrid">
            <div
              id="w-node-_714104d1-bbef-f2d7-09fb-adae00ed9bc4-994e71af"
              className="footerGridContent"
            >
              <div className="footerTitle">Company</div>
              <a href="#" className="footerLink">
                How it works
              </a>
              <a href="#" className="footerLink">
                Pricing
              </a>
              <a href="#" className="footerLink">
                Docs
              </a>
            </div>
            <div
              id="w-node-_714104d1-bbef-f2d7-09fb-adae00ed9bcd-994e71af"
              className="footerGridContent"
            >
              <div className="footerTitle">Resources</div>
              <a href="#" className="footerLink">
                Products
              </a>
              <a href="#" className="footerLink">
                Brands
              </a>
              <a href="#" className="footerLink">
                Categories
              </a>
            </div>
            <div
              id="w-node-_714104d1-bbef-f2d7-09fb-adae00ed9bd8-994e71af"
              className="footerGridContent"
            >
              <div className="footerTitle">About</div>
              <a href="#" className="footerLink">
                Terms &amp; Conditions
              </a>
              <a href="#" className="footerLink">
                Privacy policy
              </a>
              <div className="footer-social-block">
                <a href="#" className="footer-social-link w-inline-block">
                  <img
                    src="https://uploads-ssl.webflow.com/62434fa732124a0fb112aab4/62434fa732124ac15112aad5_twitter%20small.svg"
                    loading="lazy"
                    alt=""
                  />
                </a>
                <a href="#" className="footer-social-link w-inline-block">
                  <img
                    src="https://uploads-ssl.webflow.com/62434fa732124a0fb112aab4/62434fa732124a389912aad8_linkedin%20small.svg"
                    loading="lazy"
                    alt=""
                  />
                </a>
                <a href="#" className="footer-social-link w-inline-block">
                  <img
                    src="https://uploads-ssl.webflow.com/62434fa732124a0fb112aab4/62434fa732124a51bf12aae9_facebook%20small.svg"
                    loading="lazy"
                    alt=""
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footerDivider"></div>
      <div className="Copyright">Copyright © 2023 HEBEFI</div>
    </footer>
  );
};

export default Footer;
