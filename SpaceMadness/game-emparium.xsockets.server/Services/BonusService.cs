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

        public static BonusData InitBonusData()
        {
            //TODO: broadcast to specific Group
            BonusData data = new BonusData(RandomEngine.Next(1, 4));

            for (int i = 0; i < data.bonusim.Length; i++)
            {
                data.bonusim[i] = new BonusItem()
                {
                    x = Math.Round(RandomEngine.NextDouble() * 700) + 100,
                    y = Math.Round(RandomEngine.NextDouble() * 400) + 50,
                    timeout = Math.Round(RandomEngine.NextDouble() * 300) + 150,
                    type = (BonusItem.bonusType)RandomEngine.Next(0, 4),
                    value = 1000,
                    effectDuration = (7 * 60)

                };

                
            }
            //data.bonusFactor = String.Format("ServerTime : {1} , Interval : {0} , ", bonusTimer.Interval / 1000, DateTime.Now.ToLongTimeString());
            //GlobalHost.ConnectionManager.GetHubContext<SpaceHub>().Clients.All.setBonusData(data);
         
            foreach (var bonus in data.bonusim)
            {
                Debug.Write("type :" + " " + bonus.type + " " + "duration : " + " " + bonus.effectDuration + " ");
            }
            Debug.WriteLine(DateTime.Now);
            return data;
        }


    }
}