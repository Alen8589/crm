import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class JwtGuard implements CanActivate{
    constructor(private jwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;

        if(!authHeader){
            throw new UnauthorizedException('Token not provided');
        }

        const token = authHeader.replace('Bearer ', '');

        try {
            const decoded = this.jwtService.verify(token, {secret: process.env.ACCESS_TOKEN_SECRET})
            console.log(decoded.user)

            request.user = decoded;

            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid token')
        }
    }
}