using game_emparium.xsockets.server.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Timers;
using System.Web;

namespace game_emparium.xsockets.server.Services
{
    public static class BonusService
    {
        //TODO: give access to players Dictionary
        static Random RandomEngine = new Random();


        static BonusService()
        {

        }

        public static BonusItem[] InitBonusData()
        {
            //TODO: broadcast to specific Group
            BonusItem[] data = new BonusItem[3];

#if DEBUG
            Debug.Write(DateTime.Now.ToString("hh:mm:ss:fff") + " ");
#endif
            for (int i = 0; i < RandomEngine.Next(1, 4); i++)
            {
                data[i] = new BonusItem()
                {
                    x = Math.Round(RandomEngine.NextDouble() * 700) + 100,
                    y = Math.Round(RandomEngine.NextDouble() * 400) + 50,
                    timeout = Math.Round(RandomEngine.NextDouble() * 300) + 150,
                    type = (CollideableType.Type)RandomEngine.Next(0, 4),
                    value = 1000,
                    duration = (7 * 60)

                };
#if DEBUG
                Debug.Write(String.Format("[{1}]: type : {0}\t", data[i].type,i));
#endif
            }
            Debug.Write("\n");
            return data;
        }
    }
}