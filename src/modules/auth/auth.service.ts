import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../lib/prisma";
import config from "../../config";
import { AppError } from "../../utils/AppError";

const registerUser = async (payload: any) => {
  const { name, email, password, role, phone, profileImage } = payload;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError(400, "User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, Number(config.bcryptSaltRounds));

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      profileImage
    }
  });

  const { password: _password, ...userWithoutPassword } = user;

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken
  };
};

const loginUser = async (payload: any) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  if (user.status === "BANNED") {
    throw new AppError(403, "User is banned");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  return {
    accessToken,
    refreshToken
  };
};

const refreshToken = async (token: string) => {
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.refreshSecret) as any;
  } catch (err) {
    throw new AppError(401, "Invalid refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    throw new AppError(401, "User not found");
  }

  if (user.status === "BANNED") {
    throw new AppError(403, "User is banned");
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );

  return {
    accessToken
  };
};

const getMe = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new AppError(404, "User not found");
  
  const { password, ...userProfile } = user;
  return userProfile;
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
  getMe,
};
