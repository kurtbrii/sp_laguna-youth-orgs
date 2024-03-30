import { signIn } from "next-auth/react";
import google from "public/images/google.png";
import discord from "public/images/discord.png";
import guest from "public/images/guest.png";

import React from "react";
import Image from "next/image";

const Providers = () => {
  const providers = ["google", "discord"];

  return (
    <>
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
      </div>
      <p className="mx-24 text-center text-sm text-customBlack-100">
        Sign in or register your account using your{" "}
        <span className="font-bold text-primary">Google</span> or{" "}
        <span className="font-bold text-secondary">Discord</span> account.
      </p>
    </>
  );
};

export default Providers;

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.toLocaleLowerCase().substring(1);
}

function handleHomePage() {
  window.location.href = "/homepage";
}
