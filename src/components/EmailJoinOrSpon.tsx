/* eslint-disable @typescript-eslint/no-explicit-any */
import emailjs from "@emailjs/browser";
import React, { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { formSchema } from "~/utils/schemaValidation";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";

type FormFields = z.infer<typeof formSchema>;

const EmailJoinOrSpon = ({
  orgId,
  organizationEmail,
  volunteerLoggedIn,
  organizationLoggedIn,
  sessionEmail,
  role,
}: any) => {
  const router = useRouter();

  const volJoinOrg = api.volJoinOrg.createVolJoinOrg.useMutation();

  const orgSponOrg = api.orgSponsorOrg.createOrgSponOrg.useMutation();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const orgVolOnSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(data);
    if (role === "ORGANIZATION") {
      orgSponOrg.mutate({
        orgRequesting: organizationLoggedIn?.id,
        orgAccepting: orgId,
        subject: getValues("subject"),
        body: getValues("body"),
      });
    } else {
      volJoinOrg.mutate({
        orgId: orgId,
        volId: volunteerLoggedIn?.id,
        subject: getValues("subject"),
        body: getValues("body"),
      });
    }

    void emailjs.send(
      "service_sb8pzif",
      "template_pm7npxj",
      {
        vol_name:
          role === "ORGANIZATION"
            ? organizationLoggedIn.orgName
            : `${volunteerLoggedIn?.firstName} ${volunteerLoggedIn?.middleInitial} ${volunteerLoggedIn?.lastName} ${volunteerLoggedIn?.suffix}`,
        subject: getValues("subject"),
        body: getValues("body"),
        from_email: sessionEmail,
        to_email: organizationEmail,
      },
      "AxPqfUq-9Oy9tdLJv",
    );

    alert("Request Successul");

    void router.reload();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(orgVolOnSubmit)}
        className="mx-40 mb-5 mt-5 flex flex-col gap-4 text-sm"
      >
        <input
          {...register("subject")}
          type="text"
          className="h-12 w-full rounded border  p-2 shadow"
          placeholder="Subject"
        />
        {errors.subject && (
          <p className="text-customRed">{errors.subject.message}</p>
        )}

        <textarea
          {...register("body")}
          className=" w-full rounded border p-2 shadow "
          rows={10}
          placeholder="Body"
        />
        {errors.body && <p className="text-customRed">{errors.body.message}</p>}

        <button type="submit" className="btn-active px-20 py-3">
          Send Email
        </button>
      </form>
    </>
  );
};

export default EmailJoinOrSpon;
