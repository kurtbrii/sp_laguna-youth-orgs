import React, { useEffect, useState } from "react";
import Image from "next/image";
import vol2 from "public/images/vol2.png";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useFormSetup } from "~/utils/func";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { createOrgSchema, createVolSchema } from "~/utils/schemaValidation";

type CreateVolunteerFields = z.infer<typeof createVolSchema>;
type CreateOrganizationFields = z.infer<typeof createOrgSchema>;

interface VolunteerProps {
  firstName: string;
  lastName: string;
  middleInitial: string;
  suffix: string;
  phoneNumber: string;
}

const SignUp = () => {
  const { data: sessionData, status: sessionStatus } = useSession();
  const router = useRouter();

  const [volOrOrg, setVolOrOrg] = useState<string>("organization");

  // ! SUBMITTING FORM
  const createOrganization = api.organization.createOrganization.useMutation();
  const createVolunteer = api.volunteer.createVolunteer.useMutation();
  const updateRole = api.user.updateUserRole.useMutation();

  //! VOLUNTEER HANDLE
  const {
    register: volunteerRegister,
    handleSubmit: volunteerHandleSubmit,
    setValue: volunteerSetValue,
    getValues: volunteerGetValues,
    errors: volunteerErrors,
    isSubmitting: volunteerIsSubmitting,
  } = useFormSetup({}, zodResolver(createVolSchema));

  const volunteerSubmit: SubmitHandler<CreateVolunteerFields> = async (
    data,
  ) => {
    console.log(data);

    createVolunteer.mutate({
      firstName: volunteerGetValues("firstName"),
      lastName: volunteerGetValues("lastName"),
      middleInitial: volunteerGetValues("middleInitial"),
      suffix: volunteerGetValues("suffix"),
      phoneNumber: volunteerGetValues("phoneNumber"),
      userId: sessionData?.user.id ?? "",
      email: sessionData?.user.email ?? "",
    });

    updateRole.mutate({
      userId: sessionData?.user.id ?? "",
      role: "VOLUNTEER",
    });

    void router.push("/homepage");
  };

  const [volunteerFormData, setVolunteerFormData] = useState<VolunteerProps>({
    firstName: "",
    lastName: "",
    middleInitial: "",
    suffix: "",
    phoneNumber: "",
  });

  //! ORGANIZATION HANDLE
  const {
    register: organizationRegister,
    handleSubmit: organizationHandleSubmit,
    setValue: organizationSetValue,
    getValues: organizationGetValues,
    errors: organizationErrors,
    isSubmitting: organizationIsSubmitting,
  } = useFormSetup({}, zodResolver(createOrgSchema));

  const organizationSubmit: SubmitHandler<CreateOrganizationFields> = async (
    data,
  ) => {
    console.log(data);

    alert("Organization Created");

    createOrganization.mutate({
      orgName: organizationGetValues("orgName"),
      phoneNumber: organizationGetValues("phoneNumber"),
      userId: sessionData?.user.id ?? "",
      email: sessionData?.user.email ?? "",
    });

    updateRole.mutate({
      userId: sessionData?.user.id ?? "",
      role: "ORGANIZATION",
    });

    void router.push("/homepage");
  };

  // ! USE EFFECT
  useEffect(() => {
    const roles = ["VOLUNTEER", "ORGANIZATION"];
    // Check authentication status when the component mounts
    if (
      (sessionData?.user.role && roles.includes(sessionData?.user.role)) ??
      sessionStatus == "unauthenticated"
    ) {
      // Redirect to /homepage if not authenticated
      void router.push("/homepage");
    }
  }, [router, sessionStatus]);

  useEffect(() => {
    organizationSetValue("userId", "123");
    organizationSetValue("email", "test@gmail.com");

    volunteerSetValue("userId", "test@gmail.com");
    volunteerSetValue("email", "test@gmail.com");
  });

  return (
    <section className="flex h-screen  font-custom-lexend text-customBlack-100">
      {/* <!-- Left part with image --> */}
      <section className="relative w-3/5 flex-shrink-0 bg-customBlack-100">
        {/* Your image goes here */}
        <Image
          className="h-full w-full object-cover opacity-30"
          src={vol2}
          alt="Volunteer Image"
        />
        {/* Centered div */}
        <div className=" absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform text-center text-white">
          <h1 className="mb-3 font-custom-epilogue text-4xl">
            Laguna Youth Organizations Hub
          </h1>
          <p className="italic">Connect. Collaborate. Contribute.</p>
        </div>
      </section>

      {/* <!-- Right part with login page --> */}
      <section className=" flex w-2/5 flex-shrink-0 flex-col  justify-around p-8">
        <div className="flex">
          <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-custom-epilogue text-4xl  font-extrabold text-transparent">
            Register Now
          </h1>
        </div>

        {volOrOrg === "volunteer" ? (
          // ! Volunteer Form
          <form
            className="mb-2 flex flex-col justify-evenly gap-4"
            onSubmit={volunteerHandleSubmit(volunteerSubmit)}
          >
            {/* full name */}
            <div className=" flex flex-col">
              <p className="mb-2">Full Name</p>
              <div className="mb-2 flex flex-grow gap-2">
                <input
                  {...volunteerRegister("firstName")}
                  type="text"
                  className="w-5/6 rounded border border-gray-300 p-2 shadow"
                  placeholder="First Name"
                />

                <input
                  {...volunteerRegister("middleInitial")}
                  className="w-1/6 rounded border border-gray-300 p-2 shadow "
                  placeholder="M.I."
                  type="text"
                />
                {volunteerErrors.middleInitial &&
                  typeof volunteerErrors.middleInitial.message === "string" && (
                    <p className="text-customRed">
                      {volunteerErrors.middleInitial.message}
                    </p>
                  )}
              </div>
              {volunteerErrors.firstName &&
                typeof volunteerErrors.firstName.message === "string" && (
                  <p className="text-customRed">
                    {volunteerErrors.firstName.message}
                  </p>
                )}

              <div className="flex flex-grow gap-2">
                <input
                  {...volunteerRegister("lastName")}
                  className="w-5/6 rounded border border-gray-300 p-2 shadow"
                  placeholder="Last Name"
                  type="text"
                />

                <input
                  {...volunteerRegister("suffix")}
                  className="w-1/6 rounded border border-gray-300 p-2 shadow"
                  placeholder="Suffix"
                  type="text"
                />
                {volunteerErrors.suffix &&
                  typeof volunteerErrors.suffix.message === "string" && (
                    <p className="text-customRed">
                      {volunteerErrors.suffix.message}
                    </p>
                  )}
              </div>
              {volunteerErrors.lastName &&
                typeof volunteerErrors.lastName.message === "string" && (
                  <p className="text-customRed">
                    {volunteerErrors.lastName.message}
                  </p>
                )}
            </div>

            {/* phone number */}
            <div className="mb-4 flex flex-col gap-2">
              <p>Phone Number</p>
              <input
                {...volunteerRegister("phoneNumber")}
                className="w-full rounded border border-gray-300 p-2 shadow"
                placeholder="Enter Phone Number (09xxxxxxxxx)"
                type="string"
              />
              {volunteerErrors.phoneNumber &&
                typeof volunteerErrors.phoneNumber.message === "string" && (
                  <p className="text-customRed">
                    {volunteerErrors.phoneNumber.message}
                  </p>
                )}
            </div>

            <ToggleVolOrg volOrOrg={"volunteer"} setVolOrOrg={setVolOrOrg} />

            {/* Submit Button */}
            <div className="mx-16 mt-4 flex flex-col items-stretch gap-2">
              <button
                type="submit"
                className="btn-active flex items-center justify-center gap-3 rounded-md px-12 py-2"
              >
                <p>Sign Up</p>
              </button>
            </div>
          </form>
        ) : (
          //! Organization Form
          <form
            className="flex flex-col justify-start gap-4"
            onSubmit={organizationHandleSubmit(organizationSubmit)}
          >
            <div className="mb-2 flex flex-col gap-2">
              <p>Name of Organization</p>
              <input
                {...organizationRegister("orgName")}
                className="w-full rounded border border-gray-300 p-2 shadow "
                placeholder="Enter Organization Name"
              />
              {organizationErrors.orgName &&
                typeof organizationErrors.orgName.message === "string" && (
                  <p className="text-customRed">
                    {organizationErrors.orgName.message}
                  </p>
                )}
            </div>

            <div className="mb-10 flex flex-col gap-2">
              <p>Phone Number</p>
              <input
                {...organizationRegister("phoneNumber")}
                className="w-full rounded border border-gray-300 p-2 shadow"
                placeholder="Enter Phone Number (09xxxxxxxxx)"
              />
              {organizationErrors.phoneNumber &&
                typeof organizationErrors.phoneNumber.message === "string" && (
                  <p className="text-customRed">
                    {organizationErrors.phoneNumber.message}
                  </p>
                )}
            </div>

            <ToggleVolOrg volOrOrg={"organization"} setVolOrOrg={setVolOrOrg} />

            {/* Submit Button */}
            <div className="mx-16 mt-10 flex flex-col items-stretch gap-2">
              <button
                type="submit"
                className="btn-active flex items-center justify-center gap-3 rounded-md px-12 py-2"
              >
                <p>Sign Up</p>
              </button>
            </div>
          </form>
        )}
      </section>
    </section>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ToggleVolOrg = ({
  volOrOrg,
  setVolOrOrg,
}: {
  volOrOrg: string;
  setVolOrOrg: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <section className="flex flex-col gap-6">
      <div className="mx-20 flex justify-center">
        <button
          id="organizationBtn"
          className={`w-1/2 transition ease-in-out focus:outline-none ${
            volOrOrg === "organization"
              ? "bg-gradient rounded-l-md text-white"
              : "rounded-l-md border border-secondary bg-transparent text-secondary"
          }`}
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();

            setVolOrOrg("organization");
          }}
        >
          Organization
        </button>
        <button
          id="volunteerBtn"
          className={`w-1/2 px-4 py-2 transition ease-in-out focus:outline-none ${
            volOrOrg === "volunteer"
              ? "rounded-r-md bg-gradient-to-r  from-secondary to-primary text-white"
              : "rounded-r-md border border-secondary bg-transparent text-secondary"
          }`}
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setVolOrOrg("volunteer");
          }}
        >
          Volunteer
        </button>
      </div>
    </section>
  );
};

export default SignUp;
