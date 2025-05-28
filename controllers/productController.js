const Product = require("../models/Product");

// apn new product add kr rhe hai isme 
const createProduct = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    console.log(req.body)

    const newProduct = new Product({
      name,
      image,
      description,
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('likes', 'name')
      .populate('comments.user', 'name');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching products" });
  }
};

// Get Single Product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("comments.user", "name"); // to get user's name in comments

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


//  Like Product
const likeProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.userID;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Check if already liked
    if (product.likes.includes(userId)) {
      return res.status(400).json({ message: "Product already liked" });
    }

    product.likes.push(userId);
    await product.save();

    res.status(200).json({ message: "Product liked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error liking product" });
  }
};

//  Comment on Product
const commentProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.userID;
    const { text } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const newComment = {
      user: userId,
      text,
      createdAt: new Date(),
    };

    product.comments.push(newComment);
    await product.save();

    res.status(200).json({ message: "Comment added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error commenting on product" });
  }
};

//delete comment
// 📌 Delete a comment
const deleteComment = async (req, res) => {
  try {
    const productId = req.params.productId;
    const commentId = req.params.commentId;
    const userId = req.userID;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // Find the comment
    const comment = product.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Check ownership
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }

    // Remove the comment
    comment.remove();
    await product.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    res.status(500).json({ error: "Error deleting comment" });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  likeProduct,
  commentProduct,
  deleteComment
};
