require('dotenv').config()

const config = {
    MONGO_URI: process.env.MONGO_URI,
    FlightAwareAPI: process.env.FLIGHTAWARE_API_BASE_URL,
    FlightAwareAPIKey: process.env.FLIGHTAWARE_API_KEY,
    
    travelAdvisorURL: process.env.TRAVELADVISOR_API_BASE_URL,
    travelAdvisorHost: process.env.TRAVELADVISOR_API_HOST,
    travelAdvisorKey: process.env.TRAVELADVISOR_API_KEY,

    weatherAPIURL: process.env.WEATHER_API_BASE_URL,
    weatherAPIKey: process.env.WEATHER_API_KEY,

    openAIKey: process.env.OPENAI_API_KEY,
}

module.exports = config;