const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductsReviews, deleteReview ,getAdminProducts} = require("../controllers/productController");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();


router.route("/products").get(getAllProducts);

router.route("/admin/products").get(isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts);

router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin") ,createProduct);

router.route("/admin/product/:id").put(isAuthenticatedUser,  authorizeRoles("admin")  ,updateProduct).delete( isAuthenticatedUser,  authorizeRoles("admin")  ,deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser,createProductReview).delete(isAuthenticatedUser, deleteReview);

router.route("/reviews").get(getProductsReviews);



module.exports = router