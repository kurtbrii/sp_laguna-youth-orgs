import Link from "next/link";
import React, { useState } from "react";
import Navbar from "~/components/navbar";

const HowItWorks = () => {
  const [view, setView] = useState<string>("overview");

  return (
    <>
      <Navbar />
      <div className="mx-40 mb-10 flex flex-col  justify-center gap-4 p-4 font-custom-lexend text-customBlack-100">
        <select
          className={
            "mx-20 mb-6 mt-4 w-full self-center rounded-md border border-customBlack-100 px-2 py-2 text-sm font-bold text-customBlack-100  transition ease-in-out hover:bg-transparent focus:outline-none"
          }
          value={view}
          onChange={(e) => {
            setView(e.target.value);
          }}
        >
          {/* <option value="instructions">Instructions</option> */}
          <option value="overview">Overview</option>
          <option value="auth">Sign Up/Login</option>
          <option value="org">For Organizations</option>
          <option value="vol">For Volunteer</option>
        </select>

        {view === "instructions" && (
          <>
            <p>
              <span className="font-bold">Step 1.</span> Click the{" "}
              <span className="btn-active px-4 py-1">Get Started</span> button
              on the upper right part of the navigation bar and sign up as an
              organization.
            </p>

            <p>
              <span className="font-bold">Step 2.</span> Navigate the website.
              Try to add your past events and upcoming activities.
            </p>

            <p>
              <span className="font-bold">Step 3. </span>
              After navigating the website, kindly answer this 10-item{" "}
              <span>
                <Link
                  className="underline"
                  href="https://forms.gle/NNTJAomrsj1XQNG16"
                >
                  SUS questionnaire
                </Link>
              </span>
              . This questionnaire will only take 10 minutes to accomplish.
            </p>
          </>
        )}

        {view === "overview" && (
          <>
            <p>
              The{" "}
              <span className="text-gradient font-bold">
                Laguna Youth Organizations Hub{" "}
              </span>{" "}
              caters to three distinct user types—organizations, volunteers, and
              guests (participants)—each with specific roles within the platform
              tailored to their unique needs and contributions.
            </p>

            <p>
              <span className="font-bold">Youth organizations</span> can post
              their past events as well as future activities in the Hub. They
              can also partner with other organizations as well as collaborate
              with them.
            </p>

            <p>
              <span className="font-bold ">Volunteers</span> can join an
              organization as well as activities hosted by the organization.
            </p>

            <p>
              The <span className="font-bold ">guest view</span> will serve as a
              portal for users who are not yet signed in, allowing them to
              participate as attendees in the ”Call for Participants” section of
              the web app.
            </p>
          </>
        )}

        {view === "auth" && (
          <>
            <div>
              <p className="text-sm font-bold italic text-primary">Step 1</p>

              <p>
                Click the{" "}
                <span className="btn-active px-4 py-1">Get Started</span> button
                on the upper right part of the navigation bar.
              </p>
            </div>

            <div>
              <p className="text-sm font-bold italic text-primary">Step 2</p>
              <p>
                Select a provider (<span className="text-primary">Google</span>/
                <span className="text-secondary">Discord</span>).
              </p>

              <p className="mb-2 ml-3 mt-2">
                If the user already has an account in the Hub, they will be
                redirected to the homepage.
              </p>
              <p className="ml-3 mt-2">
                Otherwise, the user must register their account as an
                organization or as a volunteer by accomplishing a form on the
                website.
              </p>
            </div>
          </>
        )}

        {view === "org" && (
          <div className="flex flex-col gap-10">
            <section>
              <h1 className="font-custom-epilogue font-bold text-primary">
                Recent Events
              </h1>
              <p>Organizations can add, edit, and view past events.</p>
            </section>

            <section>
              <h1 className="font-custom-epilogue font-bold text-primary">
                Find Organizations
              </h1>
              <p>
                On this page, organizations can search for a specific
                organization. They can then send collaboration requests to
                another organization by filling out a form, which will be sent
                to that organization’s email.
              </p>
            </section>

            <section className="flex flex-col gap-5">
              <h1 className=" font-custom-epilogue font-bold text-primary">
                Get Involved Section
              </h1>

              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">Activities</h2>
                <p>
                  Organizations can post their upcoming activities. There will
                  be tags associated with these activities. Other organizations
                  can request for partnership if the “Partnership” tag is
                  available. The organization requesting shall fill out a form
                  on the platform, which will then be sent to the other
                  organization via email.
                </p>
              </div>

              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">
                  Pool of Speakers
                </h2>
                <p>
                  This page is dedicated to volunteers from different
                  organizations who can be tapped as speakers for various
                  events. Organizations can add and view all contact information
                  of these individuals as well as their advocacies.
                </p>
              </div>

              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">
                  PYDP Centers of Participation
                </h2>
                <p>
                  These are the advocacies of the organizations in various
                  sectors such as health, education, etc. Users can browse for
                  organizations according to the advocacy selected.
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-5">
              <h1 className="font-custom-epilogue font-bold text-primary">
                Manage Activities
              </h1>
              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">
                  Join Organizations Requests
                </h2>
                <p>
                  Organizations can view the list of volunteers who requested to
                  join them. They can accept or decline these volunteers.
                </p>
              </div>

              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">
                  Requests for Collaboration
                </h2>
                <p>
                  Organizations can view the list of other organizations who
                  requested to collaborate with them. They can accept or decline
                  these organizations.
                </p>
              </div>

              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">
                  Ongoing Activities
                </h2>
                <p>
                  Organizations can edit or delete activities. They can also
                  update the list of participants from each activity. Moreover,
                  they can accept or decline volunteers who wish to volunteer in
                  the activity. Lastly, they can update the list of
                  organizations who wish to partner with them in the said
                  activity.
                </p>
              </div>
            </section>
          </div>
        )}

        {view === "vol" && (
          <div className="flex flex-col gap-10">
            <section>
              <h1 className="font-custom-epilogue font-bold text-primary">
                Recent Events
              </h1>
              <p>Volunteers can view events posted by the organizations.</p>
            </section>

            <section>
              <h1 className="font-custom-epilogue font-bold text-primary">
                Find Organizations
              </h1>
              <p>
                On this page, volunteers can search for a specific organization.
                They can then send their request to join the organization by
                filling out a form, which will be sent to that organization’s
                email.
              </p>
            </section>

            <section className="flex flex-col gap-5">
              <h1 className=" font-custom-epilogue font-bold text-primary">
                Get Involved Section
              </h1>

              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">Activities</h2>
                <p>
                  Volunteers can view the activities posted by organizations.
                  There will be tags associated with these activities. They can
                  send requests to volunteer for the activity if the “Call for
                  Volunteers” option is available. They shall fill out a form on
                  the platform, which will then be sent to the organization via
                  email.
                </p>
              </div>

              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">
                  Pool of Speakers
                </h2>
                <p>
                  This page is dedicated to volunteers from different
                  organizations. Volunteers can view all contact information of
                  these individuals as well as their advocacies.
                </p>
              </div>

              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">
                  PYDP Centers of Participation
                </h2>
                <p>
                  These are the advocacies of the organizations in various
                  sectors such as health, education, etc. Users can browse for
                  organizations according to the advocacy selected.
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-5">
              <h1 className="font-custom-epilogue font-bold text-primary">
                Manage Activities
              </h1>
              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">
                  Join Organization Requests
                </h2>
                <p>
                  Volunteers can manage the list of youth organizations they
                  intend to join.
                </p>
              </div>

              <div className="ml-5">
                <h2 className="font-bold italic text-secondary">
                  Join Activity Requests
                </h2>
                <p>
                  Volunteers can manage the list of activities they intend to
                  volunteer for.
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default HowItWorks;
