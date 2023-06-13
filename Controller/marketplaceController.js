const handlebars = require('handlebars');
const fs = require('fs');
const config = require('../config');
const Shop = require('../models/shop');
const Item = require('../models/item');

const marketplace = fs.readFileSync('./public/dashboard/marketplace.hbs', 'utf8');
const search = fs.readFileSync('./public/dashboard/search.hbs', 'utf8');

handlebars.registerHelper('includes', function (a = [], b) {
    return a.includes(b);
});

handlebars.registerHelper('eq', function (a = '', b) {
    return a === b;
});

handlebars.registerHelper('neq', function (a = '', b) {
    return a !== b;
});

handlebars.registerHelper('gt', function (a, b) {
    return a > b;
});

const marketplace_template = handlebars.compile(marketplace);
const search_template = handlebars.compile(search);

exports.getMarketplace = async (req, res) => {
    const login = req.oidc.isAuthenticated() ? true : false;
        
    const shops = await Shop.find({ featured: true }).limit(3).lean();
    const discountedItems = await Item.find({ discount: { $gt: 0 } }).limit(3).lean();

    res.send(marketplace_template(
        {
            featuredShops: shops,
            discoutedProducts: discountedItems,
            login,
            user:req.oidc.user
        }
    ));
}

exports.searchItem = async (req, res) => {
    const { q: query, category, price, rating, sort, location } = req.query;
    const login = req.oidc.isAuthenticated() ? true : false;

    const queryFilters = {
        name: { $regex: query || '', $options: 'i' },
    }

    if (price) {
        const priceArray = price.split('-');
        queryFilters.price = { $gte: priceArray[0] || 0, $lte: priceArray[1] || 1000000 };
    }

    if (rating) {
        queryFilters.rating = { $gte: ratingArray[0] || 0, $lte: ratingArray[1] || 5 };
    }

    if (category) {
        if (Array.isArray(category)) {
            queryFilters.categories = { $in: category };
        } else {
            queryFilters.categories = category;
        }
    }

    if (location) {
        if (Array.isArray(location)) {
            queryFilters.location = { $in: location };
        } else {
            queryFilters.location = location;
        }
    }

    const items = await Item.find(queryFilters).sort(
        sort === 'price' ? { price: 1 } : sort === 'rating' ? { rating: -1 } : { name: 1 }
    ).lean();

    const state = {
        _query: query || '',
        _category: category || '',
        _price: price || '',
        _rating: rating || '',
        _sort: sort || '',
        _location: location || '',
    }

    const products = items.map(item => {
        return {
            ...item,
            nowPrice: item.price - (item.price * (item.discount || 0) / 100),
        }
    });

    res.send(search_template(
        {
            login,
            ...state,
            products,

        }
    ));
}