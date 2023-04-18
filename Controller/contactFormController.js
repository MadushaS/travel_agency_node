exports.contactFormSubmit = async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const contactForm = {
            name,
            email,
            message,
        };
        res.json(contactForm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};