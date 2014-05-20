using System.Web;
using XSockets.Core.Common.Socket;

[assembly: PreApplicationStartMethod(typeof(game_emparium.xsockets.server.XSocketsWebBootstrapper), "Start")]

namespace game_emparium.xsockets.server
{
    public static class XSocketsWebBootstrapper
    {
        private static IXSocketServerContainer wss;
        public static void Start()
        {
            wss = XSockets.Plugin.Framework.Composable.GetExport<IXSocketServerContainer>();
            wss.StartServers();
        }
    }
}
