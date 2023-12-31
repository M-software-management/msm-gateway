import { db } from "../db.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv'
dotenv.config()



export const register = (req, res) => {
    //CHECK EXISTING USER
    const q = "SELECT * FROM users WHERE email = ? OR username = ?";
  
    db.query(q, [req.body.email, req.body.username], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("User already exists!");
  
      //Hash the password and create a user
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
  
      const q = "INSERT INTO users(`username`,`email`,`password`,`work_location`,`role`) VALUES (?)";
      const values = [req.body.username, req.body.email, hash, req.body.worklocation, req.body.role];
  
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      });
    });
  };
  

  export const login = (req, res) => {
    //CHECK USER
    
  
    const q = "SELECT * FROM users WHERE email = ?";
  
    db.query(q, [req.body.email], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("User not found!");
      //Check password
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );
  
      if (!isPasswordCorrect)
        return res.status(400).json("Wrong email  or password!");
  
      const Token = jwt.sign({ id: data[0].user_id,role: data[0].role,work_id: data[0].Work_location }, process.env.jwt_sign);
      const { password, ...other } = data[0];
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const qw = "INSERT INTO sfhs.login_amt(`user_id`,`ip_address`) VALUES (?) ";
 const values =[
    data[0].user_id,
    ip
  ]
    db.query(qw, [values], (err, data_2) => {
      if (err) return res.status(500).json(err);
  
      res.cookie("access_token", Token, {
          httpOnly: true,
        }).status(200).json(other);
      })
    });
  };
  
  export const logout = (req, res) => {
    res.clearCookie("access_token",{
      sameSite:"none",
      secure:true
    }).status(200).json("User has been logged out.")
  };