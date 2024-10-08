import { Router } from 'express';
import * as assignmentController from '../controllers/assignmentController.js';
import * as submissionController from '../controllers/submissionController.js';
import { checkToken } from '../services/auth.js';

const router = Router();

router.get('/demo/assignments', checkToken, assignmentController.getAllAssignments);
//router.patch('/v1/demo/assignments/:id', checkToken, assignmentController.handlePatch);
router.patch( '/demo/assignments', assignmentController.handlePatchMethod);

router.patch('/demo/assignments/id', assignmentController.handlePatchMethod);

router.post('/demo/assignments', checkToken, assignmentController.createAssignment);
router.get('/demo/assignments/:id', checkToken, assignmentController.getAssignmentById);
router.delete('/demo/assignments/:id',checkToken,assignmentController.deleteAssignment);
router.put('/demo/assignments/:id', checkToken, assignmentController.updateAssignment);

router.post('/v2/demo/assignments/:id/submission', checkToken, submissionController.submitAssignment);
console.log("got hitted to API in routers");
export default router;
