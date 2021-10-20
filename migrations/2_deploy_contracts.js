var Ticket = artifacts.require("Ticket");
var Event = artifacts.require("Event");


module.exports = function(deployer, network, accounts) {
  deployer.deploy(Event, {from: accounts[0]}).then((event) => {
    return deployer.deploy(Ticket , event.address,{from: accounts[1]})
        .then(async () => {
          const eventInstance = await Event.deployed();
          const ticketInstance = await Ticket.deployed();
  

        console.log('Event contract owner is ', accounts[0]);
        console.log('Ticket contract owner is ', accounts[1]);
        });
    });
}