import { AppDataSource } from "../db/data-source";
import { Like } from "../models/Like.entity";

class LikeRepository {
    private repository = AppDataSource.getRepository(Like);

    async findByPostAndUser(postId: string, userId: string): Promise<Like | null> {
        console.log('Finding like for:', { postId, userId }); // Debug log
        return this.repository.findOne({
            where: { postId, userId }
        });
    }

    async create(postId: string, userId: string): Promise<Like> {
        console.log('Creating like for:', { postId, userId }); // Debug log
        const like = this.repository.create({ postId, userId });
        return await this.repository.save(like);
    }

    async delete(postId: string, userId: string): Promise<boolean> {
        const result = await this.repository.delete({ postId, userId });
        return result.affected ? result.affected > 0 : false;
    }

    async findByUserId(userId: string): Promise<Like[]> {
        return this.repository.find({
            where: { userId }
        });
    }
}

export const likeRepository = new LikeRepository();