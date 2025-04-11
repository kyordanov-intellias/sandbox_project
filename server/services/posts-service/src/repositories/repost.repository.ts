import { AppDataSource } from "../db/data-source";
import { Repost } from "../models/Repost.entity";

class RepostRepository {
  private repository = AppDataSource.getRepository(Repost);

  async findByPostAndUser(
    postId: string,
    userId: string
  ): Promise<Repost | null> {
    return this.repository.findOne({ where: { postId, userId } });
  }

  async create(postId: string, userId: string): Promise<Repost> {
    const repost = this.repository.create({ postId, userId });
    return this.repository.save(repost);
  }

  async delete(postId: string, userId: string): Promise<boolean> {
    const result = await this.repository.delete({ postId, userId });
    return result.affected ? result.affected > 0 : false;
  }

  async findByUserId(userId: string): Promise<Repost[]> {
    return this.repository.find({ where: { userId } });
  }
}

export const repostRepository = new RepostRepository();
