import { AppDataSource } from "../db/data-source";
import { Post } from "../models/Post.entity";

class PostRepository {
  private repository = AppDataSource.getRepository(Post);

  async create(postData: {
    authorId: string;
    content: string;
    imageUrl?: string;
  }): Promise<Post> {
    const post = this.repository.create(postData);
    return await this.repository.save(post);
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

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}

export const postRepository = new PostRepository();