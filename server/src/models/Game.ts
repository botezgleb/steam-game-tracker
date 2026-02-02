import {
  DataTypes,
  Model,
  Optional
} from "sequelize";
import sequelize from "../db";

interface GameAttributes {
  id: number;
  steamAppId: number;
  title: string;
  iconUrl: string | null;
  headerImageUrl: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface GameCreationAttributes
  extends Optional<GameAttributes, "id" | "iconUrl" | "headerImageUrl"> {}

export class Game
  extends Model<GameAttributes, GameCreationAttributes>
  implements GameAttributes
{
  public id!: number;
  public steamAppId!: number;
  public title!: string;
  public iconUrl!: string | null;
  public headerImageUrl!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Game.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    steamAppId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    iconUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    headerImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "games",
  }
);
