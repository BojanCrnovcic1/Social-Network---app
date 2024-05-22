import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UseGuards, Headers } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "src/auth/jwt.service";
import { LoginUserDto } from "src/dtos/user/login.user.dto";
import { RegisterUserDto } from "src/dtos/user/register.user.dto";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { UserService } from "src/services/user/user.service";


@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private jwtService: JwtService) {}

    @Get('/user/me')
    @UseGuards(AuthGuard)
    async getUserProfile(@Req() req: Request, @Headers('authorization') authorization: string): Promise<User | ApiResponse> {
        const token = authorization?.replace(/^Bearer\s+/, '');
        if (!token) {
            return new ApiResponse('error', -1011, 'Token faild.')
        }
        const jwtService = this.jwtService;
        const userData = jwtService.verifyAndGetUserData(token);

        if (userData) {
            const userId = userData.userId;
            const user = await this.userService.getById(userId);
            if (user) {
                req.user = userId;

                return user;
            } else {
                return new ApiResponse('error', -1011, 'Token faild.')
            }
        } else {
            return new ApiResponse('error', -1011, 'Token faild.')
        }
    }

    @Post('/user/registar')
    async registrationUser(@Body() data: RegisterUserDto): Promise<User | ApiResponse> {
        return await this.userService.registerUser(data);
    }

    @Post('/user/login')
    async login(@Body() data: LoginUserDto, @Res() res: Response) {
        try {
            const user = await this.authService.login(data);
            if (!user) {
                throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
              }

            const token = user;
            res.status(HttpStatus.OK).json({ token });
            return { message: 'Login successful' };

        } catch (err) {
            throw err;
        }

    }
}
