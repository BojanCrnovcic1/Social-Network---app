import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddCommentDto } from "src/dtos/comment/add.comment.dto";
import { EditCommentDto } from "src/dtos/comment/edit.comment.dto";
import { Comment } from "src/entities/comment.entity";
import { PosT } from "src/entities/post.entity";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
        @InjectRepository(PosT) private readonly postRepository: Repository<PosT>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async getAllComment(): Promise<Comment[]> {
        return this.commentRepository.find();
    }

    async getAllCommentForPost(postId: number): Promise<Comment[]> {
        return await this.commentRepository
          .createQueryBuilder('comment')
          .leftJoinAndSelect('comment.user', 'user')
          .where('comment.postId = :postId', { postId })
          .getMany();
      }

    async getAllCommentsByUser(userId: number): Promise<Comment[]> {
        return await this.commentRepository.find({ where: { userId: userId }, relations: ['user'] });
    }
    

    async getCommentById(commentId: number): Promise<Comment | ApiResponse> {
        const comment = await this.commentRepository.findOne({where: {commentId: commentId}, relations: ['user']});
        if (!comment) {
            return new ApiResponse('error', -3001, 'Comment not found!')
        }
        return comment;
    }

    async createComment(userId: number, postId: number, data: AddCommentDto): Promise<Comment | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!');
        }
        const post = await this.postRepository.findOne({where: {postId: postId}});
        if (!post) {
            return new ApiResponse('error', -2001, 'This post is not found!')
        }

        const newComment = new Comment();
        newComment.user = new User();
        newComment.user.userId = user.userId;
        newComment.post = new PosT();
        newComment.post.postId = post.postId;
        newComment.content = data.content;

        const savedComment = await this.commentRepository.save(newComment);
        if (!savedComment) {
            return new ApiResponse('error', -3003, 'Comment is not add.')
        }
        return savedComment;
    }

    async updateComment(userId: number, commentId: number, data: EditCommentDto): Promise<Comment | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found!');
        }

        const comment = await this.commentRepository.findOne({where: {commentId: commentId}});
        if (!comment) {
            return new ApiResponse('error', -3001, 'Comment not found!')
        }

        if (comment.userId !== user.userId) {
            return new ApiResponse('error', -3004, 'User is not authorized to comment on this post.');
        }

        comment.content = data.newContent;

        const savedComment = await this.commentRepository.save(comment);
        if (!savedComment) {
            return new ApiResponse('error', -3005, 'Comment is not update.')
        }
        return savedComment;
    }

    async deleteComment(commentId: number): Promise<Comment | ApiResponse> {
        const comment = await this.commentRepository.findOne({where: {commentId: commentId}});
        if (!comment) {
            return new ApiResponse('error', -3001, 'Comment not found!')
        }

        return await this.commentRepository.remove(comment);
    }
}