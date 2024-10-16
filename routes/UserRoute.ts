import express, { Router, Request, Response } from 'express';
import UserController from '../Controller/UserController';
import multer from 'multer';

const router = Router();
const upload = multer(); 
const userController = new UserController();

router.post('/register', async (req: Request, res: Response) => {
  try {
    await userController.register(req, res);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post('/login',async (req: Request, res: Response) => {
    try {
      await userController.loginUser(req, res);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } );
  router.post('/importchat', upload.single('file'), async(req: Request, res: Response) => {
    try {
      await userController.importChatHistory(req.body, res);
    } catch (error) {
      res.status(400).json({ message: error });
    }
  } );


export default router;