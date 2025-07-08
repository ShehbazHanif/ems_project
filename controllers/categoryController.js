

const catagery = require('../models/categoryModel');

const getCat = async (req, res) => {


    try {

        const cat = await catagery.find();
        return res.status(200).json({
            success: true,
            message: "Cat Details",
            cat
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

module.exports = getCat;