import { Repository } from 'typeorm';
import { User } from '../models/User.entity';
import { AppDataSource } from '../db/data-source';
import * as bcrypt from 'bcryptjs';

class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } });
    }

    async create(email: string, password: string, firstName?: string, lastName?: string): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = this.repository.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        return this.repository.save(user);
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password);
    }
}

export const userRepository = new UserRepository(); 