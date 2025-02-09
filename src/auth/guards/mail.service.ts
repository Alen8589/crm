import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    async sendResetPasswordEmail(email: string, resetLink: string) {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('Reset password email sent to:', email);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Email sending failed');
        }
    }
}
