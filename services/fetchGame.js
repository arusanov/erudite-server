const { User, Game } = require("../models");
/**
 * Returns game object from db
 */
module.exports = async (gameId) => {
  return Game.findByPk(gameId, {
    include: [
      {
        model: User,
        as: "users",
        attributes: ["id", "name"],
      },
    ],
  });
  // TODO: send game without letters and letters via socket
  // return Game.findByPk(gameId, {
  //   attributes: [
  //     "id",
  //     "language",
  //     "phase",
  //     "maxPlayers",
  //     "archived",
  //     "validated",
  //     "turnOrder",
  //     "turn",
  //     "activeUserId",
  //     "score",
  //     "turns",
  //     "result",
  //     "board",
  //     "previousBoard",
  //     "putLetters",
  //     "previousLetters",
  //     "lettersChanged",
  //     "wordsForValidation",
  //   ],
  //   include: [
  //     {
  //       model: User,
  //       as: "users",
  //       attributes: ["id", "name"],
  //     },
  //   ],
  // });
};
