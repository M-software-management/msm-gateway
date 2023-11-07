import axios from 'axios'
import cheerio from 'cheerio'
import fs, { link } from 'fs'
import path from 'path';
import { dirname } from 'path';
const __dirname = path.resolve();
const filePath = path.join(__dirname, './controllers/test.html');

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