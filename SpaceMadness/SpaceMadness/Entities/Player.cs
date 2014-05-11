using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SpaceWarz.Entities
{
    public class Player
    {
        public string UserID { get; set; }
        public string ConnectionID { get; set; }
        public int Score { get; set; }
    }
}