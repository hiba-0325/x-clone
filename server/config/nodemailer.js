import nodemailer from "nodemailer"

import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:{
            user:process.env.EMAIL_ID,
            pass:process.env.EMAIL_PASSWORD
        }
    }
});

export default transporter