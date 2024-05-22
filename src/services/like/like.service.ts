import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/entities/comment.entity";
import { Like } from "src/entities/like.entity";
import { PosT } from "src/entities/post.entity";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(PosT) private readonly postRepository: Repository<PosT>,
        @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Like) private readonly likeRepository: Repository<Like>
    ) {}

    async getAllLikesByPost(postId: number ): Promise<Like[] | ApiResponse> {
        try {
            const likes = await this.likeRepository.find({where: {postId: postId}});
            return likes;
        } catch (error) {
            return new ApiResponse('error', -7006, 'Failed to get post likes');
        }
    }

    async getAllLikesByComment(commentId: number ): Promise<Like[] | ApiResponse> {
        try {
            const likes = await this.likeRepository.find({where: {commentId: commentId}});
            return likes;
        } catch (error) {
            return new ApiResponse('error', -7007, 'Failed to get comment likes');
        }
    }

    async likePost(userId: number, postId: number): Promise<Like | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!');
        }
        const post = await this.postRepository.findOne({where: {postId: postId}});
        if (!post) {
            return new ApiResponse('error', -2001, 'This post is not found!');
        }
        
        const newLike = new Like();

        newLike.user = user;
        newLike.userId = user.userId;
        newLike.post = post;
        newLike.postId = post.postId;
        newLike.comment = null;

        try {
            const savedLike = await this.likeRepository.save(newLike);
            return savedLike;
        } catch (error) {
            return new ApiResponse('error', -7001, 'Like is not saved.')
        }
    }

    async dislikePost(userId: number, postId: number): Promise<Like | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!');
        }
        const post = await this.postRepository.findOne({where: {postId: postId}});
        if (!post) {
            return new ApiResponse('error', -2001, 'This post is not found!');
        }

        const existingLike = await this.likeRepository.findOne({where: {userId: userId, postId: postId}});
        if (!existingLike) {
            return new ApiResponse('error', -7004, 'User did not like this post!');
        }
        try {
            await this.likeRepository.remove(existingLike);
            return existingLike;
        } catch (error) {
            return new ApiResponse('error', -7005, 'Failed to remove like.')
        }
    }

    async likeComment(userId: number, commentId: number): Promise<Like | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!');
        }
        const comment = await this.commentRepository.findOne({where: {commentId: commentId}});
        if (!comment) {
            return new ApiResponse('error', -3001, 'Comment not found!');
        }

        const newLike = new Like()
        newLike.user = user;
        newLike.userId = user.userId;
        newLike.post = null;
        newLike.comment = comment;
        newLike.commentId = comment.commentId;
        try {
            const savedLike = await this.likeRepository.save(newLike);
            return savedLike;
        } catch (error) {
            return new ApiResponse('error', -7001, 'Like is not saved.')
        }
    }

    async dislikeComment(userId: number, commentId: number): Promise<Like | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!');
        }
        const comment = await this.commentRepository.findOne({where: {commentId: commentId}});
        if (!comment) {
            return new ApiResponse('error', -3001, 'Comment not found!');
        }

        const existingLike = await this.likeRepository.findOne({where: {userId: userId, commentId: commentId}});
        if (!existingLike) {
            return new ApiResponse('error', -7005, 'User already liked this comment!');
        }
        try {
          
            await this.likeRepository.remove(existingLike);
            return existingLike;
        } catch (error) {
            return new ApiResponse('error', -7001, 'Like is not saved.')
        }
    }
}