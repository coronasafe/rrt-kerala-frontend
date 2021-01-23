import { useState } from "react";

import { LsgdVariant } from "./constants";

export const getLsgs = async (): Promise<RRT.LsgdType[]> =>
  (await fetch("https://rrt.coronasafe.live/rrt.json")).json();

export type ParamsType = {
  type: string;
  district: string;
  lsg: string;
  ward?: string;
};

export const parametrify = (lsg: RRT.LsgdType) => ({
  district: lsg.district.toLowerCase(),
  lsg: lsg.lsg.replace(/\s/gu, "_").toLowerCase(),
  type: lsg.type.toLocaleLowerCase(),
});

export type SearchItemType = {
  name: string;
  wards: number[];
};

export const generateSearchList = (lsgs: RRT.LsgdType[]): SearchItemType[] => {
  const searchList: SearchItemType[] = [];
  for (const l of lsgs) {
    const d: SearchItemType = {
      name: genLsgTitleFull(l.lsg, l.type, l.district),
      wards: l.wards.map((w) => w.wardNo),
    };
    if (searchList.findIndex((t) => t.name === d.name) === -1) {
      searchList.push(d);
    }
  }
  return searchList;
};

export const genLsgTitle = (lsg: string, type: RRT.LsgdVariant): string =>
  `${lsg} ${type}${
    type === LsgdVariant.Block ||
    type === LsgdVariant.Grama ||
    type === LsgdVariant.District
      ? " Panchayat"
      : ""
  }`;

export const genLsgTitleFull = (
  lsg: string,
  type: RRT.LsgdVariant,
  district: string
): string => `${genLsgTitle(lsg, type)}, ${district} District`;

export const useLSGSelected = (selected: null | SearchItemType) =>
  useState<null | SearchItemType>(selected);
