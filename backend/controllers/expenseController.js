const Expense = require('../models/Expense');

const addExpense = async (req, res) => {
  const { amount, category, date, description } = req.body;
  const userId = req.user._id;

  const expense = new Expense({ user: userId, amount, category, date, description });
  await expense.save();

  res.status(201).json(expense);
};

const getExpenses = async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, startDate, endDate, category } = req.query;

  const query = { user: userId };
  if (startDate) query.date = { $gte: new Date(startDate) };
  if (endDate) query.date = { $lte: new Date(endDate) };
  if (category) query.category = category;

  const expenses = await Expense.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  const total = await Expense.countDocuments(query);

  res.json({ expenses, total });
};

const getInsights = async (req, res) => {
  const userId = req.user._id;

  const categorySpending = await Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
  ]);

  const totalSpending = categorySpending.reduce((acc, category) => acc + category.totalAmount, 0);
  const categoryPercentages = categorySpending.map((category) => ({
    category: category._id,
    percentage: ((category.totalAmount / totalSpending) * 100).toFixed(2),
  }));

  res.json({ categorySpending, categoryPercentages });
};

const updateExpense = async (req, res) => {
  const { expenseId } = req.params;
  const { amount, category, date, description } = req.body;

  const updatedExpense = await Expense.findByIdAndUpdate(
    expenseId,
    { amount, category, date, description },
    { new: true }
  );

  if (!updatedExpense) return res.status(404).json({ message: 'Expense not found' });

  res.json(updatedExpense);
};

const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  const deletedExpense = await Expense.findByIdAndDelete(expenseId);

  if (!deletedExpense) return res.status(404).json({ message: 'Expense not found' });

  res.json({ message: 'Expense deleted successfully' });
};

module.exports = { addExpense, getExpenses, getInsights, updateExpense, deleteExpense };
