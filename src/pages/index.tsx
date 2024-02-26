// import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
import Image from "next/image";
import Navbar from "~/components/navbar";

// import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { db } from "~/server/db";
import vol1 from "public/images/vol1.png";
import OrgCard from "~/components/orgcard";
import EventCard from "~/components/eventCard";
import ActivitiesCard from "~/components/ActivitiesCard";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { IconButton } from "@mui/material";
import router from "next/router";
import { Resend } from "resend";
import emailjs from "@emailjs/browser";

export default function Home() {
  const { data: sessionData } = useSession();

  const current = sessionData?.user.id; // Replace with the actual user ID
  const get = api.user.getUser.useQuery({ userId: current ?? "" });

  // ! Recent Events
  const event = api.event.getEvents.useQuery({ take: 3 });

  // ! Get Organizations
  const organizations = api.organization.getOrganizations.useQuery({ take: 3 });

  // ! Get Activities
  const activity = api.activity.getActivities.useQuery({ take: 3 });

  return (
    <>
      <Head>
        <title>Laguna Youth Organizations Hub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <script
          src="https://upload-widget.cloudinary.com/global/all.js"
          type="text/javascript"
          async
        ></script>
        <script
          type="text/javascript"
          src="../node_modules/tw-elements/dist/js/tw-elements.umd.min.js"
          async
        ></script>
      </Head>
      <main className="flex flex-col">
        <header className=" flex flex-col font-custom-lexend text-customBlack-100">
          {/* NavBar */}
          <Navbar />
          {/* Hero Section */}
          <section className="relative mb-10 flex bg-customBlack-100">
            <Image
              src={vol1}
              alt="Volunteer Image"
              className="w-full opacity-20 phone:h-96"
              style={{
                // height: "485px",
                objectFit: "cover",
                objectPosition: "100% 0%",
              }}
            />
            <section className="absolute left-14 top-16  mb-2 h-full w-5/6 items-center font-custom-epilogue text-6xl font-extrabold leading-normal text-white phone:left-5 phone:text-[28px] tablet:text-[28px]">
              <h1 className=" mb-5">
                The largest network of <br className="phone:hidden" />
                <span className="btn-active py-font-extrabold self-center px-4 text-6xl phone:text-[28px] tablet:text-[28px]">
                  youth volunteers
                </span>{" "}
                in Laguna
              </h1>
              <p className="custom-lexend text-lg italic phone:text-sm tablet:text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                eget placerat nulla.{" "}
              </p>
            </section>
          </section>

          {/* FIND ORGANIZATIONS */}
          <div className="custom-epilogue mx-10 flex flex-col ">
            <h1 className="mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent ">
              Find Organizations
            </h1>

            <div className="flex gap-4 phone:flex-col tablet:flex-col">
              <div className=" mb-5  flex flex-wrap justify-start gap-7 phone:justify-center">
                {organizations?.data?.map((organization) => (
                  <OrgCard key={organization.id} organization={organization} />
                ))}
              </div>

              <IconButton
                className=" self-center"
                onClick={() => router.push("/homepage/find-organizations")}
              >
                <ArrowForwardRoundedIcon fontSize="large" />
              </IconButton>
            </div>
          </div>

          {/* ACTIVITIES SECTION */}
          <div className="custom-epilogue mx-10 mt-20 flex flex-col ">
            <h1 className="mb-4 h-full bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent ">
              All Activities
            </h1>

            <div className="flex gap-4 phone:flex-col laptop:flex-col">
              <div className="mb-5  flex flex-wrap justify-start gap-7 phone:justify-center ">
                {activity?.data?.map((queryActivity) => (
                  <ActivitiesCard
                    key={queryActivity.id}
                    activity={queryActivity}
                  />
                ))}
              </div>
              <IconButton
                className="self-center"
                onClick={() => router.push("/homepage/activities")}
              >
                <ArrowForwardRoundedIcon fontSize="large" />
              </IconButton>
            </div>
          </div>

          <div className="mb-96"></div>
        </header>

        {/* <button onClick={() => handleButton()}>helloo</button> */}
      </main>
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//       </p>

//       {sessionData ? (
//         <>
//           <div className="text-white">{sessionData.user.name}</div>
//           <div className="text-white">{sessionData.user.email}</div>

//           <Image
//             src={sessionData.user.image ?? ""}
//             width={30}
//             height={30}
//             alt="User Profile"
//           />
//           <button
//             className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//             onClick={() => void signOut()}
//           >
//             Logout
//           </button>
//         </>
//       ) : (
//         <>
//           <button
//             className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//             onClick={() => void signIn("google", {})}
//           >
//             Google
//           </button>
//           <button
//             className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//             onClick={() => void signIn("discord", {})}
//           >
//             Discord
//           </button>
//         </>
//       )}
//     </div>
//   );
// }
