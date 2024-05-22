import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Stories } from "./stories.entity";
import { User } from "./user.entity";

@Index("fk_viewed_stories_stories_id", ["storiesId"], {})
@Index("fk_viewed_stories_user_id", ["userId"], {})
@Entity("viewed_stories", { schema: "public" })
export class ViewedStories {
  @Column("integer", { name: "user_id" })
  userId: number;

  @Column("integer", { name: "stories_id" })
  storiesId: number;

  @Column("timestamp without time zone", {
    name: "viewed_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  viewedAt: Date;

  @PrimaryGeneratedColumn({ type: "integer", name: "viewed_stories_id" })
  viewedStoriesId: number;

  @ManyToOne(() => Stories, (stories) => stories.viewedStories, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "stories_id", referencedColumnName: "storiesId" }])
  stories: Stories;

  @ManyToOne(() => User, (user) => user.viewedStories, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
