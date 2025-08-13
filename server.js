const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');


// Controllers
const authRouter = require('./controllers/auth');
const userRouter = require('./controllers/users');
const storesRouter = require('./controllers/stores');
const itemsRouter = require('./controllers/items')



// DB Connection
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(logger('dev'));


// PUBLIC ROUTES
app.use('/auth', authRouter);
app.use('/stores', storesRouter);
app.use('/stores/:storeId/items', itemsRouter)

// PROTECTED ROUTES
app.use('/users', userRouter);




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
