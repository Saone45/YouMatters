import React, { Fragment, useState } from 'react';
import "./Search.css";
import MetaData from '../layout/MetaData';


const Search = () => {
    const [keyword,setKeyword] = useState("");

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
          // Correct usage of pushState with a URL
          window.history.pushState(null, null, `/products/${keyword}`);
        } else {
          // Provide a default URL (e.g., "/products") when no keyword is present
          window.history.pushState(null, null, "/products");
        }
      };
      
  return (
   <Fragment>
    <MetaData title="Search A Product -- YouMatters" />
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input 
        type= "text"
        placeholder='Search a Product...'
        onChange={(e)=> setKeyword(e.target.value)}
        />
        <input type="submit" value="search" />
      </form>
   </Fragment>
  );
};

export default Search
