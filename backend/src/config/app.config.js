const dotenv = require('dotenv');
const { brotliCompressSync } = require('zlib');
dotenv.config();
module.exports = {
  port: process.env.PORT,
  JWT_SECRET:process.env.JWT_SECRET,
  jwt_expiry:process.env.JWT_EXPIRY,
  brcrypt_salt_rounds:process.env.BCRYPT_SALT_ROUNDS,
};

