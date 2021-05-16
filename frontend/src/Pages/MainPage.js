import React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { ImLocation } from "react-icons/im";
import { AiFillStar } from "react-icons/ai";
import axios from "axios";
import { format } from "timeago.js";

export default function MainPage() {
  const currentUser = "struas";
  const [pins, setPins] = useState([]);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

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

  function handleMarkerClick(id) {
    setCurrentPlace(id);
  }

  function handleDoubleClick(e) {
    console.log(e);
    const [long, lat] = e.lngLat;

    setNewPlace({
      long,
      lat,
    });
  }

  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle={"mapbox://styles/sniasnias/cko4v8ee11fqr17mn2nd8sx4l"}
        onDblClick={handleDoubleClick}
      >
        {pins.map((thisPin) => (
          <>
            <Marker
              latitude={thisPin.lat}
              longitude={thisPin.long}
              offsetLeft={-10}
              offsetTop={-40}
              onClick={() => handleMarkerClick(thisPin._id)}
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
                closeOnClick={true}
                offsetLeft={10}
                offsetTop={-6}
                anchor="left"
                onClose={() => handleMarkerClick(null)}
              >
                <div className="locationCard h-56 w-48 divide-y-2 divide-yellow-300 space-y-1 mx-3">
                  <div className="location ">
                    <label className="font-bold text-xs text-yellow-400 ">
                      Location
                    </label>
                    <h1 className="font-light text-sm pb-1">{thisPin.title}</h1>
                  </div>
                  <div className="review">
                    <label className="font-bold text-xs text-yellow-400">
                      Review
                    </label>
                    <h1 className="text-sm pb-1 ">{thisPin.desc}</h1>
                  </div>
                  <div className="rating ">
                    <label className="font-bold text-xs text-yellow-400">
                      Rating
                    </label>
                    <div className="rating flex  pb-1 ">
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
                      <AiFillStar />
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
            closeOnClick={true}
            offsetLeft={10}
            offsetTop={-6}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            Hello
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}
