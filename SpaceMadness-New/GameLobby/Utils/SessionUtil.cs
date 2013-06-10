using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GameLobby.Utils
{
    public class SessionUtil
    {
        public System.Web.SessionState.HttpSessionState currentSession { get; set; }

        public SessionUtil()
        {
            currentSession = HttpContext.Current.Session;
        }

        public object getData(string modelName)
        {

            return currentSession[modelName];
        }

        public void setData(string modelName, object model)
        {
            currentSession.Add(modelName,model);
        }
    }
}