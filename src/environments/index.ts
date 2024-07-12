import * as dotenv from 'dotenv'
dotenv.config()

// environment
const NODE_ENV: string = process.env.NODE_ENV || 'development'

// application
const APP_DOMAIN: string = process.env.APP_DOMAIN || 'localhost'
const APP_PORT: number = +process.env.APP_PORT || 2093

// mongodb
const MONGO_DATABASE_URI = process.env.MONGO_DATABASE_URI || 'mongodb://localhost:27017/youapp_chat_db'

// jsonwebtoken
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '12d'
const JWT_ACCESS_TOKEN: string = process.env.JWT_ACCESS_TOKEN || 'accessxxx'
const JWT_REFRESH_TOKEN: string = process.env.JWT_REFRESH_TOKEN || 'refreshxxx'

// bcrypt
const SALT: number = +process.env.SALT || 10

// cloudinary
const CLOUDINARY_CLOUD_NAME: string = process.env.CLOUDINARY_CLOUD_NAME || 'xxx'
const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || 'xxx'
const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || 'xxx'

// mq
const AMQP_URI: string = process.env.AMQP_URI || 'amqp://user:password@localhost:5672'

export {
	NODE_ENV,
	APP_DOMAIN,
	APP_PORT,
	MONGO_DATABASE_URI,
	JWT_EXPIRES_IN,
	JWT_ACCESS_TOKEN,
	JWT_REFRESH_TOKEN,
	SALT,
	CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
	AMQP_URI
}
