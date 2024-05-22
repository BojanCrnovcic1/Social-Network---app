import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./comment.entity";
import { Like } from "./like.entity";
import { User } from "./user.entity";
import * as Validator from "class-validator";

@Index("fk_post_user_id", ["userId"], {})
@Entity("post", { schema: "public" })
export class PosT {
  @Column("text", { name: "content", nullable: true })
  @Validator.Length(1, 500)
  content: string | null;

  @Column("character varying", { name: "photo", nullable: true, length: 255 })
  photo: string | null;

  @PrimaryGeneratedColumn({ type: "integer", name: "post_id" })
  postId: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("integer", { name: "user_id" })
  userId: number;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
