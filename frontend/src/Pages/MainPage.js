import React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { ImLocation } from "react-icons/im";
import Login from "../components/Login";
import { AiFillStar } from "react-icons/ai";
import axios from "axios";
import { format } from "timeago.js";
import Register from "../components/Register";

export default function MainPage() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [rating, setRating] = useState(null);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 16,
    longitude: 270,
    zoom: 3,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        console.log(res.data);
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  function handleMarkerClick(id, lat, long) {
    setCurrentPlace(id);
    setViewport({
      ...viewport,
      latitude: lat,
      longitude: long,
    });
  }

  function handleDoubleClick(e) {
    console.log(e);

    const [long, lat] = e.lngLat;

    setNewPlace({
      long,
      lat,
    });
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title: title,
      desc: description,
      rating: rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
      console.log(pins);
    } catch (error) {
      console.log(error);
    }
  };

  const openRegister = () => {
    setShowRegister(true);
  };

  const openLogin = () => {
    setShowLogin(true);
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };
  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle={"mapbox://styles/sniasnias/cko4v8ee11fqr17mn2nd8sx4l"}
        onDblClick={handleDoubleClick}
        transitionDuration="100"
      >
        {pins.map((thisPin) => (
          <>
            <Marker
              latitude={thisPin.lat}
              longitude={thisPin.long}
              offsetLeft={-18}
              offsetTop={-20}
              onClick={() =>
                handleMarkerClick(thisPin._id, thisPin.lat, thisPin.long)
              }
            >
              <ImLocation
                size={28}
                className={
                  thisPin.username === currentUser
                    ? "text-yellow-400"
                    : "text-red-400"
                }
                style={{ cursor: "pointer" }}
              />
            </Marker>

            {thisPin._id === currentPlace && (
              <Popup
                latitude={thisPin.lat}
                longitude={thisPin.long}
                closeOnClick={false}
                offsetLeft={30}
                offsetTop={-16}
                anchor="left"
                onClose={() => setCurrentPlace(null)}
              >
                <div className="locationCard h-66 w-48 divide-y-2 divide-yellow-400 space-y-1 mx-3">
                  <div className="location ">
                    <label className="font-bold text-xs text-yellow-400 ">
                      Location
                    </label>
                    <h1 className="font-light text-sm pb-1">{thisPin.title}</h1>
                  </div>
                  <div className="review">
                    <label className="font-bold text-xs text-yellow-400">
                      Description
                    </label>
                    <h1 className="text-sm pb-1 ">{thisPin.desc}</h1>
                  </div>
                  <div className="rating ">
                    <label className="font-bold text-xs text-yellow-400">
                      Rating
                    </label>
                    <div className="rating flex  pb-1 ">
                      {Array(thisPin.rating).fill(
                        <AiFillStar size={16} className="text-blue-300" />
                      )}
                    </div>
                  </div>
                  <div className="information space-y-2">
                    <label className="font-bold text-xs text-yellow-400">
                      Information
                    </label>
                    <p className="text-xs">{format(thisPin.createdAt)}</p>
                    <p className="text-xs">
                      Created by <b>{thisPin.username}</b>
                    </p>
                  </div>
                </div>
              </Popup>
            )}
          </>
        ))}

        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeOnClick={false}
            offsetLeft={10}
            offsetTop={-6}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <div className="form" onSubmit={handleFormSubmit}>
              <form className=" h-60 w-48 space-y-2 mx-3">
                <div className="title border-b-2">
                  <label className="font-bold text-xs text-yellow-400">
                    Title
                  </label>
                  <input
                    placeholder="Enter a title.."
                    onChange={(e) => setTitle(e.target.value)}
                  ></input>
                </div>
                <div className="description border-b-2 ">
                  <label className="font-bold text-xs text-yellow-400">
                    Description
                  </label>
                  <textarea
                    placeholder="Tell us about this place..."
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="rating">
                  <label className="font-bold text-xs text-yellow-400">
                    Give it a rating
                  </label>
                  <br />
                  <select
                    className="text-xs border-b-2 mb-3"
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="1">1</option>
                    <option value="2">3</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <br />
                  <button className="h-8 w-full bg-yellow-400" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button
            className="m-4 h-8 w-20 bg-red-400 rounded-xl font-thin text-sm text-white "
            onClick={handleLogout}
          >
            LOGOUT
          </button>
        ) : (
          <div className="buttons m-4 space-x-3 text-white">
            <button
              className="h-8 w-20 bg-yellow-400 rounded-xl font-thin text-sm"
              onClick={openLogin}
            >
              LOGIN
            </button>
            <button
              className="h-8 w-20 bg-gray-400 rounded-xl font-thin text-sm"
              onClick={openRegister}
            >
              REGISTER
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </div>
  );
}
