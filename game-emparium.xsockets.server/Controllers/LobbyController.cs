using game_emparium.xsockets.server.Models;
using System.Diagnostics;
using XSockets.Core.Common.Socket.Event.Arguments;
using XSockets.Core.Common.Socket.Event.Attributes;
using XSockets.Core.XSocket;
using XSockets.Core.XSocket.Helpers;

namespace game_emparium.xsockets.server.Controllers
{
    public class LobbyController : XSocketController
    {
        [NoEvent]
        public string GameId { get; set; }

        public LobbyController()
        {
            this.OnOpen +=LobbyController_OnOpen;
        }
        void LobbyController_OnOpen(object sender, OnClientConnectArgs e)
        {
#if DEBUG
            Debug.WriteLine(e.Controller.ClientGuid);
#endif
            this.GameId = e.Controller.GetParameter("gameId");
        }

        public void SetReady(Player player) {

            this.SendToAllExceptMe<LobbyController>(player.rdy, "readySet");
        }
    }
}
