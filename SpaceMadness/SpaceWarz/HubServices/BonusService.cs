using Microsoft.AspNet.SignalR;
using SpaceWarz.Entities;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Timers;
using System.Web;

namespace SpaceWarz.HubServices
{
    public static class BonusService
    {
        //TODO: give access to players Dictionary
        static Random RandomEngine = new Random();
        public static readonly System.Timers.Timer bonusTimer = new System.Timers.Timer();


        static BonusService()
        {
            bonusTimer.Interval = Math.Floor(RandomEngine.NextDouble() * 30000) + 3000;
            bonusTimer.Elapsed += new ElapsedEventHandler(TimeElapsed);
            bonusTimer.Enabled = true;
        }

        static void InitBonusData()
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

                Debug.WriteLine("Type :" + data.bonusim[i].type + "Duration :" + data.bonusim[i].effectDuration);
            }
            data.bonusFactor = String.Format("ServerTime : {1} , Interval : {0} , ", bonusTimer.Interval / 1000, DateTime.Now.ToLongTimeString());
            GlobalHost.ConnectionManager.GetHubContext<SpaceHub>().Clients.All.setBonusData(data);
        }

        static void TimeElapsed(object sender, ElapsedEventArgs e)
        {
            InitBonusData();
            bonusTimer.Interval = Math.Floor(RandomEngine.NextDouble() * 30000) + 3000;
        }
    }
}