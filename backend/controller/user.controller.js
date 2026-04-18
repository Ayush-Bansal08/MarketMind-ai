import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { inngest } from "../inngest/client.js";

const getRequestId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export const signup = async(req,res)=>{3
 const requestId = getRequestId();
 const {email,password} = req.body;
 try{
  if (!process.env.JWT_SECRET) {
    console.error(`[signup:${requestId}] Missing JWT_SECRET`);
    return res.status(500).json({ error: "Server configuration error" });
  }

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    console.log(`[signup:${requestId}] Duplicate email`, { email });
    return res.status(409).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password,10);
  const user  = await User.create({email,password: hashedPassword});

    try {
      await inngest.send({
          name: "user/signup",
          data: {email: user.email}
      });
      console.log(`[signup:${requestId}] Event sent to Inngest`);
    } catch (eventError) {
      // Signup should not fail if async email event dispatch fails.
      console.error(`[signup:${requestId}] Failed to send Inngest event`, eventError.message);
    }

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "1d"});
    res.status(201).json({token, message: "Signup successful"});
    console.log(`[signup:${requestId}] User created`, { userId: String(user._id), email });


 }
 catch(error){
    console.error(`[signup:${requestId}] Signup error`, error.message);
    if (error?.code === 11000) {
      return res.status(409).json({ error: "User already exists" });
    }
    return res.status(500).json({error: "Internal server error"});
 }
}


export const login = async(req,res)=>{
    const requestId = getRequestId();
    const {email,password} = req.body;
    try{
        if (!process.env.JWT_SECRET) {
            console.error(`[login:${requestId}] Missing JWT_SECRET`);
            return res.status(500).json({ error: "Server configuration error" });
        }

        const user = await User.findOne({email});
        if(!user){
            console.log(`[login:${requestId}] User not found`, { email });
            return res.status(401).json({error: "Invalid credentials"});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            console.log(`[login:${requestId}] Invalid password`, { email });
            return res.status(401).json({error: "Invalid credentials"});
        }
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: "1d"});
        console.log(`[login:${requestId}] Login successful`, { userId: String(user._id) });
        return res.status(200).json({token, message: "Login successful"});
    }
    catch(error){
        console.error(`[login:${requestId}] Login error`, error.message);
        return res.status(500).json({error: "Internal server error"});

    }
}

export const logout = async (req, res) => {
  const requestId = getRequestId();
  try {
    // JWT verification is already done by authenticate middleware.
    console.log(`[logout:${requestId}] Logout successful`, { userId: req.user?.id || null });
    return res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    console.error(`[logout:${requestId}] Logout error`, error.message);
    return res.status(500).json({
      error: "Logout failed",
      details: error.message
    });
  }
}

// these are the controllers for the user routes. They handle the logic for signing up, logging in, and logging out users.

