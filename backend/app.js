const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const cors = require('cors');  

dotenv.config();  
connectDB();  

const app = express();


app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,  
}));

app.use(express.json());  
app.use(cookieParser());  


app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
