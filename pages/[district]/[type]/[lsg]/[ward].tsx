import { InferGetStaticPropsType } from "next";
import Head from "next/head";

import Search from "../../../../components/search";
import WardInfo from "../../../../components/wardinfo";
import {
  generateSearchList,
  genLsgTitleFull,
  getLsgs,
  parametrify,
  ParamsType,
  useLSGSelected,
} from "../../../../lib/utils";

export default function WardPage({
  district,
  lsg,
  type,
  ward,
  searchList,
  initSelected,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [selected, setSelected] = useLSGSelected(initSelected);

  return (
    <>
      <Head>
        <title>
          RRT Directory - {ward.wardNo}. {ward.name},{initSelected.name}
        </title>
        <meta
          name="description"
          content={`RRT Directory of ${ward.wardNo}. ${ward.name},${initSelected.name}, Kerala`}
        />
      </Head>
      <Search
        searchList={searchList}
        selected={selected}
        setSelected={setSelected}
      />
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
  const searchList = generateSearchList(lsgs);
  return {
    props: {
      district: lsg.district,
      lsg: lsg.lsg,
      type: lsg.type,
      ward,
      searchList,
      initSelected: searchList.find(
        (s) => s.name === genLsgTitleFull(lsg.lsg, lsg.type, lsg.district)
      ),
    },
  };
}
