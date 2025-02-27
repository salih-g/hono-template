import { Prisma, User } from '@prisma/client';
import { prisma } from '../index';
import { logger } from '../utils/logger';

export const userRepository = {
  async findAll(options?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip = 0, take = 10, where, orderBy } = options || {};

    try {
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          skip,
          take,
          where,
          orderBy,
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        data: users,
        metadata: {
          total,
          page: Math.floor(skip / take) + 1,
          pageCount: Math.ceil(total / take),
        },
      };
    } catch (error) {
      logger.error('Error fetching users:', { error });
      throw error;
    }
  },

  async findById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      logger.error(`Error retrieving user (ID: ${id}):`, { error });
      throw error;
    }
  },

  async findByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      logger.error(`Error retrieving user (Email: ${email}):`, { error });
      throw error;
    }
  },

  async create(data: Prisma.UserCreateInput): Promise<User> {
    try {
      return await prisma.user.create({
        data,
      });
    } catch (error) {
      logger.error('Error creating user:', { error });
      throw error;
    }
  },

  async update(id: string, data: Prisma.UserUpdateInput) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      logger.error(`Error updating user (ID: ${id}):`, { error });
      throw error;
    }
  },

  async delete(id: string) {
    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      logger.error(`Error deleting user (ID: ${id}):`, { error });
      throw error;
    }
  },
};

export default userRepository;
