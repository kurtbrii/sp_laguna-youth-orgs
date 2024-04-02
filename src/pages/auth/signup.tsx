import React, { useEffect, useState } from "react";
import Image from "next/image";
import vol2 from "public/images/vol2.png";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface VolunteerProps {
  firstName: string;
  lastName: string;
  middleInitial: string;
  suffix: string;
  phoneNumber: string;
}
interface OrgProps {
  orgName: string;
  phoneNumber: string;
}

const SignUp = () => {
  const { data: sessionData, status: sessionStatus } = useSession();
  const router = useRouter();

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

  const [volOrOrg, setCurrentState] = useState<string>("organization");

  //! VOLUNTEER SET STATE

  const [volunteerFormData, setVolunteerFormData] = useState<VolunteerProps>({
    firstName: "",
    lastName: "",
    middleInitial: "",
    suffix: "",
    phoneNumber: "",
  });

  const volunteerHandleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    setVolunteerFormData({
      ...volunteerFormData,
      [name]: value,
    });

    console.log(volunteerFormData);
  };

  //! ORGANIZATION SET STATE
  const [orgFormData, setOrgFormData] = useState<OrgProps>({
    orgName: "",
    phoneNumber: "",
  });

  const orgHandleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrgFormData({
      ...orgFormData,
      [name]: value,
    });

    console.log(orgFormData);
  };

  // ! SUBMITTING FORM
  const createOrganization = api.organization.createOrganization.useMutation();
  const createVolunteer = api.volunteer.createVolunteer.useMutation();
  const updateRole = api.user.updateUserRole.useMutation();

  //! Organization
  const handleOrgSubmit = async () => {
    createOrganization.mutate({
      orgName: orgFormData.orgName,
      phoneNumber: orgFormData.phoneNumber,
      userId: sessionData?.user.id ?? "",
      email: sessionData?.user.email ?? "",
    });

    updateRole.mutate({
      userId: sessionData?.user.id ?? "",
      role: "ORGANIZATION",
    });

    setTimeout(() => {
      //C - 1 second later
    }, 500);

    void router.push("/homepage");
  };

  //! Volunteer
  const handleVolunteerSubmit = async () => {
    createVolunteer.mutate({
      firstName: volunteerFormData.firstName,
      lastName: volunteerFormData.lastName,
      middleInitial: volunteerFormData.middleInitial,
      suffix: volunteerFormData.suffix,
      phoneNumber: volunteerFormData.phoneNumber,
      userId: sessionData?.user.id ?? "",
      email: sessionData?.user.email ?? "",
    });

    updateRole.mutate({
      userId: sessionData?.user.id ?? "",
      role: "VOLUNTEER",
    });

    void router.push("/homepage");
  };

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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
            eget placerat nulla. Duis eget lacinia lacus. Duis volutpat metus a
            felis volutpat elementum. Integer hendrerit sit
          </p>
        </div>
      </section>

      {/* <!-- Right part with login page --> */}
      <section className=" flex w-2/5 flex-shrink-0 flex-col  justify-between gap-7 p-8">
        <h1 className=" h-30 font-custom-changa-one mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-4xl  font-extrabold text-transparent">
          Register Now
        </h1>

        {volOrOrg === "volunteer" ? (
          // ! Volunteer Form
          <form className="mb-2 flex flex-col gap-6">
            {/* full name */}
            <div className=" flex flex-col">
              <p className="mb-2">Full Name</p>
              <div className="mb-2 flex flex-grow gap-2">
                <input
                  type="text"
                  value={volunteerFormData.firstName}
                  name="firstName"
                  onChange={volunteerHandleInputChange}
                  className="w-5/6 rounded border border-gray-300 p-2 shadow"
                  placeholder="First Name"
                />
                <input
                  className="w-1/6 rounded border border-gray-300 p-2 shadow "
                  placeholder="M.I."
                  type="text"
                  value={volunteerFormData.middleInitial}
                  name="middleInitial"
                  onChange={volunteerHandleInputChange}
                />
              </div>

              <div className="flex flex-grow gap-2">
                <input
                  className="w-5/6 rounded border border-gray-300 p-2 shadow"
                  placeholder="Last Name"
                  type="text"
                  value={volunteerFormData.lastName}
                  name="lastName"
                  onChange={volunteerHandleInputChange}
                />
                <input
                  className="w-1/6 rounded border border-gray-300 p-2 shadow"
                  placeholder="Suffix"
                  type="text"
                  value={volunteerFormData.suffix}
                  name="suffix"
                  onChange={volunteerHandleInputChange}
                />
              </div>
            </div>

            {/* phone number */}
            <div className="flex flex-col gap-2">
              <p>Phone Number</p>
              <input
                className="w-full rounded border border-gray-300 p-2 shadow"
                placeholder="Enter Phone Number"
                type="string"
                value={volunteerFormData.phoneNumber}
                name="phoneNumber"
                onChange={volunteerHandleInputChange}
              />
            </div>
          </form>
        ) : (
          //! Organization Form
          <form className="flex flex-col gap-4">
            <div className="mb-2 flex flex-col gap-2">
              <p>Name of Organization</p>
              <input
                className="w-full rounded border border-gray-300 p-2 shadow "
                placeholder="Enter Organization Name"
                value={orgFormData.orgName}
                name="orgName"
                onChange={orgHandleInputChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <p>Phone Number</p>
              <input
                className="w-full rounded border border-gray-300 p-2 shadow"
                placeholder="Enter Phone Number"
                value={orgFormData.phoneNumber}
                name="phoneNumber"
                onChange={orgHandleInputChange}
              />
            </div>
          </form>
        )}

        <section className="flex flex-col gap-6">
          <div className="mx-20 flex justify-center">
            <button
              type="submit"
              id="organizationBtn"
              className={`w-1/2 transition ease-in-out focus:outline-none ${
                volOrOrg === "organization"
                  ? "bg-gradient rounded-l-md text-white"
                  : "rounded-l-md border border-secondary bg-transparent text-secondary"
              }`}
              onClick={() => {
                setCurrentState("organization");
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
              onClick={() => {
                setCurrentState("volunteer");
              }}
            >
              Volunteer
            </button>
          </div>

          <div className="mx-16 flex flex-col items-stretch gap-2">
            <button
              type="submit"
              onClick={
                volOrOrg === "organization"
                  ? () => handleOrgSubmit()
                  : () => handleVolunteerSubmit()
              }
              className="btn-active flex items-center justify-center gap-3 rounded-md px-12 py-2"
            >
              <p>Sign Up</p>
            </button>
            <button className="btn-outline  border-1 flex items-center justify-center gap-3 rounded-md border px-12 py-2">
              <p>Continue as Guest</p>
            </button>
          </div>
        </section>
      </section>
    </section>
  );
};

export default SignUp;
