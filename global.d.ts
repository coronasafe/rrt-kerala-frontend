declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

declare namespace RRT {
  type ContactType = {
    name: string;
    contact: string;
  };

  type WardType = {
    wardNo: number;
    medicalOfficer: ContactType;
    ashaWorker: ContactType;
    lsgdWardMember: ContactType;
    kudumbaShree: ContactType;
    anganawadiTeacher: ContactType;
  };

  enum LsgdVariant {
    District = "District",
    Grama = "Grama",
    Block = "Block",
    Muncipality = "Muncipality",
    Corporation = "Corporation",
  }

  type LsgdType = {
    district: string;
    lsg: string;
    wards: WardType[];
    type: LsgdVariant;
  };
}
