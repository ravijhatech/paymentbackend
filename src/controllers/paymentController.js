import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import dotenv from 'dotenv';
dotenv.config({path:'.env'})

const razorpay = new Razorpay({
  key_id: process.env.ROZOPAY_API_KEY,
  key_secret: process.env.ROZOPAY_SECRET_KEY,
});

//Create Razorpay Order
export const createOrder = async (req, res) => {

  try {
    const {amount} = req.body;
    const options = {
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    };
    

    const order = await razorpay.orders.create(options);
    
    
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Verify Signature & Save Payment
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log(req.body);
    

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.ROZOPAY_SECRET_KEY)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const payment = await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: req.body.amount,
      currency: "INR",
      status: "success",
    });
    
     await payment.save();
     
     

    res.status(200).json({ success: true, message: "Payment verified", payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// payment status

export const checkPaymentStatus = async (req,res)=>{
  const {razorpay_payment_id} =req.params;
  try {
    const payment =await razorpay.payments.fetch(razorpay_payment_id);
    if(payment.status === "captured"){
      console.log("Payment captured sucessfully");    

    }else{
      console.log("Payment status",payment.status);
      
    }
    res.status(200).json({
      success:true,
      
      razorpay_payment_id:razorpay_payment_id,
      captured:payment.captured,
    })
    
  } catch (error) {
    console.log(error);
    
    
  }
}