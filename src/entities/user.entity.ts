import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { PosT } from "./post.entity";
import { Relationship } from "./relationship.entity";
import { Stories } from "./stories.entity";
import { ViewedStories } from "./viewed.stories.entity";
import * as Validator from "class-validator";

@Index("uq_user_email", ["email"], { unique: true })
@Index("IDX_e12875dfb3b1d92d7d7c5377e2", ["email"], { unique: true })
@Entity("user", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "user_id" })
  userId: number;

  @Column("character varying", { name: "email", unique: true, length: 125 })
  @Validator.IsNotEmpty()
  @Validator.IsEmail({
    allow_ip_domain: false,
    allow_utf8_local_part: true,
    require_tld: true
  })
  email: string;

  @Column("character varying", { name: "password_hash", length: 225 })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;

  @Column("character varying", { name: "username", length: 225 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3, 255)
  username: string;

  @Column("text", { name: "bio", nullable: true })
  @Validator.IsString()
  @Validator.Length(50, 1500)
  bio: string | null;

  @Column("character varying", {
    name: "profile_photo",
    nullable: true,
    length: 225,
  })
  profilePhoto: string | null;

  @Column("character varying", {
    name: "cover_photo",
    nullable: true,
    length: 225,
  })
  coverPhoto: string | null;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => PosT, (post) => post.user)
  posts: PosT[];

  @OneToMany(() => Relationship, (relationship) => relationship.follower)
  relationships: Relationship[];

  @OneToMany(() => Relationship, (relationship) => relationship.following)
  relationships2: Relationship[];

  @OneToMany(() => Stories, (stories) => stories.user)
  stories: Stories[];

  @OneToMany(() => ViewedStories, (viewedStories) => viewedStories.user)
  viewedStories: ViewedStories[];
}
