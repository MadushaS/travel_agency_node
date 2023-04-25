const axios = require('axios');
const handlebars = require('handlebars');
const fs = require('fs');
const config = require('../config');
const Package = require('../models/Package');

const package = fs.readFileSync('./public/tour-package.hbs', 'utf8');
const package_template = handlebars.compile(package);


exports.getPackage = async (req, res) => {
    const { name } = req.params;
    try {
        const package = await Package.findOne({ Name: name }, { _id: 0, __v: 0 })
            .then((package) => {
                if (package) {
                    const package_html = package_template(
                        {
                            name: package.Name,
                            category: package.Category,
                            image: package.Image,
                            image_alt: package.ImageAlt,
                            highlights: package.Highlights,
                            description: package.Description,
                            itinerary: package.Itinerary,
                            includes: package.Includes,
                            excludes: package.Excludes,
                            price: package.Price,
                            duration: package.Duration,
                            gallery: package.Gallery,
                            reviews: package.Reviews,
                        }
                    );
                    res.send(package_html);
                }
                else {
                    throw new Error('Package not found.');
                }
            })
            .catch((error) => {throw new Error('An error occurred while fetching package.')});
    }
    catch (error) {
        res.status(500).sendFile('tour-package_404.html', { root: './public' });
    }

};