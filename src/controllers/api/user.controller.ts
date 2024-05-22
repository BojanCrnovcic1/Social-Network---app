import { Body, Controller, Delete, Get, Param, Patch, Query } from "@nestjs/common";
import { UpdateUserDto } from "src/dtos/user/update.user.dto";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { UserService } from "src/services/user/user.service";

@Controller('api/user/')
export class UserController {
    constructor(private userService: UserService) {}

    @Get()
    getAllUser(): Promise<User[]> {
        return this.userService.getAllUser();
    }
    
    @Get('username')
    getNameUser(@Query('username') username: string): Promise<User[]> {
        return this.userService.getUsersUsernames(username)
    }

    @Get(':id')
    getUserById(@Param('id') userId: number): Promise<User | ApiResponse> {
        return this.userService.getById(userId);
    }
 
    @Patch('edit/:id')
    updateUserProfile(@Param('id') userId: number, @Body() data: UpdateUserDto): Promise<User | ApiResponse> {
        return this.userService.updateUser(userId,data);
    }

    @Delete('delete/:id')
    deleteAcc(@Param('id') userId: number): Promise<User | ApiResponse> {
        return this.userService.deleteUser(userId);
    }
}