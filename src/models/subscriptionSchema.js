const { Schema, model } = require("mongoose");

const subscriptionSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "inactive", "canceled"],
    },
    start_date: {
      type: Date,
      default: Date.now,
    },
    end_date: {
      type: Date,
      required: false,
    },
    renewal_date: {
      type: Date,
      required: false,
    },
    auto_renew: {
      type: Boolean,
      default: true,
    },
    payment_method: {
      type: String,
      required: false,
      enum: [
        "cash",
        "credit card",
        "PayPal",
        "debit card",
        "googlepay",
        "phonepay",
        "paytm",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const subscriptionModal = model("subscriptions", subscriptionSchema);

module.exports = subscriptionModal;
