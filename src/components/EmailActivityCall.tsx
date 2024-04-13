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
import { useFormSetup } from "~/utils/func";

type UpdateOrganizationFields = z.infer<typeof createJoinActivitySchema>;
type UpdateGuestFields = z.infer<typeof createGuestSchema>;

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

  // ! REACT USEFORM

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
        subject: orgVolGetValues("subject"),
        body: orgVolGetValues("body"),
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

    createGuest.mutate({
      name: guestGetValues("name"),
      age: parseInt(guestGetValues("age")),
      email: guestGetValues("email"),
      phoneNumber: guestGetValues("phoneNumber"),
      sex: guestGetValues("sex"),
      subject: guestGetValues("subject"),
      body: guestGetValues("body"),
      activityId: activity?.id,
    });

    void emailjs.send(
      "service_sb8pzif",
      "template_g280rll",
      {
        user_name: guestGetValues("name"),
        subject: guestGetValues("subject"),
        body: guestGetValues("body"),
        from_email: guestGetValues("email"),
        to_email: activity?.organization?.user?.email,
        action: "wants to participate in your activity",
        activity_name: activity?.name,
        activity_loc: activity?.location,
        activity_date: activity?.date,
        role: "Guest",
        user_email: guestGetValues("email"),
        user_phone_number: guestGetValues("phoneNumber"),
      },
      "AxPqfUq-9Oy9tdLJv",
    );

    alert("Request Successul");

    router.reload();
  };

  useEffect(() => {
    // ! for volunteers and organizations
    orgVolSetValue("orgId", organization?.id);
    orgVolSetValue("volId", volunteer?.id);
    orgVolSetValue("activityId", activity?.id);
    orgVolSetValue("guestID", "");
    orgVolSetValue("label", "");

    // ! for guests
    guestSetValue("activityId", activity?.id);
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
            onSubmit={guestHandleSubmit(guestSubmit)}
            className="mx-40 mb-5 mt-5 flex flex-col gap-4 font-custom-lexend text-sm text-customBlack-100"
          >
            <p className="font-bold italic text-primary">Participant Details</p>
            <input
              type="text"
              {...guestRegister("name")}
              className="h-12 w-full rounded border  p-2 shadow"
              placeholder="Name"
            />
            {guestErrors.name &&
              typeof guestErrors.name.message === "string" && (
                <p className="text-customRed">{guestErrors.name.message}</p>
              )}

            <div className="flex gap-2">
              <div className="flex h-12 w-1/2 flex-col items-center justify-center  rounded border p-2 shadow">
                <select
                  {...guestRegister("sex")}
                  defaultValue={"Male"}
                  id="example-dropdown"
                  className=" w-full  "
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div>
                  {guestErrors.sex &&
                    typeof guestErrors.sex.message === "string" && (
                      <p className="text-customRed">
                        {guestErrors.sex.message}
                      </p>
                    )}
                </div>
              </div>

              <div className="h-full w-1/2">
                <input
                  {...guestRegister("age")}
                  type="number"
                  min={10}
                  max={30}
                  className="h-12 w-full  rounded border p-2 shadow"
                  placeholder="Age"
                />
                {guestErrors.age &&
                  typeof guestErrors.age.message === "string" && (
                    <p className="text-customRed">{guestErrors.age.message}</p>
                  )}
              </div>
            </div>

            <div className="flex gap-2">
              <div className="h-12 w-1/2">
                <input
                  {...guestRegister("email")}
                  type="text"
                  className="h-12 w-full  rounded border p-2 shadow"
                  placeholder="Email"
                />
                {guestErrors.email &&
                  typeof guestErrors.email.message === "string" && (
                    <p className="text-customRed">
                      {guestErrors.email.message}
                    </p>
                  )}
              </div>

              <div className="h-12 w-1/2">
                <input
                  {...guestRegister("phoneNumber")}
                  type="text"
                  className="h-12 w-full  rounded border p-2 shadow"
                  placeholder="Phone Number (09xxxxxxxxx)"
                />
                {guestErrors.phoneNumber &&
                  typeof guestErrors.phoneNumber.message === "string" && (
                    <p className="text-customRed">
                      {guestErrors.phoneNumber.message}
                    </p>
                  )}
              </div>
            </div>

            <p className="mt-12 font-bold italic text-primary">Email Content</p>

            <input
              {...guestRegister("subject")}
              type="text"
              className=" h-12 w-full rounded border  p-2 shadow"
              placeholder="Subject"
            />
            {guestErrors.subject &&
              typeof guestErrors.subject.message === "string" && (
                <p className="text-customRed">{guestErrors.subject.message}</p>
              )}
            <textarea
              {...guestRegister("body")}
              className=" w-full rounded border p-2 shadow "
              rows={10}
              placeholder="Body"
            />
            {guestErrors.body &&
              typeof guestErrors.body.message === "string" && (
                <p className="text-customRed">{guestErrors.body.message}</p>
              )}

            <button type="submit" className="btn-active px-20 py-3">
              Send Email
            </button>
          </form>
        </>
      )}
    </>
  );
};

export default EmailActivityCall;
