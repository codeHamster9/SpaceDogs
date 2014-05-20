using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace game_emparium.xsockets.server.Models
{
    public static class CollideableType
    {
        public enum Type
        {
            Points = 0,
            Shield = 1,
            Shrink = 2,
            Drunk = 3,
            Rock = 4
        }   
    }
}