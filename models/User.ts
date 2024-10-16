import { Model, DataTypes } from 'sequelize';
import sequelize from '../config';
import { IUser } from '../utils/interface';

class User extends Model<IUser > implements IUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
}

User .init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'users',
});


export const mockUser  = {
    username: "user1",
    password: "$2b$10$Q6j1H3u1oDgYJ4XH8D2Oxe1gD4s9hF8h8h5pE8T6H5rQ1eZC1uG2C" // hashed password for "password123"
  };

export default User;