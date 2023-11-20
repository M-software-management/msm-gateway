import axios from "axios";

export class WordPress {
  constructor(wpConfig) {
    // Store the URL from the wpConfig object
    this.url = wpConfig.url;
    
    // Create the headers object with the authorization and content-type headers
    this.headers = {
      Authorization: "Basic " + Buffer.from(`${wpConfig.username}:${wpConfig.password}`).toString('base64'),
      "Content-Type": "application/json",
    };
  }

}