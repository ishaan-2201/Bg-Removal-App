import { Webhook } from "svix";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

//API Controller function to manage clerk user with the mongodb database, i.e. whenever a user event is triggered,
//such as user created, updated, or deleted, it will send a POST request to the endpoint specified in the clerk webhook dashboard page.
//i.e. to - https://bg-removal-app-nu.vercel.app/api/user/webhooks
const clerkWebHooks = async (req, res) => {
  try {
    //Create a SVIX instance with the clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id,
          email: data.email_addresses[0].email_address,
          photo: data.image_url,
          firstName: data.first_name,
          lastName: data.last_name,
        };
        await userModel.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          photo: data.image_url,
          firstName: data.first_name,
          lastName: data.last_name,
        };

        await userModel.findOneAndUpdate({ clerkId: data.id }, userData);
        res.json({});

        break;
      }

      case "user.deleted": {
        await userModel.findOneAndDelete({ clerkId: data.id });
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API Controller function to get user's credits
const userCredits = async (req, res) => {
  try {
    const { clerkId } = req.body;
    const userData = await userModel.findOne({ clerkId });
    res.json({ success: true, credits: userData.creditBalance });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Razorpay payment Gateway initialized
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API Controller function to make payment for credits
const paymentRazorPay = async (req, res) => {
  try {
    const { clerkId, planId } = req.body;
    const userData = await userModel.findOne({ clerkId });
    if (!userData || !planId) {
      return res.json({ success: false, message: "Invalid Credentials!" });
    }
    let credits, plan, amount, date;
    switch (planId) {
      case "Basic":
        (plan = "Basic"), (credits = 100), (amount = 10);
        break;
      case "Advanced":
        (plan = "Advanced"), (credits = 500), (amount = 50);
        break;
      case "Business":
        (plan = "Business"), (credits = 5000), (amount = 250);
        break;

      default:
        break;
    }
    date = Date.now();
    const transactionData = {
      clerkId,
      plan,
      amount,
      credits,
      date,
    };
    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id,
    };
    await razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        return res.json({ success: false, message: error });
      }
      res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//API Controller function to verify the RazorPay payment
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderinfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderinfo.status == "paid") {
      const transactionData = await transactionModel.findById(
        orderinfo.receipt
      );
      if (transactionData.payment) {
        return res.json({ success: false, message: "Payment Failed!" });
      }
      //Adding credits to the user data
      const userData = await userModel.findOne({
        clerkId: transactionData.clerkId,
      });
      // userData.creditBalance+ transactionData.credits -> this is the updated credits which the user will get after the payment is successful
      await userModel.findByIdAndUpdate(userData._id, {
        creditBalance: userData.creditBalance + transactionData.credits,
      });

      // Marking the payment made to true
      await transactionModel.findByIdAndUpdate(transactionData._id, {
        payment: true,
      });
      res.json({ success: true, message: "Credits Added!" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { clerkWebHooks, userCredits, paymentRazorPay, verifyRazorpay };
