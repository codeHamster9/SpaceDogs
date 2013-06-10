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
    public class RockService
    {
        Random RandomEngine = new Random();
        int RockMaxX = 650;
        int RockMinX = 150;
        int initRockAmount = 5;
        int SpeedMax = 3;
        int RockSpeedFactor = 2;
        int SpeedPadding = 1;
        public readonly System.Timers.Timer rockTimer = new System.Timers.Timer();


        public RockService()
        {
            rockTimer.Interval = Math.Floor(RandomEngine.NextDouble() * 30000) + 3000;
            rockTimer.Elapsed += new ElapsedEventHandler(TimeElapsed);
            rockTimer.Enabled = false;
        }

        public Rock[] InitRockArray()
        {
            Rock[] rockArray = new Rock[initRockAmount];

            for (int i = 0; i < rockArray.Length; i++)
            {
                var rockSize = RandomEngine.Next(4, 8) * 10;
                rockArray[i] = new Rock()
                {
                    x = Math.Round(RandomEngine.NextDouble() * RockMaxX) + RockMinX,
                    y = 1,
                     speed = Math.Round(RandomEngine.NextDouble() * (SpeedMax * RockSpeedFactor)) + SpeedPadding,
                    //speed = 1,
                    angle = Math.Floor(RandomEngine.NextDouble() * 180) + 1,
                    rotationSpeed = Math.Floor(RandomEngine.NextDouble() * 10) + 1,
                    index = i,
                    height = rockSize,
                    width = rockSize
                };
            }
            return rockArray;
        }

        public Rock getSingleRock(int index)
        {
            var rockSize = RandomEngine.Next(4, 8) * 10;
            Rock rock = new Rock()
            {
                x = Math.Round(RandomEngine.NextDouble() * RockMaxX) + RockMinX,
                y = 1,
                speed = Math.Round(RandomEngine.NextDouble() * (SpeedMax * RockSpeedFactor)) + SpeedPadding,
                //speed = 1,
                angle = Math.Floor(RandomEngine.NextDouble() * 180) + 1,
                rotationSpeed = Math.Floor(RandomEngine.NextDouble() * 4) + 1,
                index = index,
                height = rockSize,
                width = rockSize
            };
            return rock;

        }

        public void AddRock()
        {

            var rockSize = RandomEngine.Next(4, 8) * 10;
            Rock rock = new Rock()
            {
                x = Math.Round(RandomEngine.NextDouble() * RockMaxX) + RockMinX,
                y = 1,
                speed = Math.Round(RandomEngine.NextDouble() * (SpeedMax * RockSpeedFactor)) + SpeedPadding,
                angle = Math.Floor(RandomEngine.NextDouble() * 180) + 1,
                rotationSpeed = Math.Floor(RandomEngine.NextDouble() * 4) + 1,
                height = rockSize,
                width = rockSize
            };
            Debug.WriteLine("Rock Added");
            GlobalHost.ConnectionManager.GetHubContext<SpaceHub>().Clients.All.addRock(rock);
        }

        private void TimeElapsed(object sender, ElapsedEventArgs e)
        {
            AddRock();
            rockTimer.Interval = Math.Floor(RandomEngine.NextDouble() * 30000) + 3000;
        }
    }
}