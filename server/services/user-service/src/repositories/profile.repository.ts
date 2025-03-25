import { AppDataSource } from "../db/data-source";
import { Profile } from "../models/Profile";
import { FindOneOptions } from "typeorm";

class ProfileRepository {
  private repository = AppDataSource.getRepository(Profile);

  async create(profileData: {
    authId: string;
    email: string;
    firstName: string;
    lastName: string;
    userRole: string;
  }): Promise<Profile> {
    const profile = this.repository.create(profileData);
    return await this.repository.save(profile);
  }

  async findByAuthId(authId: string) {
    return this.repository
      .createQueryBuilder("profile")
      .leftJoinAndSelect("profile.skills", "profileSkills")
      .leftJoinAndSelect("profileSkills.skill", "skill")
      .leftJoinAndSelect("profile.contacts", "contacts")
      .where("profile.auth_id = :authId", { authId })
      .getOne();
  }

  async findByEmail(email: string): Promise<Profile | null> {
    return await this.repository.findOne({
      where: { email },
    });
  }

  async update(
    authId: string,
    data: Partial<Omit<Profile, 'id' | 'authId' | 'created_at'>>
  ): Promise<Profile | null> {
    await this.repository.update({ authId: authId }, data);
    return this.findByAuthId(authId);
  }
  

  async delete(authId: string): Promise<boolean> {
    const result = await this.repository.delete({ authId: authId });
    return result.affected ? result.affected > 0 : false;
  }
}

export const profileRepository = new ProfileRepository();
