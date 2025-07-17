import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import {generateToken} from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js";

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

export const login = async (req,res)=> {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(400).json("Invalid Credentials!");
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(401).json("Invalid Credentials");
        }
        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic : user.profilePic
        })
    }
    catch(err){
        console.log("Error in login controller", err.message)
        res.status(500).json("Internal Server Error");
    }
}

export const logout = (req,res)=> {
    try{
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json("Logged out successfully")
    } catch(err){
        console.log("Error in logout controller", err.message)
        res.status(500).json("Internal Server Error");
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json("Profile picture is required");
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("Error in updateProfile controller", err.message);
        res.status(500).json("Internal Server Error");
    }
};

export const checkAuth = (req, res) => {
    try{
        return res.status(200).json(req.user);
    } catch(err){
        console.log("Error in checkAuth controller", err.message);
        res.status(500).json("Internal Server Error");
    }
}