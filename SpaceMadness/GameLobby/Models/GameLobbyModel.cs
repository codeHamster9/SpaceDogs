using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GameLobby.Models
{
   [Serializable]
    public class GameLobbyModel
    {
        const int MaxRooms = 4;
        List<Room> rooms = new List<Room>();
        List<Player> allPlayers = new List<Player>();

        public GameLobbyModel()
        {
            rooms.Add(new Room{ RoomID = "r1" });
            rooms.Add(new Room{ RoomID = "r2" });
        }

        public void JoinRoom(string roomId, string userId)
        {
            var room = rooms.Where(r => r.RoomID.Equals(roomId)).FirstOrDefault();
            if (room != null)
            {
                var player = allPlayers.Where(p => p.UserID.Equals(userId)).FirstOrDefault();
                if (player != null)
                {
                    room.AddPlayer(player);
                }
            }
        }

        public void LeaveRoom(string roomId, string userId)
        {
            var room = rooms.Where(r => r.RoomID.Equals(roomId)).FirstOrDefault();
            if (room != null)
            {
                var player = allPlayers.Where(p => p.UserID.Equals(userId)).FirstOrDefault();
                if (player != null)
                {
                    room.RemovePlayer(player);
                }
            }
        }

        public Room GetRoombyId(string roomId)
        {
              return rooms.Where(r => r.RoomID.Equals(roomId)).FirstOrDefault();
              
        }

        public List<Room> GetAllRooms()
        {
            return rooms;
        }

        public void PlayerJoinLobby(string userId)
        {
            allPlayers.Add(new Player { UserID = userId });
        }
    }
}