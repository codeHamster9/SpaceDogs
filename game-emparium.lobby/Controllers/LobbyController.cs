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
            var userId = Guid.NewGuid().ToString();
            sessionHelper.setData("userId", userId);
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
            Response.Cookies.Add(new HttpCookie("SpaceWarZ", String.Format("roomId={0},userId={1}", roomId, userId)));
            return Redirect(String.Format("http://localhost:52924/main.html?roomId={0}&userId={1}", roomId, userId));
        }

        public ActionResult LeaveRoom(string roomId, string userId)
        {
            userId = (string)sessionHelper.getData("userId");
            model.LeaveRoom(roomId, userId);
            return View("Lobby", model.GetAllRooms());
        }

        public ActionResult UpdateRooms()
        {
            
            return PartialView("_Rooms", model.GetAllRooms());
        }
    }
}
