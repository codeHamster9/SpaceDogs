using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GameLobby.Models
{
    [Serializable]
    public class Player
    {
        public string UserID { get; set; }

        public int UserRank { get; set; }

        public string state { get; set; }
    }
}