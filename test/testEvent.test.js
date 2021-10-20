var Ticket = artifacts.require("Ticket");
var Evento = artifacts.require("Event");


contract('Event Ticketing', function (accounts) {
    let eventInstance;
    let ticketInstance;
    
    before(async function () {
        eventInstanceAddress = await Evento.deployed();
        ticketInstanceAddress = await Ticket.deployed();
        eventInstance= await Evento.at(eventInstanceAddress.address);
        ticketInstance= await Ticket.at(ticketInstanceAddress.address);
        console.log(ticketInstance)

    });


    it('set reseller', async function () {
        const reseller=await eventInstance.set_reseller.call(accounts[2]);
        console.log(reseller)
        await eventInstance.set_reseller(accounts[2]);
        assert(reseller[1], accounts[2]);
    });

    it('can create a new event', async function () {
        // using .call() does not persist data, but allows us to get the return value
        // in order to validate that it works properly
        const newEventID = await eventInstance.create_event.call('Concerto', 'Ancona', '22/02/2021', 5, 2000, accounts[2]);
        assert.equal(newEventID, 0);

        // Call createEvent normally, where we can't get return value, but the state
        // is saved to the blockchain
        await eventInstance.create_event('Concerto', 'Ancona', '22/02/2021', 5, 80, accounts[2]);
        const newEvent = await eventInstance.get_events.call();
        console.log(newEvent);

        assert.equal(newEvent[0].title, 'Concerto');
        assert.equal(newEvent[0].luogo, 'Ancona');
        assert.equal(newEvent[0].seats, 5); 
    });

    it('ticket are generated', async function () {

        await eventInstance.create_event('Prova', 'Ancona', '21/09/2021', 5, 80, accounts[2]);
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

    it('ticket is bought', async function() {

        const prova= await ticketInstance.buy_ticket.call(0, 'Massimo', 'Ciaffoni');
        console.log(prova);
        
        await   ticketInstance.buy_ticket(0, 'Massimo', 'Ciaffoni');
        await   ticketInstance.buy_ticket(0, 'Mario', 'Rossi');
        
        /*web3.eth.sendTransaction({to: web3.utils.toChecksumAddress(eventInstance.get_address()), from: web3.utils.toChecksumAddress(ticketInstance.get_address()), value: eventInstance.get_event_price(0)})
        const newEvent = await eventInstance.get_events.call();
        console.log(newEvent);*/
        const ticketsold= await eventInstance.get_tickets.call()
        console.log(ticketsold);
        assert.equal(ticketsold[0].name, "Massimo");
        assert.equal(ticketsold[0].surname, "Ciaffoni");
        assert.equal(ticketsold[0].sell, true);
    });

    it('ticket is validated', async function(){
        const validator_account=accounts[1];
        console.log(validator_account);
        const validatore =await eventInstance.set_validator.call(validator_account);
        console.log(validatore);
        await eventInstance.set_validator(validator_account);
        const prova= await ticketInstance.validate_ticket.call(0);
        console.log(prova);
        await ticketInstance.validate_ticket(0);
        await ticketInstance.validate_ticket(1);
        const ticketvalid= await eventInstance.get_tickets.call()
        console.log(ticketvalid);
        assert.equal(ticketvalid[0].validate, true)
    });


    it('event is set finished', async function() {

        await eventInstance.finish_event(0)
        const newEvent = await eventInstance.get_events.call()
        assert.equal(newEvent[0].state, 'Concluso')
    });



    it('event is set overlue', async function() {

        await eventInstance.overrlue_event(0)
        const newEvent = await eventInstance.get_events.call()
        assert.equal(newEvent[0].state, 'Annullato')
    });


    

    /*it('has an owner', async function(){
        const owner= await eventInstance.owner;

    }*/
});