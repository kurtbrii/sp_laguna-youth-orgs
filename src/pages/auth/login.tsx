import React from "react";
import vol2 from "../../../assets/vol2.png";
import Image from "next/image";
// import Providers from "~/components/Providers";
import { signIn } from "next-auth/react";
import google from "../../assets/google.png";
import discord from "../../assets/discord.png";
import guest from "../../assets/guest.png";

const login = () => {
  const providers = ["google", "discord"];

  return (
    <section className="flex h-screen font-custom-lexend ">
      {/* <!-- Left part with image --> */}
      <section className="relative w-3/5 flex-shrink-0 bg-customBlack-100">
        {/* Your image goes here */}
        <Image
          className="h-full w-full object-cover opacity-35"
          src={vol2}
          alt="Volunteer Image"
        />
        {/* Centered div */}
        <div className=" absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-center text-white">
          <h1 className="font-custom-changa-one mb-3 text-4xl">
            Laguna Youth Organizations Hub
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
            eget placerat nulla. Duis eget lacinia lacus. Duis volutpat metus a
            felis volutpat elementum. Integer hendrerit sit
          </p>
        </div>
      </section>

      {/* <!-- Right part with login page --> */}
      <section className="flex w-2/5 flex-shrink-0 flex-col items-center justify-center gap-7 p-8">
        <h1 className="font-custom-changa-one mb-3 bg-gradient-to-r  from-primary to-secondary bg-clip-text text-4xl  font-extrabold text-transparent">
          Welcome Back!
        </h1>

        {/* providers */}
        {/* <Providers /> */}
        <div className="flex flex-col  justify-center gap-3 ">
          {providers.map((provider, index) => (
            <button
              type="button"
              onClick={() => signIn(provider, { callbackUrl: "/homepage" })}
              key={index}
              className="btn-outline border-1 flex items-center gap-3 rounded-md border px-10 py-1"
            >
              <Image
                className="h-10 w-10 object-cover"
                src={provider == "google" ? google : discord}
                width={20}
                height={20}
                alt={`${provider} Image`}
              />
              {/* <img
            src={`https://example.com/${provider.toLowerCase()}-logo.png`}
            alt={`${provider} Logo`}
            className="mb-2 h-16 w-16"
          /> */}
              <p className="text-md font-semibold">
                Sign In With {capitalize(provider)}
              </p>
              {/* Add other content specific to each provider */}
            </button>
          ))}
          <button
            type="button"
            onClick={handleHomePage}
            className="btn-outline border-1 mb-3 flex items-center gap-3 rounded-md border px-10 py-1"
          >
            <Image
              className="h-10 w-10 object-cover"
              src={guest}
              width={30}
              height={30}
              alt="Guest Image"
            />
            <p className="text-md font-semibold">Continue as Guest</p>
          </button>
          <p className="text-center text-sm text-customBlack-100">
            Don&apos;t have an account yet?{" "}
            <span
              onClick={handleSignUp}
              className="text-gradient cursor-pointer underline-offset-4 "
            >
              Sign Up
            </span>
            .
          </p>
        </div>
        {/* <div>
          <h1 className="mb-3  text-4xl">Welcome Back!</h1>
          <h1 className="mb-3  text-4xl">Welcome Back!</h1>
        </div> */}
      </section>
    </section>
  );
};

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.toLocaleLowerCase().substring(1);
}

function handleSignUp() {
  window.location.href = "/auth/signup";
}

function handleHomePage() {
  window.location.href = "/homepage";
}

export default login;
