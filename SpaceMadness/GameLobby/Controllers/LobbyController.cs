using System;
using GameLobby.Models;
using System.Web;
using System.Web.Mvc;
using GameLobby.Utils;

namespace GameLobby.Controllers
{
    public class LobbyController : Controller
    {
        private SessionUtil sessionHelper;
        private GameLobbyModel model;
        private const string modelName = "lobbyModel";

        public LobbyController()
        {
            sessionHelper = new SessionUtil();
            model = (GameLobbyModel)sessionHelper.getData(modelName);
            if (model == null)
            {
                sessionHelper.setData(modelName, new GameLobbyModel());
                model = (GameLobbyModel)sessionHelper.getData(modelName);
            }
        }

        
        public ActionResult Index()
        {
            //var userId = Guid.NewGuid().ToString();
            //sessionHelper.setData("userId", userId);
            return View();
        }

        [HttpPost]
        public ActionResult JoinLobby()
        {

            //model.PlayerJoinLobby((Guid)sessionHelper.getData("userId"));
            model.PlayerJoinLobby((string)sessionHelper.getData("userId"));
            ViewBag.Title = "Welcome To SpaceWarZ Lobby!!!!!!!!!!!!!!";
           
            return View("Lobby", model.GetAllRooms());
        }

        [HttpGet]
        public ActionResult JoinLobby(string roomId, string userId)
        {
            //TODO: remove client from room if it's from back action.
     
            return View("Lobby", model.GetAllRooms());
        }

        public ActionResult JoinRoom(string roomId)
        {
            var userId = (string)sessionHelper.getData("userId");
            model.JoinRoom(roomId, userId);


            //return View("Room",lobby.GetRoombyId(roomId));
            //Response.Cookies.Add(new HttpCookie("SpaceWarZ", String.Format("roomId={0},userId={1}", roomId, userId)));


            return Redirect(String.Format("http://localhost:49573/main.html?roomId={0}", roomId));
        }

        [AllowCrossSiteJson]
        public ActionResult LeaveRoom(string roomId, string score)
        {
           var userId = (string)sessionHelper.getData("userId");
            if (userId != null)
            model.LeaveRoom(roomId, userId);
            return View("Lobby", model.GetAllRooms());
        }

        public ActionResult UpdateRooms()
        {
            
            return PartialView("_Rooms", model.GetAllRooms());
        }

        [HttpPost]
        [AllowCrossSiteJson]
        public void RegisterPlayerName(string userId)
        {
            //var userId = Request.Params[0];
            sessionHelper.setData("userId", userId);
        }
    }
    public class AllowCrossSiteJsonAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            filterContext.RequestContext.HttpContext.Response.AddHeader("Access-Control-Allow-Origin", "*");
            base.OnActionExecuting(filterContext);
        }
    }
}
