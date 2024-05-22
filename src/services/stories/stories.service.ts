import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Stories } from "src/entities/stories.entity";
import { User } from "src/entities/user.entity";
import { ViewedStories } from "src/entities/viewed.stories.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { Repository } from "typeorm";

@Injectable()
export class StoriesService {
    constructor(
        @InjectRepository(Stories) private readonly storiesRepository: Repository<Stories>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(ViewedStories) private readonly viewedStoriesRepository: Repository<ViewedStories>
    ) {}

    async getStories(): Promise<Stories[]> {
        return this.storiesRepository.find();
    }

    async getStoryById(storiesId: number): Promise<Stories | ApiResponse> {
        const story = await this.storiesRepository.findOne({where: {storiesId: storiesId}});
        if (!story) {
            return new ApiResponse('error', -6002, 'Story not found!')
        }
        return story;
    }

    async trackViewedStory(userId: number, storiesId: number): Promise<ViewedStories | ApiResponse> {
        const existingView = await this.viewedStoriesRepository.findOne({
            where: {userId: userId, storiesId: storiesId}
        });

        if (existingView) {
            return new ApiResponse('error', -6004, 'Story already viewed by user.')
        }

        const viewedStory = new ViewedStories();
        viewedStory.userId = userId;
        viewedStory.storiesId= storiesId;
        viewedStory.viewedAt = new Date();

        const savedView = await this.viewedStoriesRepository.save(viewedStory);
        if (!savedView) {
            return new ApiResponse('error', -6005, 'Failed to save viewed story.');
        }
        return savedView;
    }

    async getViewidList(storiesId: number): Promise<ViewedStories[] | ApiResponse> {
        try {
            const viewedStories = await this.viewedStoriesRepository.find({
                where: {storiesId: storiesId},
                relations: ['user']
            })
            return viewedStories;
        } catch (error) {
             new ApiResponse('error', -6008, 'Bad viewed list.')
        }
    }

    async createStory(userId: number, story: string): Promise<Stories | ApiResponse> {
        const user = await this.userRepository.findOne({where: {userId: userId}});
        if (!user) {
            return new ApiResponse('error', -1001, 'User not found.')
        }

        const newStory = new Stories();
        newStory.user= new User()
        newStory.user.userId = user.userId;
        newStory.photoStories = story;

        const savedStories = await this.storiesRepository.save(newStory);
        if (!savedStories) {
            return new ApiResponse('error', -6001, 'Story not save.')
        }
        return savedStories;
    }

    async removeStory(storiesId: number): Promise<Stories | ApiResponse> {
        const story = await this.storiesRepository.findOne({where: {storiesId: storiesId}});
        if (!story) {
            return new ApiResponse('error', -6002, 'Story not found!')
        }
        return await this.storiesRepository.remove(story);
    }

    @Cron('0 0 * * *')
    async removeOldStories(): Promise<void> {
        await this.storiesRepository
            .createQueryBuilder()
            .delete()
            .where("createdAt + INTERVAL '1 day' <= CURRENT_TIMESTAMP")
            .execute();
      }
}