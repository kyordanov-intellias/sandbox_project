import { AppDataSource } from '../db/data-source';
import { Profile } from '../models/Profile';
import { Skill, ProfileSkill } from '../models/Skill';
import { Contact } from '../models/Contact';

interface SkillInput {
  name: string;
  proficiencyLevel: string;
}

interface ContactInput {
  type: string;
  value: string;
  isPrimary: boolean;
}

export interface UserCreatedEvent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
  skills: SkillInput[];
  contacts: ContactInput[];
}

export class UserHandlerService {
  async handleUserCreated(userData: UserCreatedEvent) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingProfile = await queryRunner.manager.findOne(Profile, {
        where: { auth_id: userData.id }
      });

      if (existingProfile) {
        console.log(`⚠️ Profile already exists for auth_id: ${userData.id}`);
        return existingProfile;
      }

      const profile = new Profile();
      profile.auth_id = userData.id;
      profile.email = userData.email;
      profile.first_name = userData.firstName;
      profile.last_name = userData.lastName;
      profile.role = userData.userRole;
      
      const savedProfile = await queryRunner.manager.save(profile);

      for (const skillData of userData.skills) {
        let skill = await queryRunner.manager.findOne(Skill, {
          where: { name: skillData.name }
        });

        if (!skill) {
          skill = new Skill();
          skill.name = skillData.name;
          skill = await queryRunner.manager.save(skill);
        }

        const profileSkill = new ProfileSkill();
        profileSkill.profile = savedProfile;
        profileSkill.skill = skill;
        profileSkill.proficiency_level = skillData.proficiencyLevel;
        await queryRunner.manager.save(profileSkill);
      }

      for (const contactData of userData.contacts) {
        const contact = new Contact();
        contact.profile = savedProfile;
        contact.type = contactData.type;
        contact.value = contactData.value;
        contact.is_primary = contactData.isPrimary;
        await queryRunner.manager.save(contact);
      }

      await queryRunner.commitTransaction();
      console.log(`✅ Created profile for auth_id: ${userData.id}`);
      return savedProfile;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Error handling user created event:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

export const userHandlerService = new UserHandlerService(); 