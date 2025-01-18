import React, { Fragment, useEffect } from 'react';
import { CgMouse } from 'react-icons/cg';
import "./Home.css";
import ProductCard from "./productCard.js";
import MetaData from "../layout/MetaData.js";
import { clearErrors, getProduct } from "../../actions/productAction.js";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/loader.js"
import {useAlert} from "react-alert";




const Home = () => {
  
  const alert = useAlert();

  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

  useEffect(() => {
    if(error) {
      alert.error(error);
      dispatch(clearErrors());
    };
    dispatch(getProduct());
  }, [dispatch,error,alert]);

  // Rest of your component code...

  return (
   <>

     {loading ? (<Loader />):(
       <>
      
       <MetaData title="YouMatters" />
 
       <div className="banner">
         <p>Welcome to YouMatters</p>
         <h1>FIND AMAZING PRODUCT BELOW</h1>
 
         <a href="#container">
           <button>
             Scroll <CgMouse />
           </button>
         </a>
       </div>
 
        <h2 className="homeHeading">Featured Products</h2>
 
        <div className="container" id="container">
         {products && products.map((product) => (<ProductCard product ={product} />))}
        </div>
 
 
     </>
     )}


   </>
  );
};

export default Home;
