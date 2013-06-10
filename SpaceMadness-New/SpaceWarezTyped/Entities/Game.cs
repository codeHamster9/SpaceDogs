using SpaceWarz.Entities;
using SpaceWarz.HubServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SpaceWarezTyped.Entities
{
    public class Game
    {
        public BonusService bs { get; set; }

        public RockService rs { get; set; }

        public List<Player> Players { get; set; }

        public string RoomId { get; set; }

        public Game(string room)
        {
            RoomId = room;
            Players = new List<Player>();
        }

        public void Init()
        {
            bs = new BonusService();
            rs = new RockService();

            bs.bonusTimer.Start();
            rs.rockTimer.Start();
        }
    }
}