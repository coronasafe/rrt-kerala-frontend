import { Districts, LsgdVariant } from "./constants";

export const getLsgs = async (): Promise<RRT.LsgdType[]> =>
  (await fetch("https://rrt.coronasafe.live/rrt.json")).json();

export const parametrify = (lsg: RRT.LsgdType) => ({
  district: lsg.district.toLowerCase(),
  lsg: lsg.lsg.replace(/\s/gu, "_").toLowerCase(),
});

export const getWardName = async (
  district: string,
  lsgName: string,
  wardNo: number
): Promise<string> => {
  const res = await fetch(
    `https://careapi.coronasafe.in/api/v1/district/${Districts[district]}/get_all_local_body/`
  );
  const lsgs = await res.json();
  const lsg = lsgs.find(({ name }) =>
    name.startsWith(lsgName === "Uragam" ? "Oorakam" : lsgName)
  );
  const ward = lsg.wards.find(({ number }) => number === wardNo);
  if (ward === undefined) {
    return "";
  }
  return ward.name
    .toLowerCase()
    .split(" ")
    .map((w: string) => w.replace(w[0], w[0].toUpperCase()))
    .join(" ");
};

export type SearchItemType = {
  name: string;
  wards: number[];
};

export const generateSearchList = (lsgs: RRT.LsgdType[]): SearchItemType[] => {
  const searchList: SearchItemType[] = [];
  for (const l of lsgs) {
    if (l.wards.length === 0) {
      continue;
    }
    const d: SearchItemType = {
      name: `${l.lsg}, ${l.district}`,
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
