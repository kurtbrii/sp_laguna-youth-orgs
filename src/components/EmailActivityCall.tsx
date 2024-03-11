/* eslint-disable @typescript-eslint/no-explicit-any */
import emailjs from "@emailjs/browser";
import React, { useEffect, useState } from "react";

import { api } from "~/utils/api";
import { createJoinActivitySchema } from "~/utils/schemaValidation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { createGuestSchema } from "~/utils/schemaValidation";

type UpdateOrganizationFields = z.infer<typeof createJoinActivitySchema>;
type UpdateGuestFields = z.infer<typeof createGuestSchema>;

interface EmailProps {
  subject: string;
  body: string;
}

const EmailActivityCall = ({
  activity,
  sessionEmail,
  role,
  volunteer,
  organization,
}: any) => {
  const router = useRouter();

  const addOrgOrVol = api.activityCall.createJoinActivity.useMutation();

  const createGuest = api.guest.createGuest.useMutation();

  const [authenticatedUserData, setAuthenticatedUserData] =
    useState<EmailProps>({
      subject: "",
      body: "",
    });

  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    sex: "Male",
    phoneNumber: "",
    age: "",

    subject: "",
    body: "",
  });

  // ! REACT USEFORM
  const useFormSetup = (defaultValues: any, resolver: any) => {
    const {
      register,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors, isSubmitting },
    } = useForm({
      defaultValues,
      resolver,
    });

    return {
      register,
      handleSubmit,
      setValue,
      getValues,
      errors,
      isSubmitting,
    };
  };

  const {
    register: orgVolRegister,
    handleSubmit: orgVolHandleSubmit,
    setValue: orgVolSetValue,
    getValues: orgVolGetValues,
    errors: orgVolErrors,
    isSubmitting: orgVolIsSubmitting,
  } = useFormSetup(
    {
      orgId: "",
      volId: "",
    },
    zodResolver(createJoinActivitySchema),
  );

  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   getValues,
  //   formState: { errors, isSubmitting },
  // } = useForm<UpdateOrganizationFields>({
  //   defaultValues: {
  //     orgId: "",
  //     volId: "",
  //   },
  //   resolver: zodResolver(createJoinActivitySchema),
  // });

  const orgVolOnSubmit: SubmitHandler<UpdateOrganizationFields> = async (
    data,
  ) => {
    console.log("Data", data);
    // alert(volunteer?.id);

    if (role === "ORGANIZATION") {
      addOrgOrVol.mutate({
        activityId: activity?.id,
        orgId: organization?.id,
        subject: orgVolGetValues("subject"),
        body: orgVolGetValues("body"),
        label: "partnership",
      });
    } else {
      addOrgOrVol.mutate({
        activityId: activity?.id,
        volId: volunteer?.id,
        subject: orgVolGetValues("subject"),
        body: orgVolGetValues("body"),
        label: "volunteer",
      });
    }

    await emailjs.send(
      "service_sb8pzif",
      "template_g280rll",
      {
        user_name:
          role === "VOLUNTEER"
            ? `${volunteer?.firstName} ${volunteer?.middleInitial} ${volunteer?.lastName} ${volunteer?.suffix}`
            : organization.orgName,
        subject: authenticatedUserData.subject,
        body: authenticatedUserData.body,
        from_email: sessionEmail,
        to_email: activity?.organization?.user?.email,
        action:
          role === "VOLUNTEER"
            ? "wants to volunteer in your activity"
            : "wants to partner with you on this activity",
        activity_name: activity?.name,
        activity_loc: activity?.location,
        activity_date: activity?.date,
        role: role === "VOLUNTEER" ? "Volunteer" : "Organization",
        user_email: sessionEmail,
        user_phone_number:
          role === "VOLUNTEER"
            ? volunteer?.phoneNumber
            : organization?.phoneNumber,
      },
      "AxPqfUq-9Oy9tdLJv",
    );

    alert("Request Successul");

    router.reload();
  };

  const {
    register: guestRegister,
    handleSubmit: guestHandleSubmit,
    setValue: guestSetValue,
    getValues: guestGetValues,
    errors: guestErrors,
    isSubmitting: guestIsSubmitting,
  } = useFormSetup({}, zodResolver(createGuestSchema));

  const guestSubmit: SubmitHandler<UpdateGuestFields> = async (data) => {
    console.log("Data", data);
    // alert(volunteer?.id);

    // router.reload();
  };

  const handleCallActivityForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAuthenticatedUserData({
      ...authenticatedUserData,
      [name]: value,
    });

    console.log(authenticatedUserData);
  };

  const handleGuestForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setGuestData({
      ...guestData,
      [name]: value,
    });

    console.log(guestData);
  };

  const handleSubmitGuest = (e: React.FormEvent<HTMLFormElement>) => {
    createGuest.mutate({
      name: guestData.name,
      age: parseInt(guestData.age),
      email: guestData.email,
      phoneNumber: guestData.phoneNumber,
      sex: guestData.sex,
      subject: guestData.subject,
      body: guestData.body,
      activityId: activity?.id,
    });

    void emailjs.send(
      "service_sb8pzif",
      "template_g280rll",
      {
        user_name: guestData.name,
        subject: guestData.subject,
        body: guestData.body,
        from_email: guestData.email,
        to_email: activity?.organization?.user?.email,
        action: "wants to participate in your activity",
        activity_name: activity?.name,
        activity_loc: activity?.location,
        activity_date: activity?.date,
        role: "Guest",
        user_email: guestData.email,
        user_phone_number: guestData.phoneNumber,
      },
      "AxPqfUq-9Oy9tdLJv",
    );

    alert("Request Successul");
    e.preventDefault();
  };

  useEffect(() => {
    orgVolSetValue("orgId", organization?.id),
      orgVolSetValue("volId", volunteer?.id),
      orgVolSetValue("activityId", activity?.id),
      orgVolSetValue("guestID", ""),
      orgVolSetValue("label", "");
  }, [orgVolSetValue]);

  return (
    <>
      {role === "VOLUNTEER" || role === "ORGANIZATION" ? (
        <>
          <form
            onSubmit={orgVolHandleSubmit(orgVolOnSubmit)}
            className="mx-40 mb-5 mt-5 flex flex-col gap-4 font-custom-lexend  text-sm text-customBlack-100"
          >
            <input
              {...orgVolRegister("subject")}
              type="text"
              name="subject"
              onChange={handleCallActivityForm}
              className="h-12 w-full rounded border  p-2 shadow"
              placeholder="Subject"
            />
            {orgVolErrors.subject &&
              typeof orgVolErrors.subject.message === "string" && (
                <p className="text-customRed">{orgVolErrors.subject.message}</p>
              )}

            <textarea
              {...orgVolRegister("body")}
              className=" w-full rounded border p-2 shadow "
              name="body"
              value={authenticatedUserData.body}
              onChange={handleCallActivityForm}
              rows={10}
              placeholder="Body"
            />
            {orgVolErrors.body &&
              typeof orgVolErrors.body.message === "string" && (
                <p className="text-customRed">{orgVolErrors.body.message}</p>
              )}

            <button
              disabled={orgVolIsSubmitting}
              type="submit"
              className={`btn-active px-20 py-3 ${orgVolIsSubmitting && "opacity-50"}`}
            >
              {orgVolIsSubmitting ? "Sending Email..." : "Send Email"}
            </button>
          </form>
          {/* <button>sfd</button> */}
        </>
      ) : (
        <>
          <form
            onSubmit={orgVolHandleSubmit(guestSubmit)}
            className="mx-40 mb-5 mt-5 flex flex-col gap-4 font-custom-lexend text-sm text-customBlack-100"
          >
            <p className="font-bold italic text-primary">Participant Details</p>
            <input
              type="text"
              value={guestData.name}
              name="name"
              onChange={handleGuestForm}
              className="h-12 w-full rounded border  p-2 shadow"
              placeholder="Name"
            />

            <div className="flex gap-2">
              <select
                defaultValue={"Male"}
                id="example-dropdown"
                name="sex"
                value={guestData.sex}
                className=" w-1/2 rounded border p-2 shadow "
                onChange={handleGuestForm}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <input
                type="number"
                value={guestData.age}
                name="age"
                min={10}
                max={30}
                onChange={handleGuestForm}
                className="h-12 w-1/2  rounded border p-2 shadow"
                placeholder="Age"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={guestData.email}
                name="email"
                onChange={handleGuestForm}
                className="h-12 w-1/2  rounded border p-2 shadow"
                placeholder="Email"
              />

              <input
                type="text"
                value={guestData.phoneNumber}
                name="phoneNumber"
                onChange={handleGuestForm}
                className="h-12 w-1/2  rounded border p-2 shadow"
                placeholder="Phone Number (09xxxxxxxxx)"
              />
            </div>

            <p className="mt-12 font-bold italic text-primary">Email Content</p>

            <input
              type="text"
              value={guestData.subject}
              name="subject"
              onChange={handleGuestForm}
              className=" h-12 w-full rounded border  p-2 shadow"
              placeholder="Subject"
            />
            <textarea
              className=" w-full rounded border p-2 shadow "
              name="body"
              value={guestData.body}
              onChange={handleGuestForm}
              rows={10}
              placeholder="Body"
            />
            <button type="submit" className="btn-active px-20 py-3">
              Send Email
            </button>
          </form>
          <button>sfd</button>
        </>
      )}
    </>
  );
};

export default EmailActivityCall;
