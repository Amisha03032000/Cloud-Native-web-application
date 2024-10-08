import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { parseCSV } from "../scripts/userScripts.js";
import { Assignment } from "../models/assignmentModel.js";
import { where } from "sequelize";
import { Submission } from "../models/submissionModel.js";

//-----------------------------------------------------------
export const bootstrap = async () => {
  await User.sync();
  await Assignment.sync();
  await Submission.sync();
  try {
    parseCSV(async (data) => {
      for (const row of data) {
        try {
          const existingUser = await User.findOne({
            where: { email: row.email },
          });

          if (!existingUser) {
            const hashedPassword = await bcrypt.hash(row.password, 10);
            await User.create({
              first_name: row.first_name,
              last_name: row.last_name,
              email: row.email,
              password: hashedPassword,
            });
            console.log(`User created for email: ${row.email}`);
          } else {
            console.log(`User with email ${row.email} already exists`);
          }
        } catch (error) {
          console.error(`Error creating user for email ${row.email}:`, error);
        }
      }
    });
  } catch (err) {
    throw new Error(err.message);
  }
};

//-----------------------------------------------------------
export const findUserbyUsername = async (username) => {
  const email = username;
  let user = await User.findOne({ where: { email } });
  console.log(user);
  return user;
};
