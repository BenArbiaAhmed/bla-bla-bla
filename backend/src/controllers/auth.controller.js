import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import {generateToken} from "../lib/utils.js"
import e from "express";

export const signup = async (req,res)=> {
    const {fullName, email, password} = req.body;
    try{
        if(!fullName || !password || !email){
            return res.status(400).json("All fields are required");
        }
        if(password.length < 6){
            return res.status(400).json("Password must be at least 6 characters long");
        }
        const user = await User.findOne({email: email})
        if(user){
            return res.status(400).json("Email already exists");

        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email,
            fullName,
            password: hashedPassword,
        })

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save()
            return res.status(201).json({
                userId: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
            })
        }
        else{
            return res.status(400).json("Invalid User data");
        }
    }
    catch(err){
        console.log("Error in signup controller", err.message)
        return res.status(500).json("Internal Server Error" + err.message);
    }


}

export const login = (req,res)=> {
    console.log("login request")
}

export const logout = (req,res)=> {
    console.log("logout request")
}