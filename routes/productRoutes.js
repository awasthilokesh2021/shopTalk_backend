const express = require("express");
const router = express.Router();
const { createProduct,getAllProducts,getProductById, likeProduct, commentProduct,deleteComment } = require("../controllers/productController");
const getAuth = require("../MiddleWare/authMiddleware");

// POST /api/products
router.post("/create", createProduct);
router.get('/products', getAllProducts);
router.post('/products/:id/like', getAuth, likeProduct);
router.post('/products/:id/comment', getAuth, commentProduct);
router.delete('/products/:productId/comments/:commentId', getAuth, deleteComment);
router.get("/products/:id", getProductById); 

module.exports = router;
