import React, { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const NavBar = () => {
  const router = useRouter();

  const { data: sessionData, status: sessionStatus } = useSession();

  const [activeLink, setActiveLink] = useState<string>("");

  const [toggleProfileButton, setToggleButton] = useState(false);

  const [toggleGetInvolved, setToggleGetInvolved] = useState(false);

  useEffect(() => {
    // Get the current route pathname
    const currentRoute = router.asPath;

    // Set active link based on the current route
    if (currentRoute === "/homepage") {
      setActiveLink("home");
    } else if (currentRoute === "/homepage/how-it-works") {
      setActiveLink("howItWorks");
    } else if (currentRoute === "/homepage/find-organizations") {
      setActiveLink("findOrganizations");
    } else if (currentRoute === "/homepage/activities") {
      setActiveLink("getInvolved");
    } else {
      setActiveLink("");
    }
  }, [router.asPath]);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    // navbar
    <div className="mt-2 flex flex-col gap-2">
      <nav className="flex  h-12 items-center justify-between px-10 py-3 font-custom-lexend  text-xs text-primary ">
        {/* left navbar */}
        <ul className=" flex flex-grow cursor-pointer ">
          <li className="item-center custom-epilogue flex flex-grow cursor-pointer bg-gradient-to-r from-primary to-secondary bg-clip-text text-sm font-black text-transparent">
            <Link href="/homepage" onClick={() => handleLinkClick("home")}>
              Laguna Youth Organizations Hub
            </Link>
          </li>
        </ul>

        {/* middle */}
        <ul className="flex flex-grow gap-5 ">
          <li
            className={`cursor-pointer ${activeLink === "howItWorks" ? " text-secondary" : "text-primary"}`}
            onClick={() => handleLinkClick("howItWorks")}
          >
            <Link href="/homepage/how-it-works">How it Works</Link>
          </li>
          <li
            className={`cursor-pointer ${activeLink === "findOrganizations" ? " text-secondary" : ""}`}
            onClick={() => handleLinkClick("findOrganizations")}
          >
            <Link href="/homepage/find-organizations">Find Organizations</Link>
          </li>
          <li
            className={`cursor-pointer ${activeLink === "getInvolved" ? " text-secondary" : ""}`}
            onClick={() => setToggleGetInvolved(!toggleGetInvolved)}
          >
            Get Involved
          </li>
        </ul>

        {/* right navbar */}
        <div className="flex items-center">
          {sessionData ? (
            <div className=" flex items-center gap-3">
              <Link href="/">
                <p>{sessionData.user.name}</p>
              </Link>

              <button onClick={() => setToggleButton(!toggleProfileButton)}>
                <Image
                  className={`cursor-pointer rounded-lg `}
                  src={sessionData.user.image ?? ""}
                  alt="user profile image"
                  height={40}
                  width={40}
                />
              </button>
              {toggleProfileButton && (
                <div className=" absolute right-10 top-14 z-50 flex w-48 flex-col items-center justify-center gap-2 rounded-md bg-customBlack-100  p-4 text-sm text-white">
                  <p
                    className="cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/homepage" })}
                  >
                    Profile
                  </p>
                  <p
                    className="cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/homepage" })}
                  >
                    Manage Activities
                  </p>
                  <p
                    className="cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/homepage" })}
                  >
                    Logout
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <button className="btn-active px-10 py-1" onClick={handleSignIn}>
                Get Started
              </button>
              {/* <button className="btn-outline px-10 py-1" onClick={handleSignUp}>
                Sign Up
              </button> */}
            </div>
          )}

          {toggleGetInvolved && (
            <div className=" absolute right-1/3 top-14 z-50 flex w-52 flex-col items-center justify-center gap-2 rounded-md bg-customBlack-100  p-4 text-sm text-white">
              <p
                className="cursor-pointer"
                onClick={() => router.push("/homepage/activities")}
              >
                Activities Section
              </p>
              <p
                className="cursor-pointer"
                onClick={() => router.push("/homepage/activities")}
              >
                Pool of Speakers
              </p>
              <p
                className="cursor-pointer"
                onClick={() => router.push("/homepage/activities")}
              >
                Centers of Participation
              </p>
            </div>
          )}
        </div>
      </nav>
      <hr className="flex  w-full border-t-2 border-customBlack-25" />
    </div>
  );
};

export default NavBar;

function handleSignIn() {
  window.location.href = "/auth/login";
}

function handleSignUp() {
  window.location.href = "/auth/signup";
}
