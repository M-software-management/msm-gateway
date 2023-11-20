import axios from 'axios'
import cheerio from 'cheerio'
import { db } from "../db.js";
import fs, { link } from 'fs'
import path from 'path';
import { dirname } from 'path';
import { v4 as uuidv4} from 'uuid'
const __dirname = path.resolve();
const filePath = path.join(__dirname, './controllers/test.html');
import dotenv from 'dotenv'; // Import the dotenv library to load environment variables from a .env file
dotenv.config();





  const url = "https://sfhs.hcshiring.com/jobs";
  const Baseurl = "https://sfhs.hcshiring.com";
  

  export const scrapeData = async () => {
    try {
      // Fetch HTML of the page we want to scrape
      const { data } = await axios.get(url);
      const html = data
      
      // Load HTML we fetched in the previous line
      const $ = cheerio.load(html);
      console.log($.html)
      // Select all the list items in plainlist class
      const listItems = $(".list-group li");
      // Stores data for all countries
      const countries = [];
      // Use .each method to loop through the li we selected
      listItems.each((idx, el) => {
        // Object holding data for each country/jurisdiction
        
        // Select the text content of a and span elements
        // Store the textcontent in the above object
        const name = $(el).find('h4').text();
        const work_name = $(el).find('.list-group-item-text p').text();
        const desc = $(el).children(".list-group-item-text").text();
        const link_url = $(el).children(".list-group-item a").attr('href');
        console.log(work_name)
         const country = { name: name, work_name: work_name, Desc: desc, Url: Baseurl + link_url };
        
        // Populate countries array with country data
       
        countries.push(country);
      });
      // Logs countries array to the console
      console.dir(countries);
      // Write countries array in countries.json file
      fs.writeFile("coutries.json", JSON.stringify(countries, null, 2), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Successfully written data to file");
      });
    } catch (err) {
      console.error(err);
    }
  }
  // Invoke the above function
  //scrapeData();




// code that works for scraping sfhs jobs and sends to db---------------------

async function scrapeApiWithPagination(apiEndpoint, pageSize = 20) {
  let page = 1;
  let allData = [];

  while (true) {
    const response = await axios.get(apiEndpoint + page);

    const newData = response.data;

    // Assuming the API returns an array of data in a key like 'items'
    if (newData && newData.jobs && newData.jobs.length > 0) {
      allData = allData.concat(newData.jobs);
      page++;
    } else {
      // No more data, break out of the loop
      break;
    }
  }
  allData.forEach(element => {
 const uid = uuidv4()
 const qw = "SELECT * FROM msm_wcj.jobs WHERE external_id=?";
console.log(element.id)
 db.query(qw, [element.id], (err, data) => {
  if (data.length) return ("job already exists!");
   
   
 
  const q = "INSERT IGNORE INTO msm_wcj.jobs (`job_id`,`job_title`,`summary`,`organization`,`street`,`city`,`state`,`zip`,`external_id`) VALUES (?)"
 const values = [
 uid,
 element.job_title,
 element.summary,
 element.organization,
 element.street,
 element.city,
 element.state,
 element.zip,
element.id
 
];

 db.query(q,[values], (err, data_24)=> {
  
  


 

  return ("done");

}); })
  })
  
}

// Example usage:
const apiEndpoint = 'https://sfhs.hcshiring.com/0d971156/api/jobs?category=&distance=-1&filters=&internal=false&job=&jobSelected=false&location=&openOnly=false&orgId=&page=';
//const scrapedData = await scrapeApiWithPagination(apiEndpoint);

//console.log(scrapedData);



///----------------------------------------------------------------------------------------------------------------------------------------





// didnt need anymore----------------------------------------------------------------------------------

export const insert_jobs_into_db_function = async (req, allData,res) => {




allData.forEach(element => {

 const qw = "SELECT * FROM msm_wcj.jobs WHERE external_id=?";

 db.query(qw, [element.id], (err, data) => {
   if(data.length==0){
                  return res.status(200).json("job has already been added!");}
            
   
   


 const uid = uuidv4()
 
 
  const q = "INSERT IGNORE INTO msm_wcj.jobs (`job_id`,`job_title`,`summary`,`organization`,`street`,`city`,`state`,`zip`,`external_id`) VALUES (?)"
 const values = [
 uid,
 element.job_title,
 element.summary,
 element.organization,
 element.street,
 element.city,
 element.state,
 element.zip,
element.id
 
];

 db.query(q,[values], (err, data_24)=> {
  
  


 

  return res.status(200).json("done");

}); 
})
});
}


///----------------------------------------------------------------------------------------------------------------------------------------



///----wordpress code that didnt work
///----------------------------------------------------------------------------------------------------------------------------------------

const wpCofig = {
  url: 'https://westcentralmnjobs.com',
  username: 'nodejs-cli',
  password: "EQo&ZK(#zNm4)Qf1XZ!EgHHz"
};

// Create an instance of the WordPress class

export async function createPost(post) {
  try {
    const response = await axios.post(`${wpCofig.url}/wp-json/wp/v2/posts`, post, { headers: this.headers });
    return response.data;
  } catch (error) {
    throw new Error(`Error while creating post: ${error}`);
  }
}



const post = {
  title: 'Hello World',
  content: 'My Post Content.',
  status: 'draft'
};

// Call the createPost method from the WordPress instance and log the result
//console.log(await wp.createPost(post));


///----------------------------------------------------------------------------------------------------------------------------------------




// wordpress code that does work but workin progress

const wordpressApiUrl = 'https://www.jeremymichaelsontreeservice.com/wp-json/wp/v2/posts';
const username = 'nodejs-cli';
const password = 'EQo&ZK(#zNm4)Qf1XZ!EgHHz';

const createWordPressPost = async () => {
  try {
    // Get the authentication token
    const response = await axios.post('https://www.jeremymichaelsontreeservice.com/wp-json/jwt-auth/v1/token', {
      username,
      password,
    });

    const { token } = response.data;

    // Create a new post
    const postResponse = await axios.post(wordpressApiUrl, {
      title: 'Your Post Title',
      content: 'Your post content goes here.',
      status: 'publish', // You can change this to 'draft' if you want to save it as a draft
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Post created successfully:', postResponse.data);
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
  }
};

// Call the function to create a post
//createWordPressPost();

//--------------------------------------------------------




export const GetJobs_by_id = (req, res) => {
  
  const q =  "SELECT * FROM `msm_wcj`.jobs WHERE `external_id`= ?"
  
    db.query(q,[req.params.id], (err, data)=> {
      if (err) return res.json(err)
      return res.status(200).json(data[0]);
    
    });
  };







  function removeDuplicateJobIds() {
    db.query('SELECT external_id, COUNT(*) as count FROM jobs GROUP BY external_id HAVING count > 1', (error, results) => {
      if (error) {
        console.error('Error selecting duplicate job IDs:', error);
        
        return;
      }
  
      if (results.length === 0) {
        console.log('No duplicate job IDs found.');
        
        return;
      }
  
      results.forEach((row) => {
        const jobId = row.id;
        console.log(jobId)
  
        db.query('SELECT `external_id` FROM jobs WHERE external_id = ? ORDER BY external_id DESC LIMIT ?', [jobId, row.count - 1], (err, rowsToDelete) => {
          if (err) {
            console.error('Error selecting duplicate job IDs to delete:', err);
            
            return;
          }
  
          const idsToDelete = rowsToDelete.map((row) => row.external_id);
  
          if (idsToDelete.length > 0) {
            db.query('DELETE FROM jobs WHERE external_id IN (?)', [idsToDelete], (deleteError) => {
              if (deleteError) {
                console.error('Error deleting duplicate job IDs:', deleteError);
              } else {
                console.log(`Successfully deleted ${idsToDelete.length} duplicate job IDs with value ${jobId}`);
              }
  
              
            });
          } else {
            console.log(`No duplicates found for job ID ${jobId}`);
            
          }
        });
      });
    });
  }
  
  // Uncomment the line below to execute the function
   //removeDuplicateJobIds();