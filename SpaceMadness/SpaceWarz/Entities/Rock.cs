using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SpaceWarz.Entities
{
    public class Rock
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double Speed { get; set; }
        public double Angle { get; set; }
        public double RotationSpeed { get; set; }
        public int Index { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
    }
}