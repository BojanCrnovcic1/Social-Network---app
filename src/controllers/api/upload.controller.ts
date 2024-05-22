import { Body, Controller, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import multer from "multer";
import  { extname } from "path";
import { AuthService } from "src/auth/auth.service";
import { AddPostDto } from "src/dtos/post/add.post.dto";
import { PosT } from "src/entities/post.entity";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { PathURL } from "src/misc/path.url";
import { supabase } from "src/misc/supabase.client";
import { PostService } from "src/services/post/post.service";
import { UserService } from "src/services/user/user.service";

@Controller('api/upload/')
export class UploadController {
  private mega: any;
    constructor(
        private postService: PostService,
        private userService: UserService,
        private authService: AuthService,
    ) {}
    
    @Post('profilePhoto')
    @UseInterceptors(
      FileInterceptor('profilePhoto', {
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
    async createProfilePhoto(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<User | ApiResponse> {
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
          const uploadedProfileUrl = data?.path ? PathURL.url + uniquename:'';
            const createProfile = await this.userService.createProfilePhoto(userId, uploadedProfileUrl)
            return createProfile;
        } catch (error) {
         return new ApiResponse('error', -10001, 'Internal server error');
        }
    }

    @Post('coverPhoto')
    @UseInterceptors(
      FileInterceptor('coverPhoto', {
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
    async createCoverPhoto(@Req() req: Request, @UploadedFile() file: Express.Multer.File): Promise<User | ApiResponse> {
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
            const uploadedCoverUrl = data?.path ? PathURL.url + uniquename:'';
            const coverPicture = await this.userService. createCoverPhoto(userId, uploadedCoverUrl)
            return coverPicture;
        } catch (error) {
         return new ApiResponse('error', -10001, 'Internal server error');
        }
    }

    @Post('postPhoto')
    @UseInterceptors(
        FileInterceptor('postPhoto', {
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
    async createPostPhoto(@Req() req: Request, @Body() postData: AddPostDto, @UploadedFile() file: Express.Multer.File): Promise<PosT | ApiResponse> {
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
          const postPhotoUrl = data?.path ? PathURL.url + uniquename: '';
            const newPostData: AddPostDto = {
                content: postData.content,
                photo: postPhotoUrl,
            }
            const createPost = await this.postService.createPost(userId, newPostData);
            return createPost;
        } catch (error) {
         return new ApiResponse('error', -10001, 'Internal server error');
        }
    }

}