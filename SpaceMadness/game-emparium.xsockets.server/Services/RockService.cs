using game_emparium.xsockets.server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace game_emparium.xsockets.server.Services
{
    public static class RockService
    {
        static Random RandomEngine = new Random();
        static int RockMaxX = 650;
        static int numOfRocks = 5;
        static int RockMinX = 150;
        static int SpeedMax = 3;
        static int RockSpeedFactor = 2;
        static int SpeedPadding = 1;
   

        public static Rock[] InitRockArray()
        {
            Rock[] rockArray = new Rock[numOfRocks];

            for (int i = 0; i < rockArray.Length; i++)
            {
                rockArray[i] = new Rock()
                {
                    x = Math.Round(RandomEngine.NextDouble() * RockMaxX) + RockMinX,
                    y = 0,
                    speed = Math.Round(RandomEngine.NextDouble() * (SpeedMax * RockSpeedFactor)) + SpeedPadding,
                    angle = Math.Floor(RandomEngine.NextDouble() * 180) + 1,
                    rotationSpeed = Math.Floor(RandomEngine.NextDouble() * 4) + 1,
                    index = i,
                    height = RandomEngine.Next(3,7) * 10,
                    width = RandomEngine.Next(3,7) * 10
                };
            }
            return rockArray;
        }

        public static Rock getSingleRock(int index)
        {
            Rock rock = new Rock()
            {
                x = Math.Round(RandomEngine.NextDouble() * RockMaxX) + RockMinX,
                y = 0,
                speed = Math.Round(RandomEngine.NextDouble() * (SpeedMax * RockSpeedFactor)) + SpeedPadding,
                angle = Math.Floor(RandomEngine.NextDouble() * 180) + 1,
                rotationSpeed = Math.Floor(RandomEngine.NextDouble() * 4) + 1,
                index = index,
                height = RandomEngine.Next(4, 8) * 10,
                width = RandomEngine.Next(4, 8) * 10
            };
            return rock;
        }
    }
}