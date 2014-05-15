using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace game_emparium.xsockets.server.Models
{
    public class BonusItem
    {
        public double x { get; set; }
        public double y { get; set; }
        public double timeout { get; set; }
        public bonusType type { get; set; }
        public double value { get; set; }
        public double effectDuration { get; set; }

        public enum bonusType
        {
            Points = 0,
            Shield = 1,
            Shrink = 2,
            Drunk = 3
        }
    }
}