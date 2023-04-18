const axios = require('axios');
const config = require('../config');

const { FlightAwareAPI, FlightAwareAPIKey } = config;

exports.searchSchedule = async (req, res) => {
    const { origin, destination, departureDate } = req.body;
    let nextDate = new Date(departureDate);
    nextDate.setDate(nextDate.getDate() + 1);
    nextDate = nextDate.toISOString().split('T')[0];

    const url = `${FlightAwareAPI}/schedules/${departureDate}/${nextDate}?origin=${origin}&destination=${destination}&max_pages=1`;
    try {
        const response = await axios.get(url, {
            headers: {
                'x-apikey': FlightAwareAPIKey,
            }
        });
        const schedules = response.data.scheduled?.map((result) => {
            const { ident, origin, destination, fa_flight_id, scheduled_in, scheduled_out, meal_service, seats_cabin_business, seats_cabin_coach, seats_cabin_first } = result;
            return {
                flightNumber: ident, origin, destination,
                flightId: fa_flight_id, scheduledIn: scheduled_in,
                scheduledOut: scheduled_out, mealService: meal_service,
                seatsCabinBusiness: seats_cabin_business, seatsCabinCoach: seats_cabin_coach,
                seatsCabinFirst: seats_cabin_first
            };
        }) || [];
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching schedules.' });
    }
}