using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GameLobby.Models
{
    [Serializable]
    public class Room
    {
        public string RoomID { get; set; }

        public int MaxNumPlayersInRoom { get; set; }

        public int NumPlayersInRomm { get; set; }

        public List<Player> players = new List<Player>();

        public Room()
        {
            MaxNumPlayersInRoom = 2;
            NumPlayersInRomm = 0;
        }

        public Room(int maxNumPlayer)
        {
            MaxNumPlayersInRoom = maxNumPlayer;
            NumPlayersInRomm = 0;
        }

        public void AddPlayer(Player p)
        {
            players.Add(p);
            NumPlayersInRomm = players.Count();
        }

        public void RemovePlayer(Player p)
        {
            players.Remove(p);
            NumPlayersInRomm = players.Count();
        }
    }
}