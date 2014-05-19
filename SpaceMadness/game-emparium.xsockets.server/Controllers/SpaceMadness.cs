using game_emparium.xsockets.server.Models;
using game_emparium.xsockets.server.Services;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Dynamic;
using System.Timers;
using XSockets.Core.Common.Socket.Event.Arguments;
using XSockets.Core.Common.Socket.Event.Interface;
using XSockets.Core.XSocket;
using XSockets.Core.XSocket.Helpers;

namespace game_emparium.xsockets.server.Controllers
{

    public class Person
    {
        public int Age { get; set; }
        public string Name { get; set; }
    }
    public class SpaceMadness : XSocketController
    {

        public static readonly ConcurrentDictionary<string, List<Player>> players = new ConcurrentDictionary<string, List<Player>>();
        private const string player1Msg = "leaving Room";
        private const string player2Msg = "player2 left the room, BYE BYE...";
        private const string lobbyUrl = "http://localhost:49950/Lobby/leaveRoom?roomId=";
        readonly System.Timers.Timer bonusTimer;
        Random RandomEngine;


        public SpaceMadness()
        {
            RandomEngine = new Random();
            bonusTimer = new System.Timers.Timer();
            this.OnOpen += SpaceMadness_OnOpen;
            bonusTimer.Interval = Math.Floor(RandomEngine.NextDouble() * 120000) + 3000;
            bonusTimer.Elapsed += new ElapsedEventHandler(TimeElapsed);
            bonusTimer.Enabled = true;

        }

        void SpaceMadness_OnOpen(object sender, OnClientConnectArgs e)
        {
            this.SendToAll("1", "startGame");
        }


        public void JoinGame(string userId, string roomId)
        {
            List<Player> groupClients;
            if (players.TryGetValue(roomId, out groupClients))
            {
                //just for Debug 
                if (groupClients.Count > 1)
                    groupClients.Clear();
                //debug

                //groupClients.Add(new Player { UserID = userId, ConnectionID = Context.ConnectionId, Score = 0 });
                players.TryAdd(roomId, groupClients);
                if (players[roomId].Count == 2)
                {
                    //BonusService.bonusTimer.Start();
                    var player1 = groupClients[0].ConnectionID;
                    var player2 = groupClients[1].ConnectionID;
                    //Clients.Client(player1).startGame(1);
                    //Clients.Client(player2).startGame(2);
                    this.SendToAll(null, "startGame");

                }
                else
                {
                    //Clients.Caller.playerWait();
                }
            }
            else
            {
                //players.TryAdd(roomId, new List<Player>() { new Player { UserID = userId, ConnectionID = Context.ConnectionId, Score = 0 } });
                this.SendToAll("", "startGame");

            }
        }
        public void EndGame(string roomId)
        {
            //var caller = Context.ConnectionId;
            List<Player> groupClients;
            //get the group
            if (players.TryGetValue(roomId, out groupClients))
            {
                //find the caller
                //var player;// groupClients.Where(p => p.ConnectionID.Equals(caller)).FirstOrDefault();
                if (players != null)
                {
                    //notify game ended and redirect
                    var player1 = groupClients[0].ConnectionID;
                    var player2 = groupClients[1].ConnectionID;
                    //players.TryRemove(roomId, out groupClients);
                    //Clients.Client(player1).redirectToLobby(lobbyUrl + roomId, player1Msg);
                    //Clients.Client(player2).redirectToLobby(lobbyUrl + roomId, player2Msg);
                }
            }
        }
        public void InitRockArray(ITextArgs textArgs)
        {
            Rock[] data = RockService.InitRockArray();
            this.SendToAll(data, "setRockArray");
        }
        public void GetNewRock(int index)
        {
            Rock rock = RockService.getSingleRock(index);
            this.SendToAll(rock, "addNewRock");
#if DEBUG
            Debug.Write(DateTime.Now.ToString("hh:mm:ss:fff") + " " + "rock Generated" + " " + "index : " + index + "\n");  
#endif
        }
        public void MoveShip(int x, int y, int id)
        {
            this.SendToAllExceptMe(new Point(x, y), "shipMoved");
        }
        public void PlayerBump()
        {
            this.SendToAll("", "wingmanBump");
        }
        public void PlayerExplode(int index)
        {
            GetNewRock(index);
            this.SendToAllExceptMe(null, "wingManExplode");
        }
        public void PlayerTakesBonus(int type, int index)
        {
            dynamic data = new ExpandoObject();
            data.type = type;
            data.bonusIndex = index;
            this.SendToAllExceptMe((Object)data, "wingmanTakesBonus");
        }

        void TimeElapsed(object sender, ElapsedEventArgs e)
        {
            var data = BonusService.InitBonusData();
            this.SendToAll(data, "setBonusData");
            bonusTimer.Interval = Math.Floor(RandomEngine.NextDouble() * 120000) + 3000;
        }

    }

    public struct Point
    {
        public Point(int _x, int _y)
            : this()
        {
            this.X = _x;
            this.Y = _y;
        }
        public double X { get; set; }
        public double Y { get; set; }
    }
}
