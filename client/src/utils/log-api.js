
module.exports = {
    log : async(type, message) => {
        const data = { 
          type: type,
          message: message 
        };
        
        await fetch('/log' , {
          method: "POST",
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((result) =>{
          console.log(result)
        })
      } 
};

