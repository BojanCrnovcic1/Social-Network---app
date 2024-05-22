import { Controller, Delete, Get, Param, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import multer from "multer";
import { extname } from "path";
import { Request } from "express";
import { AuthService } from "src/auth/auth.service";
import { Stories } from "src/entities/stories.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { StoriesService } from "src/services/stories/stories.service";
import { ViewedStories } from "src/entities/viewed.stories.entity";
import { supabase } from "src/misc/supabase.client";
import { PathURL } from "src/misc/path.url";

@Controller('api/stories/')
export class StoriesController {
    constructor(
        private storiesService: StoriesService,
        private authService: AuthService,
    ){}

    @Get()
    async getAllStories(): Promise<Stories[]> {
        return await this.storiesService.getStories()
    }

    @Get(':id')
    async getStoriesById(@Param('id') storiesId: number): Promise<Stories | ApiResponse> {
        return await this.storiesService.getStoryById(storiesId);
    }

    @Delete('deleteExpired')
    async deleteExpiredStories(): Promise<void> {
        await this.storiesService.removeOldStories();
    }

    @Get('allViewed/:storiesId')
    async allViewedStoryList(@Param('storiesId') storiesId: number): Promise<ViewedStories[] | ApiResponse> {
        return await this.storiesService.getViewidList(storiesId);
    }

    @Post('viewedStory/:storiesId')
    async trackViewedStory(@Req() req: Request, @Param('storiesId') storiesId: number): Promise<ViewedStories | ApiResponse> {
        const user = await this.authService.getCurrentUser(req);
        if (!user || !user.userId) {
            return new ApiResponse('error', -1009, 'User not authorized');
        }
        const userId = user.userId;

        return await this.storiesService.trackViewedStory(userId, storiesId);
    }
    
    @Post('story')
    @UseInterceptors(
        FileInterceptor('story', {
            storage: multer.memoryStorage(),
              fileFilter(req, file, cb) {
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                const ext = extname(file.originalname).toLowerCase();
                if (allowedExtensions.includes(ext)) {
                cb(null, true);
               } 
             }
        })
    )
    async createStory(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<Stories | ApiResponse> {
      const user = await this.authService.getCurrentUser(req);
        if (!user || !user.userId) {
            return new ApiResponse('error', -1009, 'User not authorized');
        }
        const userId = user.userId;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const uniquename = uniqueSuffix + '_' + file.originalname;
        try {
            const {data, error } = await supabase.storage.from('images').upload(uniquename, file.buffer);
           
            if (error) {
              error.message
              console.log('error message: ', error.message)
              return new ApiResponse('error', -10002, 'Supabase upload error.')
            }
            const storyUrl = data?.path ? PathURL.url + uniquename: '';

            const story = await this.storiesService.createStory(userId, storyUrl);
            return story;
        } catch (error) {
            return new ApiResponse('error', -10001, 'Internal server error');
        }
    }

    @Delete('deleteStory/:id')
    async deleteStory(@Param('id') storiesId: number): Promise<Stories | ApiResponse> {
        return await this.storiesService.removeStory(storiesId);
    }
}