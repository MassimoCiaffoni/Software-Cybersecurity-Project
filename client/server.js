const express = require('express'); 
const app = express(); 
const port = process.env.PORT || 5000; 
const logger=require('./src/utils/logger.js');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); 

//End point "/log" of this API to create log from frontend to backend
app.post('/log', (req, res) => {   
  //get json arguments from the body of the request
  var json =JSON.parse(JSON.stringify(req.body))
  console.log(json); 

  console.log(req);
  //for each type of message do different log
  switch(json["type"]){
    case "info":
      logger.info(json["message"])
      break;
    case "warn":
      logger.warn(json["message"])
      break;
    case "error":
      logger.error(json["message"])
      break;
    case "verbose":
      logger.verbose(json["message"])
      break;
    case "debug":
      logger.debug(json["message"]) 
      break;
    case "console":
      console.log(json["message"])
      break;      
  
  }  
}); 

//End point "/test" of this API to test the connection of the server
app.get('/test', (req,res) => {
  res.send("Backend is online")
})