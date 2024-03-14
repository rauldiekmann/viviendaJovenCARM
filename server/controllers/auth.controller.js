import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler } from "../utils/errorHandler.js"

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json("Registrado con éxito");
    } catch (error) {
      next(error);
    }
};

