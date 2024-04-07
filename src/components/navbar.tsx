import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import CloseIcon from "@mui/icons-material/Close";
import { api } from "~/utils/api";

const Navbar = () => {
  const router = useRouter();

  const { data: sessionData, status: sessionStatus } = useSession();

  const organization = api.organization.getOne.useQuery({
    userId: sessionData?.user.id,
  });

  const volunteer = api.volunteer.getOne.useQuery({
    userId: sessionData?.user.id,
  });

  const [activeLink, setActiveLink] = useState<string>("");

  const [toggleProfileButton, setToggleButton] = useState(false);

  const [toggleGetInvolved, setToggleGetInvolved] = useState(false);

  const [isNavOpen, setIsNavOpen] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const handleChange = () => {
    setExpanded(!expanded);
  };

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
    } else if (
      currentRoute === "/homepage/activities" ||
      currentRoute === "/homepage/speakers" ||
      currentRoute === "/homepage/centers-of-participation"
    ) {
      setActiveLink("getInvolved");
    } else if (
      currentRoute === "/profile/organization" ||
      currentRoute === "/profile/volunteer"
    ) {
      setActiveLink("profile");
    } else {
      setActiveLink("");
    }
  }, [router.asPath]);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    // navbar
    <>
      {/* MOBILE VIEW */}
      <div className="tablet:hidden laptop:hidden desktop:hidden">
        <div className=" z-10 m-4 flex items-center justify-between">
          <div className="font-custom-pilogue flex text-xs font-bold">
            <p className="text-gradient">Laguna Youth Organizations Hub</p>
          </div>
          {sessionData ? (
            <IconButton onClick={() => setIsNavOpen(!isNavOpen)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <div className="flex gap-2">
              <button
                className="btn-active px-3 py-1 text-xs"
                onClick={handleSignIn}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
        {isNavOpen && (
          <>
            <aside className="absolute right-0 top-0 z-10 flex w-full flex-col overflow-y-auto border-r bg-white px-4 py-8 rtl:border-l rtl:border-r-0 dark:border-gray-700 dark:bg-customBlack-100">
              <IconButton
                style={{ color: "white " }}
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="self-end"
              >
                <CloseIcon />
              </IconButton>
              <Image
                className={`cursor-pointer self-center rounded-lg `}
                src={sessionData?.user.image ?? ""}
                alt="user profile image"
                height={80}
                width={80}
              />

              <div className="mx-2 mt-6 flex flex-col items-center">
                {/* <img className="object-cover w-24 h-24 mx-2 rounded-full" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" alt="avatar"> */}
                <h4 className="mx-2 font-medium text-gray-800 dark:text-gray-200">
                  {sessionData?.user.role === "VOLUNTEER"
                    ? `${volunteer.data?.firstName} ${volunteer.data?.middleInitial} ${volunteer.data?.lastName} ${volunteer.data?.suffix}`
                    : organization.data?.orgName}
                </h4>
                <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {sessionData?.user.email}
                </p>
              </div>

              <div className="mt-6 flex flex-1 flex-col justify-between">
                <nav>
                  <Link
                    href={
                      sessionData?.user.role === "VOLUNTEER"
                        ? "/profile/volunteer"
                        : "/profile/organization"
                    }
                    className="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <PersonIcon />

                    <span className="mx-4 font-medium">Profile</span>
                  </Link>

                  <a
                    onClick={() =>
                      sessionData?.user.role === "VOLUNTEER"
                        ? router.push(
                            "/manage-activities/volunteer/org-requests",
                          )
                        : router.push(
                            "/manage-activities/organization/volunteer-requests",
                          )
                    }
                    className="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <ManageAccountsIcon />

                    <span className="mx-4 font-medium">Manage Activities</span>
                  </a>

                  <Link
                    href="/homepage/find-organizations"
                    className="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <CorporateFareIcon />

                    <span className="mx-4 font-medium">Find Organizations</span>
                  </Link>

                  {/* <Link
                    href="/homepage/find-organizations"
                    className="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <Diversity3Icon />

                    <span className="mx-4 font-medium">Get Involved</span>
                  </Link> */}

                  <div className="relative flex flex-col ">
                    {/* Main Link/Button */}
                    <button
                      onClick={handleChange}
                      className="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                    >
                      <Diversity3Icon />
                      <span className="mx-4 font-medium">Get Involved</span>
                    </button>

                    {/* Dropdown Content */}
                    {expanded && (
                      <div className=" z-10 mt-2 w-full border bg-white shadow-xl">
                        <Link
                          href="/homepage/activities"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Activities Section
                        </Link>
                        <Link
                          href="/homepage/speakers"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Pool of Speakers
                        </Link>
                        <Link
                          href="/homepage/centers-of-participation"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        >
                          Centers of Participation
                        </Link>
                      </div>
                    )}
                  </div>

                  <a
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="mt-5 flex transform items-center rounded-lg px-4 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <LogoutIcon />

                    <span className="mx-4 font-medium">Logout</span>
                  </a>
                </nav>
              </div>
            </aside>
          </>
        )}
      </div>

      {/* NON-MOBILE VIEW */}
      <div className="mt-2 flex flex-col flex-wrap gap-2 phone:hidden">
        <nav className=" flex h-12 items-center justify-between px-10 py-3 font-custom-lexend  text-xs text-primary  ">
          {/* left navbar */}
          <ul className=" flex  flex-grow cursor-pointer phone:text-sm">
            <li className="item-center custom-epilogue flex flex-grow cursor-pointer text-sm font-black">
              <Link
                href="/homepage"
                onClick={() => handleLinkClick("home")}
                className="text-gradient"
              >
                Laguna Youth Organizations Hub
              </Link>
            </li>
          </ul>

          {/* middle */}
          <ul className=" flex flex-grow gap-5">
            <li
              className={`cursor-pointer ${activeLink === "howItWorks" ? " text-secondary" : "text-primary"}`}
              onClick={() => {
                console.log(sessionData?.user.organization); //
              }}
            >
              <Link href="/homepage/how-it-works">How it Works</Link>
            </li>
            <li
              className={`cursor-pointer ${activeLink === "findOrganizations" ? " text-secondary" : ""}`}
              onClick={() => handleLinkClick("findOrganizations")}
            >
              <Link href="/homepage/find-organizations">
                Find Organizations
              </Link>
            </li>
            <li
              className={`cursor-pointer ${activeLink === "getInvolved" ? " text-secondary" : ""}`}
              onClick={() => setToggleGetInvolved(!toggleGetInvolved)}
            >
              Get Involved
            </li>
          </ul>

          {/* right navbar */}
          <div className=" flex items-center ">
            {sessionData ? (
              <div className=" flex flex-wrap items-center gap-3">
                <Link
                  href={
                    sessionData.user.role === "VOLUNTEER"
                      ? "/profile/volunteer"
                      : "/profile/organization"
                  }
                >
                  <button
                    className={`tablet:hidden ${activeLink === "profile" ? " text-secondary" : ""}`}
                    onClick={() => handleLinkClick("profile")}
                  >
                    {sessionData?.user.role === "VOLUNTEER"
                      ? `${volunteer.data?.firstName} ${volunteer.data?.middleInitial} ${volunteer.data?.lastName} ${volunteer.data?.suffix}`
                      : organization.data?.orgName}
                  </button>
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
                      onClick={() =>
                        sessionData.user.role === "VOLUNTEER"
                          ? router.push("/profile/volunteer")
                          : router.push("/profile/organization")
                      }
                    >
                      Profile
                    </p>
                    <p
                      className="cursor-pointer"
                      onClick={() =>
                        sessionData.user.role === "VOLUNTEER"
                          ? router.push(
                              "/manage-activities/volunteer/org-requests",
                            )
                          : router.push(
                              "/manage-activities/organization/volunteer-requests",
                            )
                      }
                    >
                      Manage Activities
                    </p>
                    <p
                      className="cursor-pointer"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Logout
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  className="btn-active px-10 py-1"
                  onClick={handleSignIn}
                >
                  Get Started
                </button>
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
                  onClick={() => router.push("/homepage/speakers")}
                >
                  Pool of Speakers
                </p>

                <p
                  className="cursor-pointer"
                  onClick={() =>
                    router.push("/homepage/centers-of-participation")
                  }
                >
                  Centers of Participation
                </p>
              </div>
            )}
          </div>
        </nav>
        <hr className="flex  w-full border-t-2 border-customBlack-25" />
      </div>
    </>
  );
};

export default Navbar;

function handleSignIn() {
  window.location.href = "/auth/login";
}
