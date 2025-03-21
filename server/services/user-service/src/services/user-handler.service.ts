import { profileRepository } from '../repositories/profile.repository';

interface UserCreatedEvent {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userRole: string;
}

export class UserHandlerService {
  async handleUserCreated(userData: UserCreatedEvent) {
    try {
      const existingProfile = await profileRepository.findByAuthId(userData.id);
      if (existingProfile) {
        console.log(`⚠️ Profile already exists for auth_id: ${userData.id}`);
        return;
      }

      const profile = await profileRepository.create({
        auth_id: userData.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.userRole
      });

      console.log(`✅ Created profile for auth_id: ${userData.id}`);
      return profile;

    } catch (error) {
      console.error('❌ Error handling user created event:', error);
      throw error;
    }
  }
}

export const userHandlerService = new UserHandlerService(); 