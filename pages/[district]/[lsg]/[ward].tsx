import { InferGetStaticPropsType } from "next";
import Head from "next/head";

import Search from "../../../components/search";
import WardInfo from "../../../components/wardinfo";
import {
  generateSearchList,
  genLsgTitle,
  getLsgs,
  getWardName,
  parametrify,
} from "../../../lib/utils";

export default function WardPage({
  district,
  lsg,
  type,
  ward,
  searchList,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>{`${genLsgTitle(lsg, type)}, ${district} District`}</title>
      </Head>
      <div className="container flex flex-col space-y-3">
        <Search searchList={searchList} />
        <div className="dark:bg-bunker-600 border border-bunker-600 dark:border-transparent rounded-lg p-2 min-w-max">
          <WardInfo district={district} lsg={lsg} type={type} ward={ward} />
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const lsgs = await getLsgs();
  const paths = [];
  for (const lsg of lsgs) {
    if (lsg.wards.length === 0) {
      continue;
    }
    paths.push(
      ...lsg.wards.map((w) => ({
        params: { ...parametrify(lsg), ward: w.wardNo.toString() },
      }))
    );
  }
  return { paths, fallback: false };
}

export async function getStaticProps({
  params,
}: {
  params: {
    district: string;
    lsg: string;
    ward: string;
  };
}) {
  const lsgs = await getLsgs();
  const lsg = lsgs.find((lsg) => {
    const _lsg = parametrify(lsg);
    return _lsg.district === params.district && _lsg.lsg === params.lsg;
  });
  const _ward = lsg.wards.find(
    (w) => w.wardNo === Number.parseInt(params.ward)
  );
  const ward = {
    ..._ward,
    name: await getWardName(lsg.district, lsg.lsg, _ward.wardNo),
  };
  const searchList = generateSearchList(lsgs);
  return {
    props: {
      district: lsg.district,
      lsg: lsg.lsg,
      type: lsg.type,
      ward,
      searchList,
    },
  };
}
