import jwt from "jsonwebtoken";
import express, { response } from "express"
import redis from 'redis'
import { db } from "../db.js";
import util from 'util'
//import { client } from "../db.js";




const app = express();

//const client = createClient({
  // url: 'redis://192.168.1.17:49199'
//})
  //await client.connect();

  //client.set = util.promisify(client.set)

  const ex = 3600
  app.use(express.json());
//SELECT * FROM sfhs.Location WHERE hide=1;
export const Getworks = async (req, res) => {
 
        const q = "SELECT * FROM sfhs.work_relationship R JOIN sfhs.Location L WHERE R.work_id=L.location_uid AND R.user_id=4"
         db.query(q, [req.params.id], (err, data) => {
            if (err) return res.status(500).json(err);
           
           const works = (data.map(function(work){ var custom_jsoN = {
             work_data:{
             "name": work.Name,
             "banner": work.banner,
             "slug": work.slug
            },
            work_settings:{
              "is_admin": work.is_admin,
              "email_nofi": work.email_nofi,
              "sms_nofi": work.sms_nofi,
            },
          }
            return custom_jsoN;
            
           }
           
           )
           )
         
            return res.status(200).json(works);

    
    })
  };


  //SELECT * FROM sfhs.work_relationship R JOIN sfhs.Location L WHERE R.work_id=L.location_uid AND R.user_id=4


  export const Getworksadmin = (req, res) => {
        
    const q = "SELECT * FROM sfhs.Location;"
     db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);

});
};

 
  export const Getwork = async (req, res) => {
  
    
    const q = "SELECT * FROM sfhs.Location WHERE location_uid=?;"

  
    db.query(q, [req.params.id], (err, data) => {
     
      if (err) return res.status(500).json(err);
      return res.status(200).json(data[0]);
    })
  };


  export const Addwork = (req, res) => {
     
    const q = "INSERT INTO sfhs.Location (`Name`,`banner`,`slug`,`admin_id`) VALUES (?)"
    const values = [
      req.body.name,
      req.body.banner,
      req.body.slug,
      req.body.admin,
    ];

    db.query(q, [values], (err, data)=> {
      if(err) return res.json(err)
      return res.json("Location has been created")
    })
  }

  export const geturl = async (req, res) => {
   
    const q =  "SELECT * FROM sfhs.Location WHERE slug=?;"
  
    db.query(q, [req.params.slug], (err, data) => {
      if (err) return res.status(500).json(err);
      res.set('Phat', "Files");
      return res.status(200).json(data[0]);
      
    })
  };


  export const updatework = (req, res) => {
    const q = "UPDATE Location SET `name`=?,`banner`=?,`pfp`=?,`admin_id`=?,`slug`=?,`hide`=? WHERE location_uid=? "
  
    db.query(q, [req.body.name,req.body.banner,req.body.pfp,req.body.admin,req.body.slug,req.body.hide,req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.status(200).json("updated");
    });
  };


  export const deletework = (req, res) => {
        
    const q = "DELETE FROM sfhs.Location WHERE `location_uid`= ?"
    db.query(q, [req.params.id], (err, data)=> {
      if(err) return res.json(err)
      return res.json("Work has been Deleted")
    })
  }




  export const getshifturl = async (req, res) => {
    
    const q =  "SELECT s.*, R.user_id FROM sfhs.Location L JOIN sfhs.shifts s ON s.location_id=L.location_uid RIGHT JOIN sfhs.request R ON s.shift_id=R.shift_id WHERE slug=? AND hide_shift=1;"
  
    db.query(q, [req.params.url], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);

    })

  };

  function search (req, res) {
   
    let result;
    const first = 'SELECT `shift_id`, `date` FROM shifts WHERE shift_id=11';
    const fetchGalleryResult = db.query(first);
    console.log(fetchGalleryResult)
    result = fetchGalleryResult[0];
    for (var i in result) {
        const fetchGalleryImageResult = db.query(
          
          'SELECT `shift_id`, `user_id` FROM request WHERE shift_id=11', [result[i].shift_id],
        );
       result[i]['requests'] = fetchGalleryImageResult[0];
    }
    console.log(result);


  return result
}


export const Array = async(req, res) => {
        
  try {
    const result = await search(req.params.id);
    return res.status(200).json(result);
} catch (e) {
  
    return res.status(500).json({
        "message": "Internal Server Error"
    });
    
}
}


export const arraytest = (req, res) => {
  let result;
  const q = "SELECT `shift_id`, `date` FROM shifts WHERE shift_id=11"
  const one = db.query(q, [req.params.id], (err, data)=> {
    if(err) return res.json(err)
  
  result = one[0];

  for (var i in result) {
    const fetchGalleryImageResult = db.query(
      
      'SELECT `shift_id`, `user_id` FROM request WHERE shift_id=11', [result[i]], (err, data)=> {
   result[i]['requests'] = fetchGalleryImageResult[0];
  })
}

})
return res.status(200).json(result);

}



export const Array_2_test = async(req, res) => {

  
  const token = req.cookies.access_token
      if(!token) return res.status(403).json("not authenticated!")
      
      jwt.verify(token,"msmtest", (err, userinfo)=>{
        if(err) return res.status(403).json("Token not vaild!")


  const myquery = `SELECT S.shift_id,S.date,S.hours,S.is_picked_up,R.request_id, R.user_id, R.location_id, R.user_id, R.approved FROM sfhs.shifts S left JOIN sfhs.request R ON S.shift_id=R.shift_id AND ${userinfo.id}=R.user_id  WHERE S.location_id=? AND hide_shift=1 AND is_picked_up='false'`

db.query(myquery,[req.params.id], function(err, results, fields) {
  if (err) {
      console.log('----> Error with MySQL query in /api/showSkills: ' + err.message);
  }
  else{
      console.log('Query successful, results are being displayed.');
      

      var mylist = [];
      var subcat = [];
      var lastPushedId = 0;
      for (let key in results){
          if(lastPushedId !== results[key].shift_id){
              for (let otherkey in results){
                  if(results[otherkey].shift_id === results[key].shift_id){

                      subcat.push({
                          'Request_id': results[otherkey].request_id,
                          'Location_id': results[otherkey].location_id,
                          'User_id': results[otherkey]?.user_id,
                          'shift_id': results[otherkey]?.shift_id,
                          'Approved': results[otherkey]?.approved
    
                      });
                     
                      
                    
                     var requested = {
                        "pick_up": (results[otherkey]?.user_id==userinfo.id) ? ("yes"):("no")
                      };
                      
                  }
              }
              mylist.push({
                  'shift_id': results[key].shift_id,
                  'date': results[key].date,
                  'hours': results[key].hours,
                  'desc': results[key].desc,
                  'is_picked_up': results[key].is_picked_up,
                  'shift_requests': subcat,
                  'user_clicks': requested
              });

              subcat = [];
              lastPushedId = results[key].shift_id;
              
          }
      }
      return res.status(200).json(mylist)
      
  }
});
})
}


  //const keep = "SELECT S.* FROM sfhs.shifts S LEFT JOIN sfhs.request R ON S.shift_id=R.shift_id WHERE S.location_id=?"
  //const keep_2 = "SELECT S.*, request_id, user_id, approved FROM sfhs.shifts S LEFT JOIN sfhs.request R ON S.shift_id=R.shift_id WHERE S.location_id=? AND hide_shift=1;"


  export const getfaq = async (req, res) => {
    
    const q =  "SELECT * FROM sfhs.faq"
  
    db.query(q, [req.params.url], (err, data) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json(data);

    })

  };