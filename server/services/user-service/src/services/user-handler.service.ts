import { AppDataSource } from "../db/data-source";
import { Profile } from "../models/Profile";
import { Skill, ProfileSkill } from "../models/Skill";
import { Contact } from "../models/Contact";
import { ProficiencyLevel } from "../enums/ProficiencyLevel";

interface SkillInput {
  name: string;
  proficiencyLevel?: string;
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
  profileImage?: string;
  coverImage?: string;
}

export class UserHandlerService {
  async handleUserCreated(userData: UserCreatedEvent) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingProfile = await queryRunner.manager.findOne(Profile, {
        where: { authId: userData.id },
      });

      if (existingProfile) {
        console.log(`⚠️ Profile already exists for auth_id: ${userData.id}`);
        return existingProfile;
      }

      const profile = new Profile();
      profile.authId = userData.id;
      profile.email = userData.email;
      profile.firstName = userData.firstName;
      profile.lastName = userData.lastName;
      profile.userRole = userData.userRole;
      profile.profileImage = userData.profileImage || "";
      profile.coverImage = userData.coverImage || "";

      console.log('Profile being saved:', profile);

      const savedProfile = await queryRunner.manager.save(profile);

      for (const skillData of userData.skills) {
        let skill = await queryRunner.manager.findOne(Skill, {
          where: { name: skillData.name },
        });

        if (!skill) {
          skill = new Skill();
          skill.name = skillData.name;
          skill = await queryRunner.manager.save(skill);
        }

        const profileSkill = new ProfileSkill();
        profileSkill.profile = savedProfile;
        profileSkill.skill = skill;

        const levelMap: Record<string, ProficiencyLevel> = {
          'beginner': ProficiencyLevel.BEGINNER,
          'intermediate': ProficiencyLevel.INTERMEDIATE,
          'expert': ProficiencyLevel.EXPERT
        };
        
        if (skillData.proficiencyLevel && levelMap[skillData.proficiencyLevel]) {
          profileSkill.proficiencyLevel = levelMap[skillData.proficiencyLevel];
        } else {
          profileSkill.proficiencyLevel = ProficiencyLevel.BEGINNER;
        }

        await queryRunner.manager.save(profileSkill);
      }

      for (const contactData of userData.contacts) {
        const contact = new Contact();
        contact.profile = savedProfile;
        contact.type = contactData.type;
        contact.value = contactData.value;
        contact.isPrimary = contactData.isPrimary;
        await queryRunner.manager.save(contact);
      }

      await queryRunner.commitTransaction();
      console.log(`✅ Created profile for auth_id: ${userData.id}`);
      return savedProfile;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("❌ Error handling user created event:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

export const userHandlerService = new UserHandlerService();
