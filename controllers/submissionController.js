import { v4 as uuidv4 } from 'uuid';
import * as assignmentService from "../services/assignmentService.js";
import * as submissionService from "../services/submissionService.js";

import { getCredentials } from "../services/auth.js";
import {logger} from "../packer/logger.js";
import StatsD from 'node-statsd';
import exp from 'constants';
import AWS from 'aws-sdk';
import { Submission } from '../models/submissionModel.js';
// import { region } from '@pulumi/aws/config/vars.js';

const client = new StatsD({
  errorHandler: function (error) {
    console.error("StatsD error: ", error);
  }
});
const sns = new AWS.SNS({region: 'us-east-1'});

//const AWS = require('aws-sdk');
const aws_cred = new AWS.SharedIniFileCredentials({ profile: 'dev' });
AWS.config.credentials = aws_cred;
logger.info(AWS.config.credentials);

export const submitAssignment = async(req, res)=>{
    const { id } = req.params;
    const submissionData = req.body;
    const email = getCredentials(req)[0];
    try {
        
        const submission = await submissionService.createSubmission(id, submissionData);
    
        logger.info("Submission created successfully");
         console.log(submissionData);
        // Post the URL to the SNS topic along with user info
        // Post the URL to the SNS topic along with user info
        const snsMessage = {

          Message:JSON.stringify({
              default: 'initializing',
              submissionUrl:submissionData.submission_url,
              userEmail: email,
              assignmentId: submission.assignment_id,

          }),

          TopicArn: process.env.TOPICARN, 
          
        };
        
        console.log('Messageurl:',submissionData.submission_url),
        console.log('snsMessage.')
        try {
          const res= await sns.publish(snsMessage).promise();
          console.log('res', res);

          logger.info("SNS message published successfully");
        } catch (snsError) {
          logger.error(`Error publishing SNS message: ${snsError.message}`);
        }

        if (!submission) {
          logger.info("Got Assignment by ID-404");
          res.status(404).json({ error: "Submission not found" });
        } else {
          logger.info("Got Assignment by ID-200");
          res.status(201).json({ message: "Submission found and Accepted" });
        }
      
        // if(submission.createdBy === getCredentials(req)[0]){ 
        //   client.increment('endpoint.create.hits');
        //   logger.info("Got submission by ID-200");
        //   res.status(200).json(submission);
        // }else{
        //   logger.info("Got submission by ID-403");
        //   res.status(403).send();
        // } 
      } catch (error) {
        logger.info("Got submission by ID-400");
        res.status(400).json({ error: error.message });
      }
     
    };