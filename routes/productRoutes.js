const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /products - List all products
router.get('/', productController.index);

// GET /products/new - Show form to create new product
router.get('/new', productController.new);

// POST /products - Create new product
router.post('/', productController.create);

// GET /products/:id - Show specific product
router.get('/:id', productController.show);

// GET /products/:id/edit - Show form to edit product
router.get('/:id/edit', productController.edit);

// PUT /products/:id - Update product
router.put('/:id', productController.update);

// DELETE /products/:id - Delete product
router.delete('/:id', productController.delete);

module.exports = router;
