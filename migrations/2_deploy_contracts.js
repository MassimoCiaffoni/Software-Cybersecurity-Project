var Ticket = artifacts.require("Ticket");
var Event = artifacts.require("Event");

module.exports = function(deployer) {
  deployer.deploy(Event, 0).then(() => {
    return deployer.deploy(Ticket, Event.address)
      .then(async () => {
        const eventInstance = await Event.deployed();
        const ticketInstance = await Ticket.deployed();

        console.log('Event contract address is ', eventInstance.address);
      });
  });
};