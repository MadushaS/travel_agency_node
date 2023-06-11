const axios = require('axios');
const handlebars = require('handlebars');
const fs = require('fs');
const config = require('../config');

const hotel_not_found = fs.readFileSync('./public/hotel_404_notfound.hbs', 'utf8');
const hotel_not_found_template = handlebars.compile(hotel_not_found);

const hotel_details = fs.readFileSync('./public/hotel_booking.hbs', 'utf8');
const hotel_details_template = handlebars.compile(hotel_details);

const { travelAdvisorURL, travelAdvisorHost, travelAdvisorKey } = config;


exports.getHotels = async (req, res) => {
const { location, rating, showRestaurants } = req.params;

    const response = await getHotelsByName({ location, rating, showRestaurants });
    const data = response;
    try {
        if (data) {
            res.send(data);

        } else {
            throw new Error('No hotels found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred while fetching the hotel list.' });
    };
};

exports.getHotelDetails = async (req, res) => {
    const { name } = req.query;

    const response = await getHotelsByName({ location: name, rating: null, showRestaurants: null });
    const data = response[0];

    if (data) {
        const hotel = {
            hotel_name: data.result_object.name,
            hotel_location: data.result_object.address,
            website: data.result_object.web_url,
            hotel_ratings: data.result_object.rating,
            hotel_desc: data.review_snippet.snippet,
            latitude: data.result_object.latitude,
            longitude: data.result_object.longitude,
            hotel_image: data.result_object.photo.images.large.url
        }
        res.send(hotel_details_template(hotel));
    }
    else {
        res.status(404).send(hotel_not_found_template());
    }

};

async function getHotelsByName(filters) {
    const { location, rating, showRestaurants } = filters;
    console.log(filters);

    try {
        const { data } = await axios.get(`${travelAdvisorURL}locations/search?lang=en_US&limit=100&query=${location}`, {
            headers: {
                'x-rapidapi-host': travelAdvisorHost,
                'x-rapidapi-key': travelAdvisorKey
            }
        });

        const result = data.data;

        const locations = [];
        let hotelList = result.filter(item => item.result_object.timezone === 'Asia/Colombo');
        console.log(hotelList);

        hotelList = hotelList.filter(item => item.result_type === 'lodging' || (showRestaurants === '1') ? item.result_type === 'lodging' : false);

        if (location) {
            hotelList = hotelList.filter(item => item.result_object.name.toLowerCase().includes(location.toLowerCase()) || (item.result_object.address_obj.location_string && item.result_object.address_obj.location_string.toLowerCase().includes(location.toLowerCase())));
        }

        if (rating) {
            hotelList = hotelList.filter(item => item.result_object.rating >= rating);
        }

        hotelList.forEach(item => {
            locations.push([`${item.result_object.name}<br><a href="detail.html?id=${item.result_object.location_id}">Book Hotel</a>`, item.result_object.latitude, item.result_object.longitude]);
        });

        return hotelList;

    } catch (error) {
        console.error(error);
        return [];
    };
}

exports.bookHotel = async (req, res) => {
    const { checkinDate, checkoutDate, guests, email, hotelName } = req.body;
    //TODO hanldle the booking here

    res.send({ message: 'Booking successful' });
};