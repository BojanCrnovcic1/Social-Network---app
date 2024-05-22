import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { ViewedStories } from "./viewed.stories.entity";

@Index("fk_stories_user_id", ["userId"], {})
@Entity("stories", { schema: "public" })
export class Stories {
  @PrimaryGeneratedColumn({ type: "integer", name: "stories_id" })
  storiesId: number;

  @Column("character varying", { name: "photo_stories", length: 255 })
  photoStories: string;

  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("timestamp without time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.stories, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;

  @OneToMany(() => ViewedStories, (viewedStories) => viewedStories.stories)
  viewedStories: ViewedStories[];
}
