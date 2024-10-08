import { where } from "sequelize";
import { Assignment } from "../models/assignmentModel.js";
import { getCredentials } from "./auth.js";
import { User } from "../models/userModel.js";
import {logger} from "../packer/logger.js";


//-----------------------------------------------------------
export const getAllAssignments = async (req, res) => {
  const assignments = await Assignment.findAll();
  logger.info("got all assignment logs");
  return assignments;
};

//-----------------------------------------------------------
export const createAssignment = async (assignmentData) => {
  console.log(assignmentData.createdBy);
  const assignment = await Assignment.create(assignmentData); 
  logger.info("Created assignment here logs");
  return assignment;
};

//-----------------------------------------------------------
export const getAssignmentById = async (id) => {
  try {
    logger.info("Got assignment by ID logs");
    return await findAssignment(id);
    
  } catch (error) {
    throw new Error();
  }
};

//-----------------------------------------------------------
export const deleteAssignmentById = async (id, email) => {
  try {

    const assignment = await findAssignment(id);
    
    if (email == assignment.createdBy) {
      await assignment.destroy();

      logger.info("Deleted assignment by ID logs");

      
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error();
  }
};

//-----------------------------------------------------------
export const updateAssignmentById = async (id, assignmentData, email) => {
  try {
    const assignment = await findAssignment(id);
    assignment.name = assignmentData.name;
    assignment.points = assignmentData.points;
    assignment.num_of_attempts = assignmentData.num_of_attempts;
    assignment.deadline = assignmentData.deadline;
    assignment.assignment_updated = new Date().toISOString();

    if (email == assignment.createdBy) {
      
      await assignment.save();

      logger.info("Updated assignment by ID logs");

      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new Error();
  }
};

//-----------------------------------------------------------
export const findAssignment = async (id) => {
  const assignment = await Assignment.findOne({ where: { id } });

  logger.info("Found all assignment logs");

  if (!assignment) {
    throw new Error();
  }
  return assignment;
};
