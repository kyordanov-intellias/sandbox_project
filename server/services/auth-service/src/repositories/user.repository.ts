import { Repository } from "typeorm";
import { User } from "../models/User.entity";
import { AppDataSource } from "../db/data-source";
import * as bcrypt from "bcryptjs";

class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findById(userId: number): Promise<User | null> {
    return this.repository.findOne({ where: { id: userId } });
  }

  async create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    userRole: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.repository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userRole,
    });

    return this.repository.save(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  validateRequestBody(body: { [key: string]: any }, requiredFields: string[]) {
    for (const field of requiredFields) {
      if (
        !body[field] ||
        typeof body[field] !== "string" ||
        body[field].trim() === ""
      ) {
        return { error: `${field} is required and cannot be empty` };
      }
    }
    return null;
  }
}

export const userRepository = new UserRepository();
