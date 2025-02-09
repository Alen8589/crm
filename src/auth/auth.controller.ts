import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidatedUser } from 'src/common/types/user.types';


interface ApiResponse {
    statusCode: number,
    success: boolean;
    message: string;
    data: { user: ValidatedUser, accessToken: string, refreshToken: string };
    error: any;
}

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    async login(@Body() body: { email: string, password: string }): Promise<ApiResponse> {
        const user = await this.authService.validateUser(body.email, body.password)

        const { accessToken, refreshToken } = await this.authService.generateTokens(user);

        return {
            statusCode: 200,
            success: true,
            message: 'success',
            data: { user: user, accessToken, refreshToken },
            error: null
        }
    }

    @Post('refresh')
    async refreshToken(@Body('refreshToken') refreshToken: string): Promise<ApiResponse> {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not provided');
        }

        const user = await this.authService.validateRefreshToken(refreshToken);
        const tokens = await this.authService.generateTokens(user);

        return {
            statusCode: 200,
            success: true,
            message: 'success',
            data: { user, ...tokens },
            error: null
        }
    }


    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return await this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: { token: string; newPassword: string }) {
        return await this.authService.resetPassword(body.token, body.newPassword);
    }
}
