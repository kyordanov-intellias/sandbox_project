import { AppDataSource } from "../db/data-source";
import { Post } from "../models/Post.entity";
import { Comment } from "../models/Comment.entity";

class PostRepository {
  private repository = AppDataSource.getRepository(Post);

  async create(postData: {
    authorId: string;
    content: string;
    imageUrl?: string;
    authorInfo: {
      firstName: string;
      lastName: string;
      profileImage: string;
      userRole: string;
    };
  }): Promise<Post> {
    const post = this.repository.create(postData);
    const savedPost = await this.repository.save(post);
    return this.findById(savedPost.id) as Promise<Post>;
  }

  async findById(id: string) {
    return this.repository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.comments", "comments")
      .where("post.id = :id", { id })
      .getOne();
  }

  async getAllPosts() {
    return this.repository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.comments", "comments")
      .orderBy("post.created_at", "DESC")
      .addOrderBy("comments.created_at", "DESC")
      .getMany();
  }

  async incrementLikes(id: string): Promise<Post | null> {
    await this.repository
      .createQueryBuilder()
      .update(Post)
      .set({ likesCount: () => "likes_count + 1" })
      .where("id = :id", { id })
      .execute();

    return this.findById(id);
  }

  async decrementLikes(id: string): Promise<Post | null> {
    await this.repository
      .createQueryBuilder()
      .update(Post)
      .set({ likesCount: () => "GREATEST(likes_count - 1, 0)" })
      .where("id = :id", { id })
      .execute();
  
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}

export const postRepository = new PostRepository();
