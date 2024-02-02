import React from "react";
// import { signIn, signOut, useSession } from "next-auth/react";
//
const NavBar = () => {
  return (
    // navbar
    <nav className="flex h-12 items-center  justify-between bg-pink-300 px-10 py-3 font-custom-lexend text-primary">
      {/* left navbar */}
      <ul className="flex flex-grow cursor-pointer gap-5">
        <li className="flex-grow cursor-pointer font-custom-changa-one font-semibold">
          Laguna Youth Organizations Hub
        </li>
      </ul>

      {/* middle */}
      <ul className="flex flex-grow gap-5">
        <li className=" cursor-pointer">How it Works</li>
        <li className=" cursor-pointer">Find Organizations</li>
        <li className=" cursor-pointer">Get Involved</li>
      </ul>

      {/* right navbar */}
      <div className="flex gap-3">
        <button className="btn-active px-10 py-2" onClick={handleSignIn}>
          Login
        </button>
        <button className="btn-outline px-10 py-2" onClick={handleSignUp}>
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default NavBar;

function handleSignIn() {
  window.location.href = "/auth/login";
}

function handleSignUp() {
  window.location.href = "/auth/sign-up";
}
