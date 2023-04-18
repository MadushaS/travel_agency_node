const axios = require('axios');
const config = require('../config');

const { FlightAwareAPI, FlightAwareAPIKey } = config;

exports.getflightRouteMap = async (req, res) => {
    const { flight_id } = req.query;
    const url = `${FlightAwareAPI}/flights/${flight_id}/map?show_data_block=true&airports_expand_view=true&show_airports=true`;
    axios.get(url, {
        headers: {
            'x-apikey': FlightAwareAPIKey,
        }
    })
        .then(function (response) {
            const image = response.data;
            res.json(image);
        }
        )
        .catch(function (error) {
            res.status(500).json({ message: 'An error occurred while fetching route image.' });
        }
        );
}