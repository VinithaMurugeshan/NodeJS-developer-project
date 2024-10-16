import { Request, Response } from 'express';
import User from '../models/User';
import validate from '../utils/Validate';
import { IUserController,IUser } from '../utils/interface';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/token';
import Chat from '../models/Chat';
import * as XLSX from 'xlsx';



class CustomError extends Error {
    constructor(public statusCode: number, public message: string) {
      super(message);
    }
  }

class UserController implements IUserController {

  public async register(req: Request, res: Response){
    try {
      const { name, email, password }: IUser = req.body;
      const user = await User.findOne({ where: { email } });
      if (user) {
        throw new Error('Email already exists');
      }

      const validatedPassword = validate.password(password);
      if (!validatedPassword) {
        throw new Error('Invalid password');
      }

      const newUser = await User.create({ name, email, password });
      res.status(201).json(newUser);
    } catch (error: unknown) {
        if (error instanceof CustomError) {
          console.error(error);
          res.status(error.statusCode).send({ error: error.message });
        } else {
          console.error(error);
          res.status(500).send({ error: 'Internal Server Error' });
        }
      }
  }
  public async loginUser  (req: Request, res: Response){
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const message = generateToken(user.id);
        return res.status(200).json({ message });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
  };

  public async importChatHistory(req: Request, res: Response) {
    const file = req.file; // Assuming you are using middleware for file uploads

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const chatData: any[] = XLSX.utils.sheet_to_json(worksheet);
    const errors: string[] = [];
    const validChatEntries: any[] = [];

    for (const entry of chatData) {
        const { userId, message, timestamp } = entry;

        if (!userId) {
            errors.push('User ID is missing in one or more entries.');
            continue; 
        }
        if (!message) {
            errors.push('Message is missing in one or more entries.');
            continue; 
        }
        if (!timestamp || isNaN(new Date(timestamp).getTime())) {
            errors.push('Timestamp is invalid in one or more entries.');
            continue;
        }

        const userExists = await User.findOne({ where: { id: userId } });
        if (!userExists) {
            errors.push(`User ID ${userId} does not exist.`);
            continue; 
        }
        validChatEntries.push({
            userId,
            message,
            timestamp: new Date(timestamp), 
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation errors occurred.', errors });
    }

    try {
        await Chat.bulkCreate(validChatEntries);
        res.status(200).json({ message: 'Chat history imported successfully.', importedEntries: validChatEntries.length });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Failed to import chat history.', error: 'Internal Server error' });
    }
  }

}

export default UserController;