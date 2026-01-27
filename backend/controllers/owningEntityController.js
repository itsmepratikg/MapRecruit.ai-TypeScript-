const OwningEntity = require('../models/OwningEntity');
const mongoose = require('mongoose');

// @desc    Get Owning Entity by Client ID
// @route   GET /api/owning-entities/by-client/:clientId
// @access  Private
const getByClientId = async (req, res) => {
    try {
        const { clientId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            return res.status(400).json({ message: 'Invalid Client ID' });
        }

        // Find the OwningEntity that contains this clientId in its clientIDs array
        const entity = await OwningEntity.findOne({
            clientIDs: new mongoose.Types.ObjectId(clientId)
        });

        if (entity) {
            res.json(entity);
        } else {
            // It is valid to not have an owning entity, return null/204 or just null object
            // Returning null object to differentiate from error
            res.json(null);
        }
    } catch (error) {
        console.error('Error fetching Owning Entity:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getByClientId
};
