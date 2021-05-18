import React from "react";
import { ImAirplane } from "react-icons/im";

export default function Register() {
  return (
    <div className="h-72 w-72 bg-gray-400 flex flex-col justify-center rounded-lg shadow-2xl absolute top-0 right-0 bottom-0 left-0 m-auto">
      <div className="logo flex justify-center mb-6">
        <ImAirplane className="text-yellow-400" size={25} />
      </div>
      <form className="flex flex-col items-center space-y-4">
        <input
          className="w-2/3 text-center"
          placeholder="Username"
          type="text"
        ></input>
        <input
          className="w-2/3 text-center"
          placeholder="Email"
          type="email"
        ></input>
        <input
          className="w-2/3 text-center"
          placeholder="Password"
          type="password"
        ></input>
        <br />
        <button className=" h-8 w-4/5 bg-yellow-400 text-white rounded-lg ">
          Register
        </button>
      </form>
    </div>
  );
}
