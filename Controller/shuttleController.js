exports.confirmReservation = async (req, res) => {
    const { brand, firstName, LastName, pickupLocation, dropoffLocation, pickupDate, pickupTime, mode, passengers } = req.body;

    // TODO: Send email to user with confirmation details

    res.status(200).json({message: "Reservation confirmed"});
};