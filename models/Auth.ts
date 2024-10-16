import { Model, DataTypes } from 'sequelize';
import sequelize from '../config';
import { User as UserInterface } from '../utils/interface';

class User extends Model implements UserInterface {
    public id!: number;
    public email!: string;
    public password!: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'users',
});

export default User;
