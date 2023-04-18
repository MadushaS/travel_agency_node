const config = require('../config');

const { openAIKey } = config;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: openAIKey,
});

const openai = new OpenAIApi(configuration);

exports.chat = async (req, res) => {
    const { message } = req.body;
    openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
            role: "user",
            content: message
        }],
        max_tokens: 500,
        temperature: 0,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    })
    .then((response) => {
        res.status(200).json({message: response.data.choices[0].message.content});
    }).catch((error) => {
        res.status(500).json({message: error.response.data});
    });

};
