using Microsoft.AspNet.SignalR;
using SpaceWarz.Entities;
using SpaceWarz.HubServices;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace SpaceWarz
{
    public class SpaceHub : Hub
    {
        public static readonly ConcurrentDictionary<string, List<Player>> players = new ConcurrentDictionary<string, List<Player>>();
        private const string player1Msg = "leaving Room";
        private const string player2Msg = "player2 left the room, BYE BYE...";
        private const string lobbyUrl = "http://localhost:52924/Lobby/leaveRoom?roomId=";

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

            if (roomId != null  && userId !=null)
                JoinGame(userId,roomId);
            return base.OnConnected();
        }

        public void InitRock(int index)
        {
            Rock rock = RockService.getSingleRock(index);
            Clients.All.setRockData(rock);
        }

        public void InitRockArray()
        {
         //   Rock[] data = RockService.InitRockArray();
           // Clients.All.setRockArray(data);
            //Clients.Group("test").setRockArray(data);
        }

        public void PlayerBump()
        {
            Clients.Others.wingmanBump();
        }

        public void PlayerExplode(int rockIndex)
        {
            InitRock(rockIndex);
            Clients.Others.wingManExplode();
        }

        public  void PlayerTakesBonus(int type,int bonusIndex)
        {

            Clients.Others.playerTakeBonus(type, bonusIndex);
        }

        public void MoveShip(int x, int y, string id)
        {
            Clients.Others.shipMoved(x, y, id);
        }

        public void EndGame(string roomId)
        {
            var caller =Context.ConnectionId;
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
                players.TryAdd(roomId, new List<Player>() { new Player { UserID = userId, ConnectionID = Context.ConnectionId, Score = 0 } });
                Clients.Caller.playerWait();
            }
        }
    }
}