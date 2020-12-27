import fuzzysort from "fuzzysort";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { ArrowRight } from "react-feather";

import { parametrify, SearchItemType } from "../lib/utils";

type SearchProps = {
  searchList: SearchItemType[];
  limit?: number;
};

export default function Search({ searchList, limit = 5 }: SearchProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<null | SearchItemType>(null);
  const [selectedWard, setSelectedWard] = useState(1);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const filteredSearchList = useMemo(
    () =>
      fuzzysort.go(query, searchList, {
        key: "name",
        limit,
        threshold: -50,
      }),
    [query]
  );

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2 h-12 flex-auto overflow-hidden">
        <input
          placeholder={selected === null ? "Search" : selected.name}
          className={`${
            selected === null ? "" : "w-10"
          } flex flex-auto rounded-lg px-2 border border-bunker-600 dark:border-transparent dark:bg-bunker-600 text-xl appearance-none outline-none`}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
        />
        {selected && (
          <>
            <select
              className="rounded-lg px-2 dark:bg-bunker-600 border border-bunker-600 dark:border-transparent"
              onBlur={(e) =>
                setSelectedWard(Number.parseInt(e.currentTarget.value))
              }
            >
              {selected.wards.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <button
              className="rounded-lg px-2 dark:bg-bunker-600 border border-bunker-600 dark:border-transparent"
              type="button"
              onClick={() => {
                const split = selected.name.split(", ");
                const params = parametrify({
                  district: split[1],
                  lsg: split[0],
                } as RRT.LsgdType);
                // eslint-disable-next-line no-void
                void router.push(
                  `/${params.district}/${params.lsg}/${selectedWard}`
                );
                setSelected(null);
                setQuery("");
              }}
            >
              <ArrowRight />
            </button>
          </>
        )}
      </div>
      {focused && (
        <ul className="mt-2 space-y-1">
          {filteredSearchList.map((a) => (
            <li key={a.obj.name} className="flex flex-1">
              <button
                className={`appearance-none focus:outline-none rounded-lg px-2 flex flex-1 border border-bunker-600 dark:border-transparent hover:bg-green-500 ${
                  selected && selected.name === a.obj.name
                    ? "bg-green-500"
                    : "dark:bg-bunker-600"
                }`}
                type="button"
                onClick={() => {
                  setSelected(a.obj);
                  setSelectedWard(a.obj.wards[0]);
                }}
              >
                {a.obj.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
