import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as NaverStrategy } from "passport-naver";
import passport from "passport";
import { prisma } from "./db.config.js";

dotenv.config();

// Google OAuth2 전략
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/oauth2/callback/google",
    scope: ["email", "profile"],
    state: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await googleVerify(profile);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

const googleVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`Google profile does not have an email: ${JSON.stringify(profile)}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user) {
    return { id: user.id, email: user.email, name: user.name };
  }

  const createdUser = await prisma.user.create({
    data: {
      email,
      name: profile.displayName || "Unknown Name",
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });

  return { id: createdUser.id, email: createdUser.email, name: createdUser.name };
};

// Naver OAuth2 전략
export const naverStrategy = new NaverStrategy(
  {
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/naver/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await naverVerify(profile);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

const naverVerify = async (profile) => {
  const email = profile.emails?.[0]?.value;
  if (!email) {
    throw new Error(`Naver profile does not have an email: ${JSON.stringify(profile)}`);
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user) {
    return { id: user.id, email: user.email, name: user.name };
  }

  const createdUser = await prisma.user.create({
    data: {
      email,
      name: profile.displayName || "Unknown Name",
      gender: "추후 수정",
      birth: new Date(1970, 0, 1),
      address: "추후 수정",
      detailAddress: "추후 수정",
      phoneNumber: "추후 수정",
    },
  });

  return { id: createdUser.id, email: createdUser.email, name: createdUser.name };
};

// Passport 초기화
passport.use(googleStrategy);
passport.use(naverStrategy);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

export default passport;
