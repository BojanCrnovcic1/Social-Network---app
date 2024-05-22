import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { PosT } from "./post.entity";
import { User } from "./user.entity";

@Index("fk_like_comment_id", ["commentId"], {})
@Index("fk_like_post_id", ["postId"], {})
@Index("fk_like_user_id", ["userId"], {})
@Entity("like", { schema: "public" })
export class Like {
  @PrimaryGeneratedColumn({ type: "integer", name: "like_id" })
  likeId: number;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("integer", { name: "post_id", nullable: true })
  postId: number | null;

  @Column("integer", { name: "comment_id", nullable: true })
  commentId: number | null;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "comment_id", referencedColumnName: "commentId" }])
  comment: Comment;

  @ManyToOne(() => PosT, (post) => post.likes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "post_id", referencedColumnName: "postId" }])
  post: PosT;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
