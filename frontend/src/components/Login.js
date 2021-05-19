import React, { useState, useRef } from "react";
import { ImAirplane } from "react-icons/im";
import axios from "axios";
import { AiFillCloseSquare } from "react-icons/ai";

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [success, setSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const userNameRef = useRef();

  const passwordRef = useRef();

  const handleRegister = async (e) => {
    e.preventDefault();

    const user = {
      username: userNameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      console.log(res);
      setLoginError(false);
      setSuccess(true);
    } catch (error) {
      setLoginError(true);
      setSuccess(false);
    }
  };

  return (
    <div className="h-72 w-72 bg-gray-400 flex flex-col justify-center rounded-lg shadow-2xl absolute top-0 right-0 bottom-0 left-0 m-auto">
      <div
        className="closeButton absolute top-2 right-2 text-red-400"
        style={{ cursor: "pointer" }}
      >
        <AiFillCloseSquare size={22} onClick={() => setShowLogin(false)} />
      </div>
      <div className="logo flex justify-center mb-6">
        <ImAirplane className="text-yellow-400" size={25} />
      </div>
      <form
        className="flex flex-col items-center space-y-4"
        onSubmit={handleRegister}
      >
        <input
          className="w-2/3 text-center"
          placeholder="Username"
          type="text"
          ref={userNameRef}
        ></input>

        <input
          className="w-2/3 text-center"
          placeholder="Password"
          type="password"
          ref={passwordRef}
        ></input>
        <br />
        <button
          className=" h-8 w-4/5 bg-yellow-400 text-white rounded-lg "
          type="submit"
        >
          Login
        </button>

        {loginError && (
          <p className="text-red-500 text-xxs">
            Theres been an error! try again
          </p>
        )}
      </form>
    </div>
  );
}
