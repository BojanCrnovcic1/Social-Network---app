import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Relationship } from "src/entities/relationship.entity";
import { User } from "src/entities/user.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class RelationshipService {
    constructor(
        @InjectRepository(Relationship) private readonly relationshipRepository: Repository<Relationship>,
    ) {}

    async getUserFollowers(userId: number): Promise<Relationship[]> {
        return await this.relationshipRepository.find({ where: { followingId: userId}, relations: ['follower'] });
    }

    async getUserFollowing(userId: number): Promise<Relationship[]> {
        return await this.relationshipRepository.find({ where: { followerId: userId }, relations: ['following'] });
    }

    async getSingleRelationship(followerId: number, followingId: number): Promise<Relationship | null> {
        try {
            return await this.relationshipRepository.findOne({
                where: { followerId: followerId, followingId: followingId },
                relations: ['follower', 'following']
            });
        } catch (error) {
            console.error('Error fetching single relationship: ', error);
            return null;
        }
    }

    async followUser(followerId: number, followingId: number): Promise<Relationship | ApiResponse> {
        try {
            if (followerId === followingId) {
                return new ApiResponse('error', -4003, 'User cannot follow themselves.');
            }
            
            const existingRelationship = await this.relationshipRepository.findOne({
                where: { followerId: followerId, followingId: followingId }
            });
            if (existingRelationship) {
                return new ApiResponse('error', -4004, 'User is already being followed.');
            } 
    
     
            const relationship = new Relationship();
            const follower = new User(); 
            follower.userId = followerId;

            const following = new User();
            following.userId = followingId;

            relationship.follower = follower;
            relationship.following = following;
    
            await this.relationshipRepository.save(relationship);
            return new ApiResponse('success', 0, 'User followed successfully.');
        } catch (error) {
            console.error('Error saving follower: ', error);
            return new ApiResponse('error', -4001, 'Failed to follow user.');
        }
    }
    
    
    async unfollowUser(followerId: number, followingId: number): Promise<ApiResponse> {
        try {
            const existingRelationship = await this.relationshipRepository.findOne({
                where: { followerId: followerId, followingId: followingId }
            });
            if (!existingRelationship) {
                return new ApiResponse('error', -4005, 'User is not being followed.');
            } 

            await this.relationshipRepository.remove(existingRelationship);
            return new ApiResponse('success', 0, 'User unfollowed successfully.');

          } catch (error) {
            return new ApiResponse('error', -4002, 'Failed to unfollow user.');
          }
    };

}