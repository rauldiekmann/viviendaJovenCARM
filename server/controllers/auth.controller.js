import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = await bcryptjs.hash(password, 12);
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json("Registrado con éxito");
    } catch (error) {
      res.status(500).json(error.message);  
    }
    await newUser.save()
    res.status(201).json("Registrado con éxito")
};

