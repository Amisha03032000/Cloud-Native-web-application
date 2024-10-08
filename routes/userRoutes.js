import { Router } from 'express';
import * as userController from '../controllers/userController.js'

const router = Router();

router.route("/get") //.get is inbuilt method for get request
    .get(userController.bootstrapController); 

export default router;