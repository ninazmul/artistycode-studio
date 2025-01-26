import { getRegistrationById } from "@/lib/actions/registration.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const VolunteerDetails = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const volunteer = await getRegistrationById(resolvedParams.id);

  if (!volunteer) {
    return <p>Volunteer not found</p>;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto bg-primary-50 bg-dotted-pattern bg-contain">
      <div className="flex flex-col items-center gap-2 justify-center">
        <h1 className="text-center text-2xl font-semibold">
          Islamic Education Australia
        </h1>
        <h2 className="text-center text-2xl font-semibold">
          Volunteer Application Form
        </h2>
        <p className="font-semibold text-sm">
          (In the name of Allah, the most gracious the most merciful)
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 justify-center my-6">
        <h3 className="font-semibold border border-black w-full text-center text-sm p-1 my-2">
          Part 1: Applicant’s Information
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4">
          <p className="flex items-center gap-2 w-full">
            First Name:{" "}
            <span className="border border-black flex-1 text-start text-sm p-1">
              {volunteer.firstName}
            </span>
          </p>
          <p className="flex items-center gap-2 w-full">
            Last Name:{" "}
            <span className="border border-black flex-1 text-start text-sm p-1">
              {volunteer.lastName}
            </span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4">
          <p className="flex items-center gap-2 w-full">
            Mobile:{" "}
            <span className="border border-black flex-1 text-start text-sm p-1">
              {volunteer.number}
            </span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4">
          <p className="flex items-center gap-2 w-full">
            Email:{" "}
            <span className="border border-black flex-1 text-start text-sm p-1">
              {volunteer.email}
            </span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4">
          <p className="flex items-center gap-2 w-full">
            Address:{" "}
            <span className="border border-black flex-1 text-start text-sm p-1">
              {volunteer.address}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 justify-center my-6">
        <h3 className="font-semibold border border-black w-full text-center text-sm p-1 my-2">
          Part 2: Emergency Contact
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4">
          <p className="flex items-center gap-2 w-full">
            Full Name:{" "}
            <span className="border border-black flex-1 text-start text-sm p-1">
              {volunteer.emergencyContactName}
            </span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4">
          <p className="flex items-center gap-2 w-full">
            Mobile:{" "}
            <span className="border border-black flex-1 text-start text-sm p-1">
              {volunteer.emergencyContactNumber}
            </span>
          </p>
          <p className="flex items-center gap-2 w-full">
            Relation with Applicant:{" "}
            <span className="border border-black flex-1 text-start text-sm p-1">
              {volunteer.emergencyContactRelation}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 justify-center my-6">
        <h3 className="font-semibold border border-black w-full text-center text-sm p-1 my-2">
          Part 3: Declaration
        </h3>
        <p className="font-semibold text-sm">
          (Please read, understand and agree following terms and conditions)
        </p>

        <ul className="flex flex-col mr-5 gap-2 text-xs">
          <li>
            I am applying to become a volunteer willingly and without any type
            of direct or indirect pressure.
          </li>
          <li>
            Once accepted, my volunteerism entitlements are not transferrable or
            transmittable to another person.
          </li>
          <li>
            OSMCI authority preserves the right to accept or decline my
            application without showing reason.
          </li>
        </ul>

        <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4 my-4">
          <div className="flex flex-wrap items-center gap-2 w-full">
            <span>
              I{" "}
              <span className="border border-black flex-1 text-start text-sm p-1">
                {volunteer.firstName} {volunteer.lastName}
              </span>{" "}
            </span>
            bare witness that there is no god but Allah and Muhammad صلى الله
            عليه وسلم is his slave and (last) prophet.
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-around w-full gap-4">
          <div className="flex items-center gap-2 w-full">
            Signature:{" "}
            <span className="border border-black flex-1 flex justify-center p-1">
              <Image
                src={volunteer.signature}
                alt="Signature"
                width={100}
                height={100}
              />
            </span>
          </div>
          <p className="flex items-center gap-2 w-full">
            Date:{" "}
            <span className="border border-black flex-1 text-start text-sm p-1">
              {formatDateTime(volunteer.date).dateOnly} -{" "}
              {formatDateTime(volunteer.date).timeOnly}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDetails;
