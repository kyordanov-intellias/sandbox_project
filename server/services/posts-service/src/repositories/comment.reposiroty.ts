import { AppDataSource } from "../db/data-source";
import { Comment } from "../models/Comment.entity";

class CommentRepository {
  private repository = AppDataSource.getRepository(Comment);

  async create(commentData: {
    authorId: string;
    content: string;
    postId: string;
  }): Promise<Comment> {
    const comment = this.repository.create(commentData);
    return await this.repository.save(comment);
  }

  async findByPostId(postId: string) {
    return this.repository
      .createQueryBuilder("comment")
      .where("comment.postId = :postId", { postId })
      .orderBy("comment.createdAt", "DESC")
      .getMany();
  }

  async findById(id: string): Promise<Comment | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["post"],
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findByAuthorId(authorId: string) {
    return this.repository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.post", "post")
      .where("comment.author_id = :authorId", { authorId })
      .orderBy("comment.created_at", "DESC")
      .getMany();
  }

  async update(id: string, content: string): Promise<Comment | null> {
    await this.repository.update(id, { content });
    return this.findById(id);
  }
}

export const commentRepository = new CommentRepository();