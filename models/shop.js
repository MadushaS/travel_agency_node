const { Double } = require('mongodb');
const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    categories: {
        type: Array,
        items: {
            type: String
        }
    },
    products: {
        type: Array,
        items: {
            type: Object,
            properties: {
                name: {
                    type: String
                },
                price: {
                    type: Number
                },
                description: {
                    type: String,
                    required: true
                },
                image: {
                    type: String,
                    format: URL,
                    required: true
                },
                quantity: {
                    type: String
                },
                brand: {
                    type: String
                },
                sizes: {
                    type: Array,
                    items: {
                        type: String
                    }
                },
                colors: {
                    type: Array,
                    items: {
                        type: String
                    }
                },
                rating: {
                    type: Double
                },
                reviews: {
                    type: Array,
                    items: {
                        type: Object,
                        properties: {
                            username: {
                                type: String,
                                required: true
                            },
                            rating: {
                                type: String,
                                required: true
                            },
                            review: {
                                type: String,
                                required: true
                            }
                        },
                    }
                }
            },
        }
    },
    slug: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
    }
},
);

const Shop = mongoose.model('Shop', shopSchema, 'mp_sellers');

module.exports = Shop;