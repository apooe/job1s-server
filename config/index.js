const dotenv = require("dotenv");

//lload .env file
const evFound = dotenv.config();
if (!evFound) {
  throw new Error("could not find .env file");
}

//define env variables
const config = {
  port: Number(process.env.PORT) || 8080,
  databaseURL: process.env.DATABASE_URL,
  api: {
    prefix: "/api",
  },
  google: {
    placeApiKey: process.env.GOOGLE_API_KEY,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || "apooe",
  },
  aws: {
    id: process.env.AWS_ID,
    secret: process.env.AWS_SECRET,
    bucket: process.env.AWS_UPLOAD_BUCKET_NAME,
  },
};

module.exports = config;
