using game_emparium.xsockets.server.Models;
using game_emparium.xsockets.server.Interfaces;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;

namespace game_emparium.xsockets.server.Models
{
    public class Rock : ICollideable
    {
        public double x { get; set; }
        public double y { get; set; }
        public double speed { get; set; }
        public double angle { get; set; }
        public double rotationSpeed { get; set; }
        public int index { get; set; }
        public int height { get; set; }
        public int width { get; set; }
        public dynamic center { get; set; }
        public CollideableType.Type type { get; set; }

        public void SetCenterPoint()
        {
            dynamic center = new ExpandoObject();
            center.x = Math.Round(this.x + (this.width / 2));
            center.y = Math.Round(this.y + (this.height / 2));
            this.center = center;
        }
    }
}