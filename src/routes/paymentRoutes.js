import express from 'express';
import { checkPaymentStatus, createOrder, verifyPayment } from '../controllers/paymentController.js';


const router = express.Router();

router.post('/create', createOrder);
router.post('/verify', verifyPayment);
router.get("/check-status/:razorpay_payment_id",checkPaymentStatus);

export default router;
