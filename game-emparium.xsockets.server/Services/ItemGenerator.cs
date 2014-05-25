using game_emparium.xsockets.server.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Timers;
using System.Web;

namespace game_emparium.xsockets.server.Services
{

    public class OnDataReadyArgs : EventArgs
    {
        public OnDataReadyArgs(BonusItem[] data)
        {
            this.Data = data;
        }

        public BonusItem[] Data { get; set; }
    }

    public class ItemGenerator
    {

        public event EventHandler<OnDataReadyArgs> OnDataReady;
        private Random RandomEngine = new Random();
        private readonly System.Timers.Timer itemTimer = new System.Timers.Timer();

        public ItemGenerator()
        {
            itemTimer.Interval = Math.Floor(RandomEngine.NextDouble() * 30000) + 3000;
            itemTimer.Elapsed += new ElapsedEventHandler(TimeElapsed);
            itemTimer.Enabled = false;
        }
        public void GenerateItems()
        {
            BonusItem[] data = new BonusItem[RandomEngine.Next(1, 4)];

            for (int i = 0; i < data.Length; i++)
            {
                data[i] = new BonusItem()
                {
                    x = Math.Round(RandomEngine.NextDouble() * 700) + 100,
                    y = Math.Round(RandomEngine.NextDouble() * 400) + 50,
                    timeout = Math.Round(RandomEngine.NextDouble() * 300) + 150,
                    type = (CollideableType.Type)RandomEngine.Next(0, 4),
                    value = 1000,
                    duration = (7 * 60),
                    width = 30,
                    height = 30              
                };
#if DEBUG
                Debug.Write(String.Format("[{1}]: type : {0}\t", data[i].type, i));
#endif
            }
            this.OnDataReady(new Object(), new OnDataReadyArgs(data));
        }
        private void TimeElapsed(object sender, ElapsedEventArgs e)
        {
            GenerateItems();
            itemTimer.Interval = Math.Floor(RandomEngine.NextDouble() * 30000) + 3000;
#if DEBUG
            Debug.WriteLine("Interval :" + itemTimer.Interval);
#endif
        }
        internal void Start()
        {
            this.itemTimer.Start();
        }
    }
}