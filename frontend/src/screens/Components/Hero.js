import React from 'react';
import "../CSS/Hero.css"

function Hero () {
  return (
    <div className="Hero">
    <div className="HeroBox">
      <img
        src="/Assets/LogoImg.png"
        loading="lazy"
        alt=""
        className="HeroLogo"
      />
      <div className="HeroText">
        <p>
          As the world diversifies, people's worries continue to change. We
          believe so and face beauty healthcare. After wiping away all
          anxiety and hesitation, there is surely true beauty and comfort.
          HEBEFI delivers dignified beauty to each and every human being.
        </p>
      </div>
    </div>
  </div>
  )
}

export default Hero;