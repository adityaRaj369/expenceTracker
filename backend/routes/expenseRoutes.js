const express = require('express');
const { addExpense, getExpenses, getInsights, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addExpense);
router.get('/', protect, getExpenses);
router.get('/insights', protect, getInsights);
router.put('/:expenseId', protect, updateExpense);
router.delete('/:expenseId', protect, deleteExpense);

module.exports = router;