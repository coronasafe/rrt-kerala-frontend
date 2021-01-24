import { LSGD_VARIANT } from "./constants";

export const getLsgs = async (): Promise<RRT.LsgdType[]> =>
  (await fetch("https://rrt.coronasafe.live/rrt.json")).json();

export type ParamsType = {
  type: string;
  district: string;
  lsg: string;
  ward?: string;
};

export const parametrify = (lsg: RRT.LsgdType): ParamsType => ({
  district: lsg.district.toLowerCase(),
  lsg: lsg.lsg.replace(/\s/gu, "_").toLowerCase(),
  type: lsg.type.toLocaleLowerCase(),
});

export const genTypeTitle = (type: RRT.LsgdVariant): string =>
  `${type}${
    type === LSGD_VARIANT.Block ||
    type === LSGD_VARIANT.Grama ||
    type === LSGD_VARIANT.District
      ? " Panchayat"
      : ""
  }`;

export const genLsgTitle = (lsg: string, type: RRT.LsgdVariant): string =>
  `${lsg} ${genTypeTitle(type)}`;

export const genLsgTitleFull = (lsgd: RRT.LsgdType): string =>
  `${genLsgTitle(lsgd.lsg, lsgd.type)}, ${lsgd.district} District`;

export const makeWardPath = (lsg: RRT.LsgdType, ward: number) => {
  const params = parametrify(lsg);
  return `/${params.district}/${params.type}/${params.lsg}/${ward}`;
};
