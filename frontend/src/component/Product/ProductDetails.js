import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails , newReview} from "../../actions/productAction.js";
import { useParams } from 'react-router-dom'; 

import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/loader.js"
import {useAlert} from "react-alert"
import MetaData from "../layout/MetaData.js";
import {addItemsToCart} from "../../actions/cartAction.js";
import { Dialog,DialogActions,DialogContent,DialogTitle,Button } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constrants/productConstrants.js";


const ProductDetails = () => {
    const { id } = useParams(); // Use useParams to get the 'id' parameter
    const dispatch = useDispatch();
    const alert = useAlert();

    const { product, loading, error } = useSelector((state) => state.productDetails);

    const{ success, error:reviewError } = useSelector(
        (state) => state.newReview
    );

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error}</div>;
    const options = {
        size:"large",
        value: product.ratings,
        readOnly: true,
        precision:0.5,
    };

    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
     
    const increaseQuantity = () => {
      if(product.stock <= quantity) return;

      const qty = quantity + 1;
      setQuantity(qty);
    };

   const decreaseQuantity = () => {
    if(1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
   };
  
   const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item Added To Cart");
  };

  const submitReviewToggle = () => {
    open ? setOpen(false) : setOpen(true);
  };

  const reviewSubmitHandler = () =>{
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId",id);
   
    dispatch(newReview(myForm));

    setOpen(false);
  };

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }

        if(reviewError){
            alert.error(reviewError);
            dispatch(clearErrors());
        }

        if (id) {
            dispatch(getProductDetails(id));
        }
        
        if(success) {
            alert.success("Review Submitted Successfully");
            dispatch({type:NEW_REVIEW_RESET})
        }

    }, [dispatch, id , error,alert,reviewError,success]); // Use id from useParams



    return (
       <Fragment>
        {loading? <Loader /> : (
             <Fragment>
                <MetaData title={`${product.name} --YouMatters`} />
             <div className="ProductDetails">
                 <div>
                     <Carousel>
                         {product.images &&
                         product.images.map((item, i) => (
                             <img 
                               className="CarouselImage"
                               key={item.url}
                               src={item.url}
                               alt={`${i} Slide`}
                             />
                         ))}
                     </Carousel>
                 </div>
                 <div>
                       <div className="detailsBlock-1">
                         <h2>{product.name}</h2>
                         <p>Product # {product._id}</p>
                       </div>
                       <div className="detailsBlock-2">
                         <Rating {...options} />
                         <span className="detailsBlock-2-span">({product.numOfReviews} Reviews)</span>
                       </div>
                       <div className="detailsBlock-3">
                         <h1>{`$${product.price}`}</h1>
                         <div className="detailsBlock-3-1">
                             <div className="detailsBlock-3-1-1">
                                 <button onClick={decreaseQuantity}>-</button>  
                                 <input readOnly type="number" value={quantity} />
                                 <button onClick={increaseQuantity}>+</button>
                             </div>{""}
                             <button disabled={product.Stock <1 ? true : false} onClick={addToCartHandler}>Add To Cart</button>
                         </div>
                         <p>
                             Status:
                              <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                 {product.Stock < 1 ? "OutOfStock" : "InStock"}
                              </b>
                         </p>
                       </div>
                       <div className="detailsBlock-4">
                         Description : <p>{product.description}</p>
                       </div>
                       <button onClick={submitReviewToggle} className="submitReview">Submit Review</button>
                 </div>
             </div>
 
             <h3 className="reviewsHeading">REVIEWS</h3>

            <Dialog 
                aria-labelledby="simple-dialog-title"
                open={open}
                onClose={submitReviewToggle}
               >

                <DialogTitle>Submit Review</DialogTitle>
                <DialogContent className="submitDialog">
                  <Rating
                    onChange={(e) => setRating(e.target.value)}
                    value={rating}
                    size="large"
                  />

                  <textarea
                    className="submitDialogTextArea"
                    cols="30"
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </DialogContent>

                <DialogActions>
                   <Button onClick={submitReviewToggle} color="secondary">Cancel</Button> 
                   <Button onClick={reviewSubmitHandler} color="primary">Subit</Button>
                </DialogActions>


            </Dialog>
 
             {product.reviews && product.reviews[0] ? (
                 <div className="reviews">
                     {product.reviews && 
                     product.reviews.map((review) => <ReviewCard review={review}/>)}
                 </div>
             ) :(
                 <p className="noReviews">No Reviews Yet</p>
             )}
 
         </Fragment>
        )}
       </Fragment>
    );
};

export default ProductDetails;
