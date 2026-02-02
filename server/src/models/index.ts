import sequelize from "../db";
import { User } from "./User";
import { Game } from "./Game";
import { UserGame } from "./UserGame";

User.belongsToMany(Game, {
  through: UserGame,
  foreignKey: "userId",
  as: "games",
});

Game.belongsToMany(User, {
  through: UserGame,
  foreignKey: "gameId",
  as: "users",
});

UserGame.belongsTo(User, { foreignKey: "userId", as: "user" });
UserGame.belongsTo(Game, { foreignKey: "gameId", as: "game" });

User.hasMany(UserGame, { foreignKey: "userId", as: "userGames" });
Game.hasMany(UserGame, { foreignKey: "gameId", as: "userGames" });

export {
  User,
  Game,
  UserGame,
  sequelize
};
