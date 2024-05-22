import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PosT} from "./post.entity";
import { User } from "./user.entity";
import { Like } from "./like.entity";
import * as Validator from "class-validator";

@Index("fk_comment_post_id", ["postId"], {})
@Index("fk_comment_user_id", ["userId"], {})
@Entity("comment", { schema: "public" })
export class Comment {
  @Column("text", { name: "content" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1, 500)
  content: string;

  @PrimaryGeneratedColumn({ type: "integer", name: "comment_id" })
  commentId: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("integer", { name: "post_id" })
  postId: number;

  @ManyToOne(() => PosT, (post) => post.comments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "postId" }])
  post: PosT;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];
}
