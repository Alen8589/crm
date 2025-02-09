import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ValidatedUser } from 'src/common/types/user.types';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from 'src/users/users.schema';
import { MailService } from './guards/mail.service';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<User>,
        private mailService: MailService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials')
        }
        
        if(!user?.isActive){
            throw new UnauthorizedException('Inactive User')
        }

        return { _id: user._id, email: user.email, companyId: user.companyId, roles: user.roles };
    }

    async generateTokens(user: ValidatedUser) {
        const payload = { sub: user._id, email: user.email, companyId: user.companyId, roles: user.roles };

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: '1d',
        })

        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: '7d',
        });

        return { accessToken, refreshToken }
    }

    async validateRefreshToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token, {
                secret: process.env.REFRESH_TOKEN_SECRET
            })

            return { _id: decoded.sub, email: decoded.email, companyId: decoded.companyId, roles: decoded.roles }
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token')
        }
    }

    async forgotPassword(email: string): Promise<string> {
        const user = await this.userModel.findOne({ email });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Set token expiry (1 hour from now)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        user.resetToken = resetToken;
        user.resetTokenExpiry = expiryDate;
        await user.save();

        const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;

        // Mock email sending (Replace with actual email service)
        console.log(`Reset link: http://localhost:3000/auth/reset-password?token=${resetToken}`);
        await this.mailService.sendResetPasswordEmail(email, resetLink);

        return 'Password reset link sent to your email';
    }


    async resetPassword(token: string, newPassword: string): Promise<string> {
        const user = await this.userModel.findOne({ resetToken: token });

        if (!user || user.resetTokenExpiry < new Date()) {
            throw new BadRequestException('Invalid or expired token');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and remove reset token
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return 'Password reset successfully';
    }


}
