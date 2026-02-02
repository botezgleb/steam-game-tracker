import {
  DataTypes,
  Model,
  Optional
} from "sequelize";
import sequelize from "../db";

interface UserAttributes {
  id: number;
  steamId: string;
  steamName: string;
  avatarUrl: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "avatarUrl"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public steamId!: string;
  public steamName!: string;
  public avatarUrl!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    steamId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    steamName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    avatarUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);
