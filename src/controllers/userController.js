const user = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const subscriptionModal = require("../models/subscriptionSchema");


const getalldata = async (req, res) => {
    try {
        const data = await user.find();
        res.status(200).send({ message: "success", data: data });
    }
    catch (err) {
        res.status(400).send({ message: err.message });

    }
}

const signupUser = async (req, res) => {
    try {
        const { password,phone } = req.body

        const dublicatePhone=await user.find({ phone })
        
        if(dublicatePhone.length>0){
            res.status(404).send({ message: "Mobile Number is already Exist" });
            return;
        }
        const salt = bcrypt.genSaltSync(10)
        const securepassword = bcrypt.hashSync(password, salt);
        await user.create({ ...req.body, password: securepassword });
        res.status(200).send({ message: "success", data: { ...req.body, password: securepassword } });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
const signupMerchant = async (req, res) => {
    try {
        const { password, userRoleId } = req.body
        if (!userRoleId) {
            res.status(500).send({ status: "Failed", message: "UnAutherized to Add User" });
            return;
        }
        const salt = bcrypt.genSaltSync(10)
        const securepassword = bcrypt.hashSync(password, salt);
        await user.create({ ...req.body, password: securepassword, userRoleId: 771011149910497110116 });
        res.status(200).send({ message: "success", data: { ...req.body, password: securepassword } });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}
const signupAdmin = async (req, res) => {
    try {
        const { password, userRoleId } = req.body
        if (!userRoleId) {
            res.status(500).send({ status: "Failed", message: "UnAutherized to Add User" });
            return;
        }
        const salt = bcrypt.genSaltSync(10)
        const securepassword = bcrypt.hashSync(password, salt);
        await user.create({ ...req.body, password: securepassword, userRoleId: 65100109105110 });
        res.status(200).send({ message: "success", data: { ...req.body, password: securepassword } });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const loginuser = async (req, res) => {
    const { email, password } = req.body
    try {
        const userValid = await user.findOne({ email })
        if (userValid) {
            //match password
            const isValidPassword = bcrypt.compareSync(password, userValid.password);
            if (isValidPassword) {
                //generate jwt
                const token = jwt.sign({
                    userId: userValid._id,
                    email: userValid.email
                }, process.env.SECRET_KEY, {
                    expiresIn: 60 * 60 * 24 // in sec => 60sec*60sec*24sec means 24 days
                })
                res.status(200).send({ message: "Logged in successfully", token: token, data: userValid });
            }
            else {
                res.status(404), send({ Status: "Fail", message: "Password is Wrong" })
            }
        }
        else {
            res.status(404), send({ Status: "Fail", message: "Not a valid user" })

        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

}

const getprofile = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization.split(" ")[1];
    try {
        const userdata = jwt.verify(token, process.env.SECRET_KEY)
        const { userId } = userdata;

        user.findById(userId)
            .select("-password")
            .then((data) => {
                res.status(200).send({ Status: "success", data });

            })
    }
    catch (err) {
        res.status(500).send({ Status: "fail", message: err.message });
    }
}

const Subscription = async () => {
    try {
        const { userId } = req.params; 
        const {paymentMethod}=req.body;

        const user = await userModal.findById(userId);

        if (!user) {
            res.status(500).send({ Status: "fail", message: "User not found" });
            return;
        }

        if (user.subscription_id) {
            const subscription = await subscriptionModal.findById(user.subscription_id);

            if (!subscription) {
                throw new Error("Subscription not found");
            }

            subscription.payment_method = paymentMethod;
            subscription.start_date = Date.now();
            
            await subscription.save();

            res.status(200).send({ Status: "success", message: "Suscription Update Successfully", data: subscription });
        } else {
            const subscription = await subscriptionModal.create({
                user_id: userId,
                payment_method: paymentMethod,
            });

            await userModal.findByIdAndUpdate(userId, {
                subscription_id: subscription._id,
            });

            res.status(200).send({ Status: "success", message: "Suscribe Successfully", data: subscription });

        }
    } catch (error) {
        console.error("Error creating or updating subscription:", error);
    }
};

module.exports = { signupAdmin, signupMerchant, getalldata, signupUser, loginuser, getprofile, Subscription };