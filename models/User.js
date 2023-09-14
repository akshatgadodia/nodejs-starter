const mongoose = require("mongoose");
const crypto = require("crypto");
const softDeleteMiddleware = require("../middlewares/softDeleteMiddleware")

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // To exclude password from query results by default
  },
  roles: {
    type: Object,
    required: true,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true, // Add createdAt and updatedAt fields
});

// Apply the softDeleteMiddleware to the schema
userSchema.plugin(softDeleteMiddleware);

const tokenExpirationMinutes = parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRATION, 10);

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + tokenExpirationMinutes * 60 * 1000; // Token expires in 30 minutes
  return resetToken;
};

module.exports = new mongoose.model("user", userSchema) 
