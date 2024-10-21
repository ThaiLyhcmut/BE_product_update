const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Date,
      required: true,
      // Cần một giá trị thời gian mặc định cho expireAt, ví dụ:
      default: () => new Date(Date.now() + 30 * 1000) // Hết hạn sau 30 phút
    }
  },
  {
    timestamps: true,
  }
);

// Tạo chỉ mục TTL cho expireAt
forgotPasswordSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);

module.exports = ForgotPassword;
