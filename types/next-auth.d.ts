import NextAuth from "next-auth";
import { type Organization, type Volunteer } from "@prisma/client";


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      organization: Organization
      volunteer: Volunteer
      [key: string]: string;
    };
  }
}