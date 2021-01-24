/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-implied-eval */
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { memo, ReactNode, useCallback, useMemo, useState } from "react";
import { Plus } from "react-feather";

import { genTypeTitle, makeWardPath } from "../lib/utils";

type TreeProps = {
  open?: boolean;
  content?: ReactNode;
  children?: ReactNode;
};

function Tree({ children, content, open }: TreeProps) {
  const [curOpen, setCurOpen] = useState(open !== undefined ? open : false);
  const toggle = useCallback(() => {
    setCurOpen(!curOpen);
  }, [curOpen, setCurOpen]);

  return (
    <div className="relative whitespace-nowrap overflow-hidden align-middle overflow-ellipsis pt-1 ml-2">
      <div
        className="inline-flex items-center cursor-pointer shine"
        onClick={toggle}
      >
        <Plus
          className=" align-middle w-4 h-4 mr-2"
          style={{ opacity: children ? 1 : 0.3 }}
        />
        <span className="align-middle">{content}</span>
      </div>
      <Transition
        as="div"
        className="ml-2 border-l border-dashed border-current"
        show={curOpen}
        enter="transition ease-in-out duration-100"
        enterFrom="transform opacity-0 translate-x-2 h-0"
        enterTo="transform opacity-100 h-auto"
        leave="transition ease-in-out duration-100"
        leaveFrom="transform opacity-100 h-auto"
        leaveTo="transform opacity-0 translate-x-2 h-0"
      >
        {children}
      </Transition>
    </div>
  );
}

type PathTreeType = Record<
  string,
  Record<string, Record<string, { no: number; name: string }[]>>
>;

type PathTreeViewProps = {
  lsgs: RRT.LsgdType[];
};

function PathTree({ lsgs }: PathTreeViewProps) {
  const paths: PathTreeType = useMemo(() => {
    const p: PathTreeType = {};
    for (const lsg of lsgs) {
      if (lsg.wards.length === 0) {
        continue;
      }
      const f = lsg.wards.map((w) => ({
        no: w.wardNo,
        name: w.name,
      }));
      if (p[lsg.district]) {
        if (p[lsg.district][lsg.type]) {
          p[lsg.district][lsg.type] = {
            ...p[lsg.district][lsg.type],
            [lsg.lsg]: f,
          };
        } else {
          p[lsg.district][lsg.type] = {
            [lsg.lsg]: f,
          };
        }
      } else {
        p[lsg.district] = {
          [lsg.type]: { [lsg.lsg]: f },
        };
      }
    }
    return p;
  }, [lsgs]);

  return (
    <>
      {Object.keys(paths).map((d) => (
        <Tree key={d} content={d}>
          {Object.keys(paths[d]).map((t) => (
            <Tree
              key={`${d}-${t}`}
              content={genTypeTitle(t as RRT.LsgdVariant)}
            >
              {Object.keys(paths[d][t]).map((l) => (
                <Tree key={`${d}-${t}-${l}`} content={l}>
                  <div className="flex flex-col">
                    {paths[d][t][l].map((w) => (
                      <Link
                        key={`${d}-${t}-${l}-${w.no}`}
                        href={makeWardPath(
                          {
                            district: d,
                            type: t,
                            lsg: l,
                          } as RRT.LsgdType,
                          w.no
                        )}
                      >
                        <a className="shine ml-4">{`${w.no} - ${w.name}`}</a>
                      </Link>
                    ))}
                  </div>
                </Tree>
              ))}
            </Tree>
          ))}
        </Tree>
      ))}
    </>
  );
}

export default memo(PathTree);
