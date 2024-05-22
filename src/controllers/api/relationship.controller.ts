import { Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { AuthService } from "src/auth/auth.service";
import { Relationship } from "src/entities/relationship.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { RelationshipService } from "src/services/relationship/relationship.service";

@Controller('api/relationship')
export class RelationshipController {
    constructor(
        private readonly relationshipService: RelationshipService,
        private readonly authService: AuthService,
    ) {}

    @Get('followers/:id')
    async getFollowers(@Param('id') userId: number): Promise<Relationship[]> {
       return await this.relationshipService.getUserFollowers(userId);
    }

    @Get('following/:id')
    async getFollowing(@Param('id') userId: number): Promise<Relationship[]> {
        return await this.relationshipService.getUserFollowing(userId);
    }

    @Get(':followerId/:followingId')
    async getSingleRelationship(@Param('followerId') followerId: number, @Param('followingId') followingId: number): Promise<Relationship | ApiResponse> {
        try {
            const relationship = await this.relationshipService.getSingleRelationship(followerId, followingId);
            if (!relationship) {
                return new ApiResponse('error', -4006, 'Relationship not found.');
            }
            return relationship;
        } catch (error) {
            console.error('Error getting single relationship: ', error);
            return new ApiResponse('error', -4007, 'Failed to fetch relationship.');
        }
    }

    @Post('follow/:followingId')
    @UseGuards(AuthGuard)
    async followUser(@Req() req: Request, @Param('followingId') followingId: number): Promise<Relationship | ApiResponse> {
        const user = await this.authService.getCurrentUser(req);
        if (!user || !user.userId) {
            return new ApiResponse('error', -1009, 'User not authorized');
        }
        const userId = user.userId;
        return await this.relationshipService.followUser(userId, followingId);
    };

    @Delete('unfollow/:followingId')
    async unfollowUser(@Req() req: Request, @Param('followingId') followingId: number): Promise<ApiResponse> {
        const user = await this.authService.getCurrentUser(req);
        if (!user || !user.userId) {
            return new ApiResponse('error', -1009, 'User not authorized');
        }
        const userId = user.userId;
        return await this.relationshipService.unfollowUser(userId, followingId);
    };
}