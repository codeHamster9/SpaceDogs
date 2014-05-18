using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace game_emparium.xsockets.server.Models
{
    public class BonusData : IEnumerator, IEnumerable
    {
        public BonusItem[] bonusim;
        private int position;
        public string bonusFactor { get; set; }
        public BonusData(int bonusCount)
        {
            bonusim = new BonusItem[bonusCount];
        }

        public IEnumerator GetEnumerator()
        {
            return (IEnumerator)this;
        }

        //IEnumerator
        public bool MoveNext()
        {
            position++;
            return (position < bonusim.Length);
        }

        //IEnumerable
        public void Reset()
        { position = 0; }

        //IEnumerable
        public object Current
        {
            get { return bonusim[position]; }
        }
    }
}