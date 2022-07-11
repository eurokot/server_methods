const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { get, add, update, remove, all } = require('../controllers/main');

router.get('/todos', asyncHandler(get));

router.post('/todos', asyncHandler(add));

router.put('/todos/:id', asyncHandler(update));

router.delete('/todos/:id', asyncHandler(remove));

router.get('*', all);

module.exports = router;
