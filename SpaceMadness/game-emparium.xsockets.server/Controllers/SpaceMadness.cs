using game_emparium.xsockets.server.Models;
using game_emparium.xsockets.server.Services;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using XSockets.Core.Common.Socket.Event.Interface;
using XSockets.Core.XSocket;
using XSockets.Core.XSocket.Helpers;

namespace game_emparium.xsockets.server.Controllers
{
    public class SpaceMadness : XSocketController
    {

        public static readonly ConcurrentDictionary<string, List<Player>> players = new ConcurrentDictionary<string, List<Player>>();
        private const string player1Msg = "leaving Room";
        private const string player2Msg = "player2 left the room, BYE BYE...";
        private const string lobbyUrl = "http://localhost:49950/Lobby/leaveRoom?roomId=";
        public void InitRock(int index)
        {
            Rock rock = RockService.getSingleRock(index);
            this.SendToAll(rock, "setRockData");
        }

        public void InitRockArray()
        {
            //   Rock[] data = RockService.InitRockArray();
            // Clients.All.setRockArray(data);
            //Clients.Group("test").setRockArray(data);
        }

        public void PlayerBump()
        {
            this.SendToAllExceptMe(null, "wingmanBump");
        }

        public void PlayerExplode(int rockIndex)
        {
            InitRock(rockIndex);
            this.SendToAllExceptMe(null, "wingManExplode");
        }

        //public void PlayerTakesBonus(int type, int bonusIndex)
        public void PlayerTakesBonus(ITextArgs textargs)
        {
            this.SendToAllExceptMe(textargs, "wingManExplode");
        }

        public void MoveShip(ITextArgs textArgs)
        {
            //Clients.Others.shipMoved(x, y, id);
            this.SendToAllExceptMe(textArgs, "shipMoved");
        }

        public void EndGame(string roomId)
        {
            var caller = Context.ConnectionId;
            List<Player> groupClients;
            //get the group
            if (players.TryGetValue(roomId, out groupClients))
            {
                //find the caller
                var player = groupClients.Where(p => p.ConnectionID.Equals(caller)).FirstOrDefault();
                if (player != null)
                {
                    //notify game ended and redirect
                    var player1 = groupClients[0].ConnectionID;
                    var player2 = groupClients[1].ConnectionID;
                    players.TryRemove(roomId, out groupClients);
                    Clients.Client(player1).redirectToLobby(lobbyUrl + roomId, player1Msg);
                    Clients.Client(player2).redirectToLobby(lobbyUrl + roomId, player2Msg);
                }
            }
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
                
                groupClients.Add(new Player { UserID = userId, ConnectionID = Context.ConnectionId, Score = 0 });
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
                    Clients.Caller.playerWait();
                }
            }
            else
            {
                players.TryAdd(roomId, new List<Player>() { new Player { UserID = userId, ConnectionID = Context.ConnectionId, Score = 0 } });
                Clients.Caller.playerWait();
                this.
            }
        }
    }
}
