import { v4 as uuidv4 } from 'uuid';
import * as assignmentService from "../services/assignmentService.js";
import { getCredentials } from "../services/auth.js";
import {logger} from "../packer/logger.js";
import StatsD from 'node-statsd';

const client = new StatsD({
  errorHandler: function (error) {
    console.error("StatsD error: ", error);
  }
});

//-----------------------------------------------------------
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await assignmentService.getAllAssignments();

    logger.info("Got all Assignments!!");
    client.increment('endpoint.getall.hits');
    if (Object.keys(req.body).length !== 0) {
      return res.status(400).json();
    }

      
    res.status(200).json(assignments);
  } catch (error) {
    if (error.message === "Forbidden") {
      logger.info("Got all assignments- 403");
      
      res.status(403).json();
    } else {
      logger.info("Got all assignments -400");
      res.status(400).json();
    }
  }
};
//-----------
export const handlePatch = async( req, res) =>{
  try {
    logger.info("Handled patch-405");
    res.status(405).json({ message: "PATCH request received and processed successfully" });
  } catch (error) {
    logger.info("Handled patch-500");
    res.status(500).json({ error: error.message });
  }
}


export const handlePatchMethod = async (req, res) => {
  if (req.method === 'PATCH') {
    logger.info("Handled patch-405");
    return res.status(405).json({ error: "Method Not Allowed" });

  }
};  



//-----------------------------------------------------------
export const createAssignment = async (req, res) => {
  const assignmentData = {id: uuidv4().toString(), ...req.body};

  try {
    assignmentData.createdBy = getCredentials(req)[0];
    const assignment = await assignmentService.createAssignment(assignmentData);
    logger.info("Created Assignment-201");
    client.increment('endpoint.create.hits');
    res.status(201).json(assignment);
  } catch (error) {
    logger.info("Created Assignment-400");
    res.status(400).json({ error: error.message });
  }
};

//-----------------------------------------------------------
export const getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.params);
    const assignment = await assignmentService.getAssignmentById(id);
    if (Object.keys(req.body).length !== 0) {
      return res.status(400).json();
    }
    /* if (!assignment) {
      res.status(404).json();
      return;
    }

    res.status(200).json();
  } catch (error) {
    res.status(400).json();
  } */
  if (!assignment) {
    logger.info("Got Assignment by ID-404");
    res.status(404).json({ error: "Assignment not found" });
    return;
  }

  if(assignment.createdBy === getCredentials(req)[0]){ 
    client.increment('endpoint.create.hits');
    logger.info("Got Assignment by ID-200");
    res.status(200).json(assignment);
  }else{
    logger.info("Got Assignment by ID-403");
    res.status(403).send();
  }
} catch (error) {
  logger.info("Got Assignment by ID-400");
  res.status(400).json({ error: error.message });
}
};

//-----------------------------------------------------------
export const deleteAssignment = async (req, res) => {
  const { id } = req.params;
  if (Object.keys(req.body).length !== 0) {
    return res.status(400).json();
  }
  const email = getCredentials(req)[0];
  try {
    if (await assignmentService.deleteAssignmentById(id, email)) {

      logger.info("Deleted Assigment-204");
      client.increment('endpoint.delete.hits');

      res.status(204).send();
    } else {
      logger.info("Deleted Assigment-403");
      res.status(403).send();
    }
    
  } catch (error) {
    logger.info("Deleted Assigment-404");
    res.status(404).json({ error: error.message });
  }
};

//-----------------------------------------------------------
export const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const assignmentData = req.body;
  const email = getCredentials(req)[0];

  try {
    if (
      await assignmentService.updateAssignmentById(id, assignmentData, email)
    ) {
      logger.info("Updated Assigment-204");
      client.increment('endpoint.update.hits');
      res.status(204).send();
    } else {
      logger.info("Updated Assigment-403");
      res.status(403).send();
    }
  } catch (error) {
    logger.info("Updated Assigment-400");
    res.status(400).json();
  }
};
