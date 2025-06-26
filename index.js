import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import paymentRoutes from './src/routes/paymentRoutes.js';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());


app.use(cors({
  exposedHeaders: ["x-rtb-fingerprint-id"]
}));



app.use('/api/payment', paymentRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
