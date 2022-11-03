import jwt from "jsonwebtoken";


function Authtokenrole (req, res, next) {
    const token = req.cookies.access_token
        if(!token) return res.status(403).json("not authenticated!")
        
        jwt.verify(token,"msmtest", (err, userinfo)=>{
          if(err) return res.status(403).json("Token not vaild!")
          req.userinfo.role = userinfo
          next()
      });
    };

    export default Authtoken;