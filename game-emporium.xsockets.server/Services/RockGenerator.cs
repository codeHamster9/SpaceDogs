using game_emparium.xsockets.server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace game_emparium.xsockets.server.Services
{
    public class RockGenerator
    {
        Random RandomEngine = new Random();
        int RockMaxX = 650;
        int numOfRocks = 5;
        int RockMinX = 150;
        int SpeedMax = 3;
        int RockSpeedFactor = 2;
        int SpeedPadding = 1;

        public Rock[] InitRockArray()
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
                    height = RandomEngine.Next(3, 7) * 10,
                    width = RandomEngine.Next(3, 7) * 10,
                    type = (CollideableType.Type)4

                };
                rockArray[i].SetCenterPoint();
            }
            return rockArray;
        }

        public Rock getSingleRock(int index)
        {
            Rock rock = new Rock()
            {
                x = Math.Round(RandomEngine.NextDouble() * RockMaxX) + RockMinX,
                y = 0,
                speed = Math.Round(RandomEngine.NextDouble() * (SpeedMax * RockSpeedFactor)) + SpeedPadding,
                angle = Math.Floor(RandomEngine.NextDouble() * 180) + 1,
                rotationSpeed = Math.Floor(RandomEngine.NextDouble() * 4) + 1,
                index = index,
                type = (CollideableType.Type)4,
                height = RandomEngine.Next(4, 8) * 10,
                width = RandomEngine.Next(4, 8) * 10
            };

            rock.SetCenterPoint();
            return rock;
        }
    }
}