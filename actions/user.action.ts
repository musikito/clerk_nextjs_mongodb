/**
 * Creates a new user in the database.
 *
 * @param user - The user object to create.
 * @returns The created user object.
 */
"use server";

import User from "@/models/user.model";
import { connect } from "@/db";

export async function createUser(user: any) {
  try {
    await connect();
    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);
  }
}
