import { NotFoundException } from '@nestjs/common';
import { PrismaClient, users } from '@prisma/client';

// Helper Methods
export const userEmailExists = async (
  prisma: PrismaClient,
  email: string,
): Promise<boolean> => {
  const user = await prisma.users.findUnique({
    where: { email },
    select: { id: true },
  });

  return !!user;
};

export const userIdExists = async (
  prisma: PrismaClient,
  userId: number,
): Promise<boolean> => {
  const user = await prisma.users.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException(`User with ID ${userId} not found`);
  }

  return !!user;
};

export const findUserById = async (
  prisma: PrismaClient,
  userId: number,
): Promise<users> => {
  const user = await prisma.users.findUnique({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException(`User with ID ${userId} not found`);
  }

  return user;
};

export const findUserByEmail = async (
  prisma: PrismaClient,
  email: string,
): Promise<users> => {
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) {
    throw new NotFoundException(`User with email ${email} not found`);
  }

  return user;
};
