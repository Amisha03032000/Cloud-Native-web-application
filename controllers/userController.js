//service is called in controller, but in app.js for bootstrap

import * as userService from '../services/userService.js';

//-----------------------------------------------------------
export const bootstrapController = async (req, res) => {
    try {
  
      const users = await userService.bootstrap();
      res.status(200).json({"message":"Successful"});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
