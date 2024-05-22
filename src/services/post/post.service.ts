import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddPostDto } from "src/dtos/post/add.post.dto";
import { EditPostDto } from "src/dtos/post/edit.post.dto";
import { PosT } from "src/entities/post.entity";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PosT) private readonly postRepository: Repository<PosT>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async getAllPosts(): Promise<PosT[]> {
        return await this.postRepository.find();
    }

    async getAllPostsByUser(userId: number): Promise<PosT[]> {
        return await this.postRepository.find({where: {userId: userId}});
    }

    async getPostById(postId: number): Promise<PosT | ApiResponse> {
        const post = await this.postRepository.findOne({where: {postId: postId}});
        if (!post) {
            return new ApiResponse('error', -2001, 'This post is not found!')
        }
        return post;
    }

    async createPost(userId: number, dataPost: AddPostDto): Promise< PosT | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!')
        }
        const newPost = new PosT();
        newPost.userId = userId;
        newPost.content = dataPost.content;
        newPost.photo = dataPost.photo;

        const savedPost = await this.postRepository.save(newPost);
        if (!savedPost) {
            return new ApiResponse('error', -2002, 'Post not saved.')
        }
        return savedPost;
    }

    async updatePost(userId: number, postId: number, content: EditPostDto): Promise< PosT | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!')
        }

        const post = await this.postRepository.findOne({where: {postId: postId}, relations: ['user']});
        if (!post) {
            return new ApiResponse('error', -2001, 'This post is not found!')
        }

        if (post.userId !== user.userId) {
            return new ApiResponse('error', -2003, 'This post is not post of same user.')
        }

        post.content = content.newContent;
        
        const savedContent = await this.postRepository.save(post);

        if (!savedContent) {
            return new ApiResponse('error', -2004, 'The post has not been edited.')
        }
        return savedContent;
    }

    async deletePost(postId: number): Promise<PosT | ApiResponse> {
        const post = await this.postRepository.findOne({where: {postId: postId}});
        if (!post) {
            return new ApiResponse('error', -2001, 'This post is not found!')
        }

        return await this.postRepository.remove(post);
    }
}