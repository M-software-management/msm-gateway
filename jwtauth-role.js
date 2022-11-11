import jwt from "jsonwebtoken";


export const Adminonly = async (req, res, next) =>{
    const token = req.cookies.access_token
        if(!token) return res.status(403).json("not authenticated!")
        
        jwt.verify(token,"msmtest", (err, userinfo)=>{
          if(err) return res.status(403).json("Token not vaild!")
          if(userinfo.role !== "overlord") return res.status(404).json("You can not access this!")
          next()
      });
    };


    export const overlord = async (req, res, next) =>{
      const token = req.cookies.access_token
          if(!token) return res.status(403).json("not authenticated!")
          
          jwt.verify(token,"msmtest", (err, userinfo)=>{
            if(err) return res.status(403).json("Token not vaild!")
            if(userinfo.role !== "overlord") return res.status(404).json("You can not access this!")
            next()
        });
      };