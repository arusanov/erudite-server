const { Router } = require("express");
const { room, user } = require("../models");
const authMiddleware = require("../auth/middleware");

function factory(stream) {
  const router = new Router();

  router.post("/room", authMiddleware, async (req, res, next) => {
    const currentUser = req.user;
    try {
      const currentRoom = await room.create(req.body);
      const newRoomId = currentRoom.id;
      await currentRoom.setUsers([currentUser]);
      const updatedRoom = await room.findByPk(newRoomId, {
        include: [
          {
            model: user,
            as: "users",
            attributes: ["id", "name"],
          },
        ],
      });
      const action = {
        type: "NEW_ROOM",
        payload: updatedRoom,
      };
      const string = JSON.stringify(action);

      stream.send(string);
      res.send(updatedRoom);
    } catch (error) {
      next(error);
    }
  });

  router.put("/join", authMiddleware, async (req, res, next) => {
    const currentUser = req.user;
    const roomId = req.body.roomId;
    try {
      const currentRoom = await room.findByPk(roomId, {
        include: [
          {
            model: user,
            as: "users",
            attributes: ["id", "name"],
          },
        ],
      });
      const updatedUsers = currentRoom.users.concat([currentUser]);
      if (updatedUsers.length === currentRoom.maxPlayers) {
        await currentRoom.update({
          phase: "ready",
        });
      }
      await currentRoom.setUsers(updatedUsers);
      const updatedRoom = await room.findByPk(roomId, {
        include: [
          {
            model: user,
            as: "users",
            attributes: ["id", "name"],
          },
        ],
      });
      const action = {
        type: "UPDATED_ROOM",
        payload: updatedRoom,
      };
      const string = JSON.stringify(action);
      stream.send(string);
      res.send(string);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
module.exports = factory;
