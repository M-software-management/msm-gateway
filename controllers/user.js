import { db } from "../db.js";

export const Getusers = (req, res) => {
  const q = req.query.Work_location ? 
  "SELECT * FROM sfhs.users WHERE work_location=?;"
  :"SELECT * FROM sfhs.users";

  db.query(q, [req.query.Work_location], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
  };


  export const Getuser = (req, res) => {
    const q = "SELECT * FROM sfhs.users WHERE user_id=?;"
  
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.status(200).json(data[0]);
    });
  };