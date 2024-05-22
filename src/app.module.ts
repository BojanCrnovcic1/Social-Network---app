import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { PosT } from './entities/post.entity';
import { Stories } from './entities/stories.entity';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from 'config/jwt.secret';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/api/user.controller';
import { UserService } from './services/user/user.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from './auth/jwt.service';
import { AuthGuard } from './auth/auth.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { AuthMiddleware } from './auth/auth.middleware';
import { PostService } from './services/post/post.service';
import { PostController } from './controllers/api/post.controller';
import { CommentController } from './controllers/api/comment.controller';
import { CommentService } from './services/comment/comment.service';
import { UploadController } from './controllers/api/upload.controller';
import { StoriesService } from './services/stories/stories.service';
import { LikeService } from './services/like/like.service';
import { Relationship } from './entities/relationship.entity';
import { RelationshipController } from './controllers/api/relationship.controller';
import { RelationshipService } from './services/relationship/relationship.service';
import { StoriesController } from './controllers/api/stories.controller';
import { ViewedStories } from './entities/viewed.stories.entity';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DatabaseConfiguration.hostname,
      port: 5432,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Comment,
        Like,
        PosT,
        Relationship,
        Stories,
        User,
        ViewedStories,
      ],
      synchronize: true,
      ssl: {
        rejectUnauthorized: false
      }
    }),
    TypeOrmModule.forFeature([
      Comment,
      Like,
      PosT,
      Relationship,
      Stories,
      User,
      ViewedStories,
    ]),
    JwtModule.register({
      secret: jwtSecret,
      signOptions: {expiresIn: '30m'}
    }),
    MulterModule.register({
      storage: multer.memoryStorage(),
    })
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    PostController,
    CommentController,
    RelationshipController,
    UploadController,
    StoriesController,
  ],
  providers: [
    UserService,
    AuthService,
    JwtService,
    AuthGuard,
    JwtStrategy,
    LocalStrategy,
    PostService,
    CommentService,
    StoriesService,
    LikeService,
    RelationshipService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
            .exclude('auth/*')
            .forRoutes('api/*')
  }
}