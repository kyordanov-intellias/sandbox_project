import { AppDataSource } from "../db/data-source";
import { Profile } from "../models/Profile";

class ProfileRepository {
  private repository = AppDataSource.getRepository(Profile);

  async create(profileData: {
    auth_id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
  }): Promise<Profile> {
    const profile = this.repository.create(profileData);
    return await this.repository.save(profile);
  }

  async findByAuthId(authId: string): Promise<Profile | null> {
    return await this.repository.findOne({
      where: { auth_id: authId }
    });
  }

  async findByEmail(email: string): Promise<Profile | null> {
    return await this.repository.findOne({
      where: { email }
    });
  }

  async update(
    authId: string,
    data: Partial<Omit<Profile, 'id' | 'auth_id' | 'created_at' | 'updated_at'>>
  ): Promise<Profile | null> {
    await this.repository.update({ auth_id: authId }, data);
    return this.findByAuthId(authId);
  }

  async delete(authId: string): Promise<boolean> {
    const result = await this.repository.delete({ auth_id: authId });
    return result.affected ? result.affected > 0 : false;
  }
}

export const profileRepository = new ProfileRepository();
