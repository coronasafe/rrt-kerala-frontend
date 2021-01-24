import { InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useMemo } from "react";

import Search from "../../../../components/search";
import WardInfo from "../../../../components/wardinfo";
import {
  genLsgTitleFull,
  getLsgs,
  parametrify,
  ParamsType,
} from "../../../../lib/utils";

export default function WardPage({
  district,
  lsg,
  type,
  ward,
  initSelected,
  lsgs,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const title = useMemo(() => genLsgTitleFull(initSelected), [initSelected]);

  return (
    <>
      <Head>
        <title>
          RRT Directory - {ward.wardNo}. {ward.name}, {title}
        </title>
        <meta
          name="description"
          content={`RRT Directory of ${ward.wardNo}. ${ward.name},${title}, Kerala`}
        />
      </Head>
      <Search lsgs={lsgs} showModal initSelected={initSelected} />
      <WardInfo district={district} lsg={lsg} type={type} ward={ward} />
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

export async function getStaticProps({ params }: { params: ParamsType }) {
  const lsgs = await getLsgs();
  const lsg = lsgs.find((lsg) => {
    const _lsg = parametrify(lsg);
    return (
      _lsg.district === params.district &&
      _lsg.lsg === params.lsg &&
      _lsg.type === params.type
    );
  });
  const ward = lsg.wards.find((w) => w.wardNo === Number.parseInt(params.ward));
  return {
    props: {
      district: lsg.district,
      lsg: lsg.lsg,
      type: lsg.type,
      ward,
      lsgs,
      initSelected: lsgs.find((s) => s === lsg),
    },
  };
}
