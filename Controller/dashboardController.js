const handlebars = require('handlebars');
const fs = require('fs');
const mongoose = require('mongoose');
const config = require('../config');
const Shop = require('../models/shop');
const Item = require('../models/item');
const User = require('../models/user');
const { type } = require('os');

const dashboard = fs.readFileSync('./public/dashboard/dashboard.hbs', 'utf8');
const profile = fs.readFileSync('./public/dashboard/profile.hbs', 'utf8');

const dashboard_template = handlebars.compile(dashboard);
const profile_template = handlebars.compile(profile);


exports.getDashboard = async (req, res) => {
    const { user } = req.oidc;
    const login = req.oidc.isAuthenticated() ? true : false;

    const existingUser = await User.findOne({ auth0Id: user.sub.toString() });

    console.log(user);

    if (!existingUser) {
        
        await User.create({
            _id: new mongoose.Types.ObjectId(),
            auth0Id: user.sub.toString(),
            name: user.name,
            email: user.email,
            cart: [],
            settings: {},
            // any other additional data you want to store
        }).save();
    }

    const userItems = await Item.find({ user_id: user.sub }).lean();

    res.send(dashboard_template(
        {
            products: userItems,
            user
        }
    ));

}

exports.addNewItem = async (req, res) => {
    const { user } = req.oidc;
    const login = req.oidc.isAuthenticated() ? true : false;

    if (!login) {
        res.status(401).send('Unauthorized');
    }

    if (!req.body || !req.body.name || !req.body.price || !req.body.description || !req.body.user) {
        res.status(400).send('Bad request');
    }

    const newItem = prepareItem(req, user);

    const createdItem = await newItem.save() || null;

    res.status(201).json({ product: createdItem })
}

exports.removeProduct = async (req, res) => {
    const { id, userId } = req.params;
    const { user } = req.oidc;
    const login = req.oidc.isAuthenticated() ? true : false;

    if (!login) {
        res.status(401).send('Unauthorized');
    }

    if (!id || !userId) {
        res.status(400).send('Bad request');
    }

    if (userId !== user.sub) {
        res.status(401).send('Unauthorized');
    }

    if (id) {
        const item = await Item.findById(id);

        if (item) {
            await item.deleteOne();
            res.status(200).send('Item removed');
        } else {
            res.status(404).send('Item not found');
        }
    }


}

exports.getProfile = async (req, res) => {
    const login = req.oidc.isAuthenticated() ? true : false;
    if (!login) {
        res.status(401).send('Unauthorized');
    }
    
    const { user } = req.oidc;

    const userFromDB = await User.findOne({ auth0Id: user.sub.toString() });

    if (!userFromDB) {
        res.status(404).send('User not found');
    }

console.log(req.oidc.user);
    res.send(profile_template({
        login,
        name: userFromDB.name || req.oidc.user.name,
        email: userFromDB.email,
        image: req.oidc.user.picture,
    }));

}

function prepareItem(req, user) {
    const newItem = new Item({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        discount: req.body.discount || 0,
        image: req.file.path ? `${req.file.path.replace(/^public/, '')}` : `https://placehold.co/600x400?text=${req.body.name}`,
        quantity: req.body.quantity || 1,
        location: req.body.location,
        categories: req.body.categories,
        user_id: user.sub,
        rating: 0,
        reviews: []
    });

    if (req.body.categories.includes('accommodation')) {
        let amenities = req.body.hotel_amenities.split(',') || null;
        let amenities_trimmed = amenities ? amenities.map(item => item.trim()) : null;

        newItem.amenities = amenities_trimmed || null;
    }

    if (req.body.categories.includes('tours')) {
        let includes = req.body.tour_includes.split(',') || null;
        let includes_trimmed = includes ? includes.map(item => item.trim()) : null;

        newItem.duration = req.body.tour_duration || null;
        newItem.includes = includes_trimmed || null;
    }

    if (req.body.categories.includes('transportation')) {
        newItem.carType = req.body.vehicle_type || null;
        newItem.model = req.body.vehicle_model || null;
        newItem.year = req.body.vehicle_year || null;
        newItem.color = req.body.vehicle_color || null;
        newItem.capacity = req.body.luggage_capacity
        newItem.seats = req.body.seats || null;
        newItem.transmission = req.body.transmission || null;
        newItem.fuelType = req.body.fuel_type || null;
    }

    if (req.body.categories.includes('experiences')) {
        let highlights = req.body.highlights.split(',') || null;
        let itinerary = req.body.itinerary.split(',') || null;
        let bring = req.body.bring.split(',') || null;
        let wear = req.body.wear.split(',') || null;
        let info = req.body.info.split(',') || null;

        let highlights_trimmed = highlights ? highlights.map(item => item.trim()) : null;
        let itinerary_trimmed = itinerary ? itinerary.map(item => item.trim()) : null;
        let bring_trimmed = bring ? bring.map(item => item.trim()) : null;
        let wear_trimmed = wear ? wear.map(item => item.trim()) : null;
        let info_trimmed = info ? info.map(item => item.trim()) : null;

        newItem.duration = req.body.duration || null;
        newItem.includes = req.body.includes || null;
        newItem.highlights = highlights_trimmed || null;
        newItem.itinerary = itinerary_trimmed || null;
        newItem.bring = bring_trimmed || null;
        newItem.wear = wear_trimmed || null;
        newItem.info = info_trimmed || null;
    }

    if (req.body.categories.includes('wildlife')) {
        let includes = req.body.includes.split(',') || null;
        let info = req.body.info.split(',') || null;

        let includes_trimmed = includes ? includes.map(item => item.trim()) : null;
        let info_trimmed = info ? info.map(item => item.trim()) : null;

        newItem.duration = req.body.duration || null;
        newItem.includes = includes_trimmed || null;
        newItem.transportation = req.body.transportation || null;
        newItem.info = info_trimmed || null;
    }

    if (req.body.categories.includes('beaches')) {
        let includes = req.body.includes.split(',') || null;
        let includes_trimmed = includes ? includes.map(item => item.trim()) : null;

        newItem.duration = req.body.duration || null;
        newItem.includes = includes_trimmed || null;
    }

    if (req.body.categories.includes('historical')) {
        let includes = req.body.includes.split(',') || null;
        let heritage_sites = req.body.heritage_sites.split(',') || null;
        let archaeo_sites = req.body.archaeo_sites.split(',') || null;
        let religious_sites = req.body.religious_sites.split(',') || null;
        let museums = req.body.museums.split(',') || null;

        let includes_trimmed = includes ? includes.map(item => item.trim()) : null;
        let heritage_sites_trimmed = heritage_sites ? heritage_sites.map(item => item.trim()) : null;
        let archaeo_sites_trimmed = archaeo_sites ? archaeo_sites.map(item => item.trim()) : null;
        let religious_sites_trimmed = religious_sites ? religious_sites.map(item => item.trim()) : null;
        let museums_trimmed = museums ? museums.map(item => item.trim()) : null;

        newItem.duration = req.body.duration || null;
        newItem.includes = includes_trimmed || null;
        newItem.heritage_sites = heritage_sites_trimmed || null;
        newItem.archaeo_sites = archaeo_sites_trimmed || null;
        newItem.religious_sites = religious_sites_trimmed || null;
        newItem.museums = museums_trimmed || null;
    }

    if (req.body.categories.includes('food')) {
        let includes = req.body.includes.split(',') || null;
        let includes_trimmed = includes ? includes.map(item => item.trim()) : null;

        let restrictions = [];

        if (req.body.restrictions) {
            if (req.body.restrictions.includes('vegitarian')) {
                restrictions = [...restrictions, 'vegitarian']
            }

            if (req.body.restrictions.includes('vegan')) {
                restrictions = [...restrictions, 'vegan']
            }

            if (req.body.restrictions.includes('halal')) {
                restrictions = [...restrictions, 'halal']
            }

            if (req.body.restrictions.includes('kosher')) {
                restrictions = [...restrictions, 'kosher']
            }
        }


        newItem.includes = includes_trimmed || null;
        newItem.cuisine = req.body.cousine || null;
        newItem.restrictions = restrictions || null;
        newItem.meal_type = req.body.meal_type || null;
        newItem.meal_time = req.body.meal_time || null;
        newItem.meal_style = req.body.meal_style || null;
    }

    if (req.body.categories.includes('shopping')) {
        newItem.material = req.body.material || null;
        newItem.size = req.body.size || null;
        newItem.color = req.body.color || null;
        newItem.weight = req.body.weight || null;
        newItem.manufacturer = req.body.manufacturer || null;
        newItem.country = req.body.country || null;
    }

    if (req.body.categories.includes('wellness')) {
        newItem.therapist = req.body.therapist || null;
        newItem.duration = req.body.duration || null;
        newItem.amenities = req.body.amenities || null;
    }
    return newItem;
}