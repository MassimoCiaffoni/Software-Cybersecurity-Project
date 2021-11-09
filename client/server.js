const express = require('express'); 
const app = express(); 
const port = process.env.PORT || 5000; 
const logger=require('./src/utils/logger.js');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6




// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
  logger.info("Connesso" )
}); //Line 11

app.get('/crea_evento', (req, res) =>{
  res.send('Prova connesso');
});

app.post('/crea_evento' , function(req, res){
  console.log(req.body)
  data=req.body;
  logger.info(`Evento creato || ${JSON.stringify(data)} `);
});