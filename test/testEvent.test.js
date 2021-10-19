var Event = artifacts.require('./Event.sol');
var Ticket = artifacts.require('./Ticket.sol');

contract('Event', function (accounts) {
    let eventInstance;
    let ticketInstance;

    before(async function () {
        eventInstance = await Event.deployed();
        ticketInstance = await Ticket.deployed();
    });

    it('can create a new event', async function () {
        // using .call() does not persist data, but allows us to get the return value
        // in order to validate that it works properly
        const newEventID = await eventInstance.create_event.call('Concerto', 'Ancona', '22/02/2021', 5, 2000, "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
        assert.equal(newEventID, 0);

        // Call createEvent normally, where we can't get return value, but the state
        // is saved to the blockchain
        await eventInstance.create_event('Concerto', 'Ancona', '22/02/2021', 5, 2000, "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
        const newEvent = await eventInstance.get_events.call();
        console.log(newEvent);

        assert.equal(newEvent[0].title, 'Concerto');
        assert.equal(newEvent[0].luogo, 'Ancona');
        assert.equal(newEvent[0].seats, 5); 
    });

    it('ticket are generated', async function () {

        await eventInstance.create_event('Prova', 'Ancona', '21/09/2021', 5, 2000, "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4");
        const newTickets = await eventInstance.get_tickets.call();
        const newEvent = await eventInstance.get_events.call();
        console.log(newEvent)
        console.log(newTickets)
        assert.equal(newTickets.length, 10);
    });

    it('ticket contract should have the correct address for Event contract instance', async function () {
        const eventAddress = await ticketInstance.eventAddress.call();
        assert.equal(eventAddress, eventInstance.address);
    });



    /*it('has an owner', async function(){
        const owner= await eventInstance.owner;

    }*/
});