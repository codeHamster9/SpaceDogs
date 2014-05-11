using Microsoft.AspNet.SignalR;
using SpaceWarezTyped.Entities;
using SpaceWarz.Entities;
using SpaceWarz.HubServices;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Timers;
using System.Web;

namespace SpaceWarz
{
    public class SpaceHub : Hub
    {
        public static readonly ConcurrentDictionary<string, Game> games = new ConcurrentDictionary<string, Game>();
        private const string player1Msg = "leaving Room";
        private const string player2Msg = "player2 left the room, BYE BYE...";
        private const string lobbyUrl = "http://localhost:49950/Lobby/leaveRoom?roomId";

        public override System.Threading.Tasks.Task OnDisconnected()
        {
            //List<Player> groupClients;
            //var roomId = Context.QueryString["roomId"];
            //var userId = Context.QueryString["userId"];
            //players.TryRemove(roomId, out groupClients);
            return base.OnDisconnected();
        }

        public override System.Threading.Tasks.Task OnReconnected()
        {
            return base.OnReconnected();
        }

        public override System.Threading.Tasks.Task OnConnected()
        {
            var roomId = Context.QueryString["roomId"];
            var userId = Context.QueryString["userId"];

            //var req = new HttpRequest("", "", "userId=" + userId);

           // WebRequest req = HttpWebRequest.Create("http://localhost:49950/Lobby/RegisterPlayerName"+"?userId=" + userId);

            if (roomId != null && userId != null)
                JoinGame(userId, roomId);
            return base.OnConnected();
        }

        public void InitRock(int index, string roomId)
        {
            Game game;
            if (games.TryGetValue(roomId, out game))
            {
                Rock rock = game.rs.getSingleRock(index);
                Clients.All.setRockData(rock);
            }
        }

        public void InitRockArray(string roomId)
        {
            Game game;
            if (games.TryGetValue(roomId, out game))
            {
                Rock[] data = game.rs.InitRockArray();
                Clients.All.setRockArray(data);
            }
        }

        public void PlayerBump(bool hitter)
        {
            Clients.Others.wingmanBump(hitter);
        }

        public void PlayerExplode(int rockIndex, string roomId)
        {
            InitRock(rockIndex,roomId);
            Clients.Others.wingManExplode();
        }

        public void PlayerTakesBonus(int name, int bonusIndex)
        {
            Clients.Others.wingmanTakeBonus(name, bonusIndex);
        }

        public void ShipMove(int x, int y, string id)
        {
            Clients.Others.wingManMove(x, y, id);
        }

        public void EndGame(string roomId,int score)
        {
            var caller = Context.ConnectionId;
            Game game;
            //get the game
            if (games.TryGetValue(roomId, out game))
            {
                //find the caller
                var player = game.Players.Where(p => p.ConnectionID.Equals(caller)).FirstOrDefault();
                if (player != null)
                {
                   // var i = game.Players.IndexOf(player);
                    //game.Players[i].Score = score; 
                    //notify game ended and redirect
                    var player1 = game.Players[0].ConnectionID;
                    var player2 = game.Players[1].ConnectionID;
                    games.TryRemove(roomId, out game);
                    Clients.Client(player1).redirectToLobby(lobbyUrl + roomId, player1Msg);
                    Clients.Client(player2).redirectToLobby(lobbyUrl + roomId, player2Msg);
                }
            }
        }

        public void JoinGame(string userId, string roomId)
        {
            Game game;
            if (games.TryGetValue(roomId, out game))
            {
                //just for Debug 
                if (game.Players.Count > 1)
                    game.Players.Clear();
                //debug

                game.Players.Add(new Player { UserID = userId, ConnectionID = Context.ConnectionId, Score = 0 });

                if (game.Players.Count == 2)
                {
                    game.Init();
                    var player1 = game.Players[0].ConnectionID;
                    var player2 = game.Players[1].ConnectionID;
                    Clients.Client(player1).startGame(1);
                    Clients.Client(player2).startGame(2);
                }
                else
                {
                    Clients.Caller.playerWait();
                }
            }
            else
            {
                games.TryAdd(roomId, new Game(roomId));

                games[roomId].Players.Add(new Player
                {
                    UserID = userId,
                    ConnectionID = Context.ConnectionId,
                    Score = 0
                });
                Clients.Caller.playerWait();
            }
        }
    }
}