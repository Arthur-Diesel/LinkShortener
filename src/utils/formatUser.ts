import { User } from "@prisma/client";

export function formatUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
