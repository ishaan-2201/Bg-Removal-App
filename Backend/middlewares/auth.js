import jwt from "jsonwebtoken";

//Middleware function to decode jwt token to get clerkId and attacj it to req.body
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized, Login again!",
      });
    }
    const decoded_token = jwt.decode(token);
    req.body.clerkId = decoded_token.clerkId;
    next();
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
