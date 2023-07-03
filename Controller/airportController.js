const { log } = require('handlebars/runtime');
const Airport = require('../models/Airport');

exports.getAirportsByCountry = async (req, res) => {
    const { country:_country } = req.params;
    try {
        const airports = await Airport.find({ country: _country }, { _id: 0, name: 1, city: 1, icao: 1, })
            .sort({ number: 1 })
            .then((airports) => res.json(airports))
            .catch((error) =>{ 
                console.log(error);
                res.status(500).json({ message: 'An error occurred while fetching airports.' })});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};