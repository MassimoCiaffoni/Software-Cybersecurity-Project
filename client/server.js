const express = require('express'); 
const app = express(); 
const port = process.env.PORT || 5000; 
const logger=require('./src/utils/logger.js');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

app.post('/log', (req, res) => {   
  var json =JSON.parse(JSON.stringify(req.body))
  console.log(json);  

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


app.get('/test', (req,res) => {
  res.send("Hello world")
})