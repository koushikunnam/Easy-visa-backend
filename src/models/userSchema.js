const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    email: {
        type: String,
        unique:false
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    userRoleId: {
        type: Number,
        enum: [65100109105110, 85115101114, 771011149910497110116],
        default: 85115101114
    },
    membership: {
        type: String,
        enum: ['Free', 'Gold'],
        default: "Free"
    },
    subscription_id: {
        type: Schema.Types.ObjectId,
        ref: "subscriptions",
        required: false,
      },
},
    {
        timestamps: true 
    }
)

const userModal = model("users", userSchema)

module.exports = userModal