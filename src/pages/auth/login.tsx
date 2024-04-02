import React, { useEffect } from "react";
import vol2 from "public/images/vol2.png";
import Image from "next/image";
import Providers from "~/components/providers";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Login = () => {
  const { data: sessionData, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    const roles = ["VOLUNTEER", "ORGANIZATION"];
    // Check authentication status when the component mounts
    if (sessionData?.user.role && roles.includes(sessionData?.user.role)) {
      // Redirect to /homepage if not authenticated
      void router.push("/homepage");
    }
  }, [router, sessionStatus]);

  return (
    <section className="flex h-screen font-custom-lexend phone:flex-col phone:items-center ">
      {/* <!-- Left part with image --> */}
      <section className="relative w-3/5 flex-shrink-0 bg-customBlack-100 phone:w-full">
        {/* Your image goes here */}
        <Image
          className="h-full w-full object-cover opacity-35"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          src={vol2}
          alt="Volunteer Image"
        />
        {/* Centered div */}
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-center text-white phone:text-xs">
          <h1 className="mb-3 font-custom-epilogue text-4xl font-bold">
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
      <section className="flex   w-2/5  flex-shrink-0 flex-col items-center justify-center gap-7 p-8 phone:w-full">
        <h1 className="mb-3 bg-gradient-to-r from-primary  to-secondary bg-clip-text font-custom-epilogue text-4xl  font-extrabold text-transparent">
          Welcome Back!
        </h1>

        {/* providers */}
        <Providers />
        {/* <div>
          <h1 className="mb-3  text-4xl">Welcome Back!</h1>
          <h1 className="mb-3  text-4xl">Welcome Back!</h1>
        </div> */}
      </section>
    </section>
  );
};

export default Login;
