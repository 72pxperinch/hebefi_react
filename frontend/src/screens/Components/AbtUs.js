import React from 'react';
import "../CSS/AbtUs.css"

const AboutUs = () => {
  return (
    <div className="AbtBox">
    <h1 className="heading">ABOUT US</h1>
    <img
      src="https://uploads-ssl.webflow.com/64b0e4ee2a38198b994e7182/64dbc35b7acf4e47ab026624_Team.jpg"
      loading="lazy"
      sizes="(max-width: 767px) 100vw, 600px"alt="Us.jpg"
      className="abtImg"
    />
    <p className="abtPara">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
      varius enim in eros elementum tristique. Duis cursus, mi quis viverra
      ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
      Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc
      ut sem vitae risus tristique posuere.
    </p>
    <div className="abtBtnBox">
      <a href="#" className="abtBtn">
        KNOW MORE
      </a>
    </div>
  </div>
  )
}

export default AboutUs;