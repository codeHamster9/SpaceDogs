using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using game_emparium.xsockets.server.Models;
using game_emparium.xsockets.server.Controllers;

namespace game_emparium.xsockets.server.Interfaces
{
    interface ICollideable
    {
        double x { get; set; }
        double y { get; set; }
        CollideableType.Type type { get; set; }
        void SetCenterPoint();
        dynamic center { get; set; }
   
    }
}
