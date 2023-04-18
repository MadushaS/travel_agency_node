const Airport = require('../models/Airport');

exports.getAirportsByCountry = async (req, res) => {
    const { country } = req.params;
    try {
        const airports = await Airport.find({ country: country }, { _id: 0, name: 1, municipality: 1, icao: 1, })
            .sort({ number: 1 })
            .then((airports) => res.json(airports))
            .catch((error) => res.status(500).json({ message: 'An error occurred while fetching airports.' }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};