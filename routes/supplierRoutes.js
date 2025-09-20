const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

// GET /suppliers - List all suppliers
router.get('/', supplierController.index);

// GET /suppliers/new - Show form to create new supplier
router.get('/new', supplierController.new);

// POST /suppliers - Create new supplier
router.post('/', supplierController.create);

// GET /suppliers/:id - Show specific supplier
router.get('/:id', supplierController.show);

// GET /suppliers/:id/edit - Show form to edit supplier
router.get('/:id/edit', supplierController.edit);

// PUT /suppliers/:id - Update supplier
router.put('/:id', supplierController.update);

// DELETE /suppliers/:id - Delete supplier
router.delete('/:id', supplierController.delete);

module.exports = router;
