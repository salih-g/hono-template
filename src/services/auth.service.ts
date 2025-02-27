import { HTTPException } from 'hono/http-exception';
import { hash, compare } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { LoginInput, RegisterInput } from '../validators/auth.validator';
import { userRepository } from '../repositories/user.repository';
import { logger } from '../utils/logger';

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      logger.warn(`Registration error: The email address ${input.email} is already in use`);
      throw new HTTPException(400, { message: 'This email address is already in use' });
    }

    const hashedPassword = await hash(input.password);

    const user = await userRepository.create({
      email: input.email,
      password: hashedPassword,
      name: input.name,
    });

    logger.info(`User created: ${user.id}`);

    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      logger.warn(`Login error: ${input.email} not found`);
      throw new HTTPException(401, { message: 'Invalid email or password' });
    }

    const isPasswordValid = await compare(input.password, user.password);

    if (!isPasswordValid) {
      logger.warn(`Login error: Invalid password for ${input.email}`);
      throw new HTTPException(401, { message: 'Invalid email or password' });
    }

    logger.info(`User logged in: ${user.id}`);

    const token = generateToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  },
};

export default authService;
