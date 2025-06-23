require('dotenv').config();
const ServiceProviderUser = require('../../models/serviceProviderUserModel/serviceProviderUserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Without changing any response format optimize this wrt to queries and load handling 
const handleServiceProviderUserRegister = async (req, res) => {
    const { fullName, email, password,phone,country,gender,businessName,address } = req.body;
 
    try {  
        const existingUser = await ServiceProviderUser.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exist", success: false })
        }
   
        const hashPassword = bcrypt.hashSync(password, 10);
        const user = await ServiceProviderUser.create({
            fullName,
            email,
            password: hashPassword,
            phone,
            country,
            gender,
            businessName,
            address
        })
        res.status(200).json({ok:true,
            success:true,
            message:"User Create SuccessFully",
            user:`User Name is : ${user.fullName} & User Email is : ${user.email}`
        })
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};
const handleLoginServiceProviderUser = async (req, res) => {
    const { email, password } = req.body;
   

    try {

        const user = await ServiceProviderUser.findOne({ email });
        if (!user) {
            return res.status(500).json({ error: "User not found" });
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }


        const tokenExpiration = process.env.EXPIRE_DAY || "1d";


        const accessToken = jwt.sign(
            {
                user: {
                    id: user.id,
                    name: user.fullName,
                    email: user.email,
                },
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: tokenExpiration,
            }
        );

        const option = {
            httpOnly: true,
            secure: true,
        };


        res.status(201)
            .cookie("accessToken", accessToken, option)
            .json({
                accessToken,
                userId: user.id,
                message: "Login successfully",
                success: true,
            });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { handleServiceProviderUserRegister, handleLoginServiceProviderUser };
