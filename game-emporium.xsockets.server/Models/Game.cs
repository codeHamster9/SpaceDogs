using game_emparium.xsockets.server.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace game_emparium.xsockets.server.Models
{
    public class Game
    {
        public ItemGenerator ItemGen { get; set; }

        public RockGenerator RockGen { get; set; }

        public List<Player> Players { get; set; }

        public string RoomId { get; set; }

        public Game(string room)
        {
            RoomId = room;
            Players = new List<Player>();
        }

        public void Init()
        {
            ItemGen = new ItemGenerator();
            RockGen = new RockGenerator();
            ItemGen.Start();
        }
    }
}