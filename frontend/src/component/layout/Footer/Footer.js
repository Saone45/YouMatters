import React from 'react'
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css"

const Footer = () => {
  return (
   <footer id="footer">

   <div className="leftFooter">

    <h4>DOWNLOAD OUR APP</h4>
    <p>Download App for Android and IOS mobile phone</p>
    <img src={playStore} alt="playStore" />
    <img src={appStore} alt="AppStore" />

    </div>  

    <dev className="midFooter">

      <h1>YouMatters.</h1>
    <p>High Quality is our first Priority</p>

    <p>Copyrights 2024 &copy; kingSaone</p>

    </dev>

    <dev className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.instagram.com/">instagram</a>
        <a href="https://www.instagram.com/">Facebook</a>
        <a href="https://www.instagram.com/">LinkedIn</a>

    </dev>


   </footer>
  )
}

export default Footer
