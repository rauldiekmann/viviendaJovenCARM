import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
      const validUser = await User.findOne({email});
      if(!validUser){
        return next(errorHandler(404, "Usuario no encontrado"));
      }
      const validPassword = await bcryptjs.compareSync(password, validUser.password);
      if (!validPassword){
        return next(errorHandler(401, "Credenciales incorrectas"));
      }
    const token = jwt.sign({id: validUser.id}, process.env.JWT_SECRET);
    const {password: pass, ...rest} = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true})
      .status(200)
      .json(rest);
    } catch (error) {
      next(error);
    }
};

export const google = async (req, res, next) => {
    try {
      const user = await User.findOne({email: req.body.email});
      if (user){
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = user._doc;
        res
          .cookie("access_token", token, { httpOnly: true})
          .status(200)
          .json(rest);
      }else{
        //Si no existe el usuario, lo creamos. Como Google no te da la contraseña,
        // le ponemos una por defecto que luego el usuario podrá cambiar
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        /*Generamos el nombre de usuario con el nombre y numeros */
        const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),
         email: req.body.email, password: hashedPassword});
        await newUser.save();
        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = newUser._doc;
        res.cookie("access_token", token, { httpOnly: true})
          .status(200)
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("Has cerrado sesión");
  } catch (error) {
    next(error);
  }
};