import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Index("fk_relationship_follower_id", ["followerId"], {})
@Index("fk_relationship_following_id", ["followingId"], {})
@Entity("relationship", { schema: "public" })
export class Relationship {
  @PrimaryGeneratedColumn({ type: "integer", name: "relationship_id" })
  relationshipId: number;

  @Column("integer", { name: "follower_id" })
  followerId: number;

  @Column("integer", { name: "following_id" })
  followingId: number;

  @ManyToOne(() => User, (user) => user.relationships, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "follower_id", referencedColumnName: "userId" }])
  follower: User;

  @ManyToOne(() => User, (user) => user.relationships2, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "following_id", referencedColumnName: "userId" }])
  following: User;
}
