using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace game_emparium.xsockets.server.Models
{
    public class Player : IEquatable<Player>
    {
        public Guid ConnectionID { get; set; }
        public int Score { get; set; }
        public string SquadId { get; set; }

        public bool Equals(Player other)
        {
            if (other == null) return false;
            return (this.ConnectionID.Equals(other.ConnectionID));
        }
    }
}