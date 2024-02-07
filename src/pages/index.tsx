// import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
// import Link from "next/link";
import Image from "next/image";
import NavBar from "~/components/navbar";

// import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { db } from "~/server/db";
import vol2 from "../../assets/vol2.png";

export default function Home() {
  const { data: sessionData } = useSession();

  const current = sessionData?.user.id; // Replace with the actual user ID
  const get = api.user.getUser.useQuery({ userId: current ?? "" });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Changa+One:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="block">
        <header className=" flex flex-col font-custom-lexend text-customBlack-100">
          {/* NavBar */}
          <NavBar />

          {/* Hero Section */}
          <section className="flex bg-customBlack-100">
            <Image
              className="absolute h-full w-full object-cover opacity-30"
              src={vol2}
              alt="Volunteer Image"
            />
          </section>

          {/* Recent Events */}
          <div className="custom-epilogue mx-10 my-4 flex h-12 flex-col justify-between ">
            <h1 className="mb-2 h-full w-1/2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent ">
              Find Organizations
            </h1>
            <p className="custom-lexend">
              This is a sample text of an organization
            </p>
          </div>

          {/* Find Organizations */}
          <div className="custom-epilogue mx-10 my-4 flex h-12 flex-col justify-between ">
            <h1 className="mb-2 h-full w-1/2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent ">
              Find Organizations
            </h1>
            <p className="custom-lexend">This is a sample text also</p>
          </div>

          {/* Get Involved */}
          <div className="custom-epilogue mx-10 my-4 flex h-12 flex-col justify-between ">
            <h1 className="mb-2 h-full w-1/2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-extrabold text-transparent ">
              Get Involved
            </h1>
            <p className="custom-lexend">This is a sample text also</p>
          </div>

          {/* <button onClick={() => num()}>butn</button> */}
        </header>
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
