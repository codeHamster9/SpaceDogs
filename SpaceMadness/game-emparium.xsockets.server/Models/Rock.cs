using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace game_emparium.xsockets.server.Models
{
    public class Rock
    {
        public double x { get; set; }
        public double y { get; set; }
        public double speed { get; set; }
        public double angle { get; set; }
        public double rotationSpeed { get; set; }
        public int index { get; set; }
        public int height { get; set; }
        public int width { get; set; }
    }
}