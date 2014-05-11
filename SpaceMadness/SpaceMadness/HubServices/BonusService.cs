using Microsoft.AspNet.SignalR;
using SpaceWarz.Entities;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Timers;
using System.Web;

namespace SpaceWarz.HubServices
{
    public  class BonusService
    {
        //TODO: give access to players Dictionary
        private Random RandomEngine = new Random();
        public readonly System.Timers.Timer bonusTimer = new System.Timers.Timer();

        public BonusService()
        {
            bonusTimer.Interval = Math.Floor(RandomEngine.NextDouble() * 30000) + 3000;
            bonusTimer.Elapsed += new ElapsedEventHandler(TimeElapsed);
            //Thread.Sleep(5000);
            bonusTimer.Enabled = false;
        }

        public void InitBonusData()
        {
            //TODO: broadcast to specific Group
            BonusItem[] data = new BonusItem[RandomEngine.Next(1, 4)];

            for (int i = 0; i < data.Length; i++)
            {
                data[i] = new BonusItem()
                {
                    x = Math.Round(RandomEngine.NextDouble() * 700) + 100,
                    y = Math.Round(RandomEngine.NextDouble() * 400) + 50,
                    timeout = Math.Round(RandomEngine.NextDouble() * 300) + 150,
                    name = (BonusItem.bonusType)RandomEngine.Next(0, 3),
                    value = 1000,
                    effectDuration = (7 * 60)
                };
                Debug.WriteLine("Type :" + data[i].name + "Duration :" + data[i].effectDuration);
            }
            GlobalHost.ConnectionManager.GetHubContext<SpaceHub>().Clients.All.setBonusData(data);
        }

        private void TimeElapsed(object sender, ElapsedEventArgs e)
        {
            InitBonusData();
            bonusTimer.Interval = Math.Floor(RandomEngine.NextDouble() * 30000) + 3000;
            Debug.WriteLine("Interval :" + bonusTimer.Interval);
        }

    }
}