import {
  DataTypes,
  Model,
  Optional
} from "sequelize";
import sequelize from "../db";
import { GameStatus } from "./enums";

interface UserGameAttributes {
  id: number;
  userId: number;
  gameId: number;
  status: GameStatus;
  playtimeMinutes: number;
  lastPlayedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserGameCreationAttributes
  extends Optional<
    UserGameAttributes,
    "id" | "status" | "playtimeMinutes" | "lastPlayedAt"
  > {}

export class UserGame
  extends Model<UserGameAttributes, UserGameCreationAttributes>
  implements UserGameAttributes
{
  public id!: number;
  public userId!: number;
  public gameId!: number;
  public status!: GameStatus;
  public playtimeMinutes!: number;
  public lastPlayedAt!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserGame.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(GameStatus)),
      allowNull: false,
      defaultValue: GameStatus.PLANNED,
    },

    playtimeMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    lastPlayedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "user_games",
    indexes: [
      {
        unique: true,
        fields: ["userId", "gameId"],
      },
    ],
  }
);
