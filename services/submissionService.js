import { where } from "sequelize";
import { Assignment } from "../models/assignmentModel.js";
import { Submission } from "../models/submissionModel.js";
import {logger} from "../packer/logger.js";

//import { error } from "winston";
//import { log } from "winston";

//-----------------------------------------------------------
export const createSubmission = async (assignid, submissionData) => {
  try{
    const assignment = await Assignment.findOne({ where: { id: assignid } });

    if (!assignment) {
      throw new Error("Assignment Not found");
    }

    if (!submissionData.submission_url) {
      throw new Error("Submission URL is required");
    }

    // To reject the request if user tries to exceed retries
    const maxRetries = assignment.num_of_attempts; 
    const currentRetries = await Submission.count({
      where: { assignment_id: assignid },
    });

    //Check see if current retries are greater than num_of_attempts
    if (currentRetries >= maxRetries) {
      throw new Error("Maximum number of retries exceeded");
    }

    //deadline fixed : submission rejection

    const fixedDeadline = new Date('2023-12-28T05:43:42.789Z');

    assignment.deadline = fixedDeadline;
    await assignment.save();

    const currentDate= new Date();
    if (currentDate > assignment.deadline) {
     throw new Error("Submission Rejected: Deadline passed");
    }

  const newsubmission= await Submission.create({
    assignment_id: assignid,
    submission_url: submissionData.submission_url,
  });


  console.log("newsubmission:",newsubmission)
  logger.info("Created Submission logs");
  
  return {
    id: newsubmission.id,
    assignment_id: newsubmission.assignment_id,
    submission_url: newsubmission.submission_url,
    submission_date: newsubmission.submission_date,
    submission_updated: newsubmission.submission_updated,
  };
}catch(error){
  logger.error('error creating a submission');
  throw new Error(`Error creating submission: ${error.message}`);
}
  
};
