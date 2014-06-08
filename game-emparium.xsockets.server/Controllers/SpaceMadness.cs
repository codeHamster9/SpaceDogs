using game_emparium.xsockets.server.Services;
using game_emparium.xsockets.server.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Dynamic;
using XSockets.Core.Common.Socket.Event.Arguments;
using XSockets.Core.Common.Socket.Event.Attributes;
using XSockets.Core.XSocket;
using XSockets.Core.XSocket.Helpers;

namespace game_emparium.xsockets.server.Controllers
{
    public class SpaceMadness : XSocketController
    {
        static List<Player> connectedPlayers = new List<Player>();
        static readonly ConcurrentDictionary<string, Game> games = new ConcurrentDictionary<string, Game>();

        [NoEvent]
        public string GameId { get; set; }
        void ItemGen_OnDataReady(object sender, OnDataReadyArgs e)
        {
            this.SendToAll(e.Data, "setItemsData");
        }
        void SpaceMadness_OnClose(object sender, OnClientDisconnectArgs e)
        {
            Game game;
            games.TryRemove(GameId, out game);
            this.SendTo(p => p.GameId == GameId, null, "endGame");

        }
        void SpaceMadness_OnOpen(object sender, OnClientConnectArgs e)
        {
#if DEBUG
            Debug.WriteLine(e.Controller.ClientGuid);
#endif
            this.GameId = e.Controller.GetParameter("gameId");
        }
        public SpaceMadness()
        {
            this.OnOpen += SpaceMadness_OnOpen;
            this.OnClose += SpaceMadness_OnClose;
        }
        private void CreateGame()
        {
            Game game = new Game(GameId);
            game.Players.Add(new Player() { ConnectionID = this.ClientGuid, SquadId = GameId });
            games.TryAdd(GameId, game);
        }
        public void JoinGame()
        {
            Player squadLeader = null;
            Player wingman = null;
            Game game;

            if (games.TryGetValue(GameId, out game))
            {
                wingman = new Player() { ConnectionID = this.ClientGuid, SquadId = GameId };
                squadLeader = game.Players[0];
                game.Players.Add(wingman);

                if (game.Players.Count == 2)
                {
                    this.SendTo<SpaceMadness>(p => p.ClientGuid == squadLeader.ConnectionID, null, "getReady");
                    this.Send(null, "getReady");
                }
            }
            else
            {
                CreateGame();
                this.Send(null, "playerWait");
            }
        }
        public void GameOn()
        {
            Game game;
            if (games.TryGetValue(GameId, out game))
            {
                game.Init();
                game.ItemGen.OnDataReady += this.ItemGen_OnDataReady;
                Rock[] rockArray = game.RockGen.InitRockArray();
                this.SendTo<SpaceMadness>(p => p.ClientGuid == game.Players[0].ConnectionID, rockArray, "startGame");
                this.SendTo<SpaceMadness>(p => p.ClientGuid == game.Players[1].ConnectionID, rockArray, "startGame");
                //this.Send(rockArray, "startGame");
            }
        }
        public void GetNewRock(int index)
        {
            Game game;
            if (games.TryGetValue(GameId, out game))
            {
                Rock rock = game.RockGen.getSingleRock(index);
                this.SendToAll(rock, "setNewRock");
            }

#if DEBUG
            Debug.Write(DateTime.Now.ToString("hh:mm:ss:fff") + " " + "rock Generated" + " " + "index : " + index + "\n");
#endif
        }
        public void MoveShip(int x, int y)
        {
            dynamic data = new ExpandoObject();
            data.x = x;
            data.y = y;
            this.SendToAllExceptMe((Object)data, "shipMoved");
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
            this.SendToAllExceptMe((Object)data, "wingmanTakesItem");
        }
    }
}
