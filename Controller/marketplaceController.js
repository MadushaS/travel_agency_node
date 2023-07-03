const handlebars = require('handlebars');
const fs = require('fs');
const config = require('../config');
const Shop = require('../models/shop');
const Item = require('../models/item');
const User = require('../models/user');

const marketplace = fs.readFileSync('./public/dashboard/marketplace.hbs', 'utf8');
const search = fs.readFileSync('./public/dashboard/search.hbs', 'utf8');
const product = fs.readFileSync('./public/dashboard/product.hbs', 'utf8');

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
const product_template = handlebars.compile(product);

exports.getMarketplace = async (req, res) => {
    const login = req.oidc.isAuthenticated() ? true : false;

    const featuredItems = await Item.find().sort({rating:-1}).limit(5).lean();
    const discountedItems = await Item.find({ discount: { $gt: 0 } }).limit(3).lean();

    res.send(marketplace_template(
        {
            featuredItems,
            discoutedProducts: discountedItems,
            login,
            user: req.oidc.user
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

exports.productInfo = async (req, res) => {
    const {id} = req.params;
    const login = req.oidc.isAuthenticated() ? true : false;

    if (!id) {
        res.redirect('/marketplace');
        return;
    }

    try {
        const productSelected = await Item.findById(id).lean();
        if (!productSelected) {
            res.redirect('/marketplace');
            return;
        }

        res.send(product_template(
            {
                login,
                ...productSelected,
                _discounted: productSelected.price - (productSelected.price * (productSelected.discount || 0) / 100),
            }
        ));
    } catch (error) {
        console.error(id);
    }

}

exports.addToCart = async (item) => {

    if (!req.oidc.isAuthenticated()) {
        console.log('User not authenticated');
        throw new Error('User not authenticated');
    }

    const userId = req.oidc.user.sub;

    try {
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
            return;
        }

        // Add the item to the user's cart
        user.cart.push(item);

        // Save the updated user object
        await user.save();

        console.log('Item added to cart:', item);
    } catch (error) {
        console.error('Error adding item to cart:', error);
    }
}

exports.getCartCount = async (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        console.log('User not authenticated');
        return;
    }

    const userId = req.oidc.user.sub;

    try {
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
            return;
        }

        res.json({ count: user.cart.length });
    } catch (error) {
        console.error('Error getting cart count:', error);
    }
}