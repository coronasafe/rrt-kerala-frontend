import { Transition } from "@headlessui/react";
import fuzzysort from "fuzzysort";
import { useRouter } from "next/router";
import { useMemo, useState, useCallback } from "react";

import { LsgdVariant } from "../lib/constants";
import { parametrify, SearchItemType } from "../lib/utils";

type SearchProps = {
  searchList: SearchItemType[];
  limit?: number;
  selected: null | SearchItemType;
  setSelected: React.Dispatch<React.SetStateAction<SearchItemType>>;
};

export default function Search({
  searchList,
  limit = 5,
  selected,
  setSelected,
}: SearchProps) {
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState(selected ? selected.name : "");
  const filteredSearchList = useMemo(
    () =>
      fuzzysort
        .go(query, searchList, {
          key: "name",
          limit,
          threshold: -50,
        })
        .filter((a) => a.obj.name !== query)
        .map((a) => a.obj),
    [query]
  );

  const handleSelectedFocus = useCallback(() => setFocused(true), [setFocused]);
  const handleQueryChange = useCallback((e) => setQuery(e.target.value), [
    setQuery,
  ]);
  const handleSelectedChange = useCallback(
    (a) => () => {
      setQuery(a.name);
      setSelected(a);
      setFocused(false);
    },
    [setSelected, setQuery, setFocused]
  );

  const handleSubmit = useCallback(
    (e) => {
      const selectedWard = Number.parseInt(e.target.textContent);
      const split = selected.name.split(", ");
      const params = parametrify({
        district: split[1].replace(" District", "").trim(),
        lsg: split[0]
          .replace(" District", "")
          .replace(" Grama Panchayat", "")
          .replace(" Block Panchayat", "")
          .replace(" Municipality", "")
          .replace(" Corporation", "")
          .trim(),
        type:
          (split[0].match(/District/gu) || []).length > 1
            ? LsgdVariant.District
            : split[0].includes("Grama")
            ? LsgdVariant.Grama
            : split[0].includes("Block")
            ? LsgdVariant.Block
            : split[0].includes("Municipality")
            ? LsgdVariant.Municipality
            : LsgdVariant.Corporation,
      } as RRT.LsgdType);
      return router.push(
        `/${params.district}/${params.type}/${params.lsg}/${selectedWard}`
      );
    },
    [router, selected, setSelected, setQuery]
  );

  return (
    <div className="flex flex-col text-sm sm:text-xl w-full relative">
      <input
        placeholder={selected === null ? "Search for a LSG" : selected.name}
        className="rounded-lg px-2 border border-bunker-600 dark:border-transparent dark:bg-bunker-600 appearance-none outline-none h-12 w-full"
        type="text"
        value={query}
        onChange={handleQueryChange}
        onFocus={handleSelectedFocus}
      />
      <Transition
        as="ul"
        className="space-y-1 absolute mt-14 w-full bg-white dark:bg-bunker-800 rounded-lg"
        show={focused && filteredSearchList.length > 0}
        enter="transition ease-in-out duration-100"
        enterFrom="transform opacity-0 -translate-y-16"
        enterTo="transform opacity-100"
        leave="transition ease-in-out duration-1000"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0 -translate-y-16"
      >
        {filteredSearchList.map((a) => (
          <li key={a.name} className="flex flex-1">
            <button
              className={`bg-white appearance-none focus:outline-none rounded-lg px-2 flex flex-1 border border-bunker-600 dark:border-transparent hover:bg-green-500 ${
                selected && selected.name === a.name
                  ? "bg-green-500"
                  : "dark:bg-bunker-600"
              }`}
              type="button"
              onClick={handleSelectedChange(a)}
            >
              {a.name}
            </button>
          </li>
        ))}
      </Transition>
      <Transition
        as="div"
        className="space-y-1 w-full flex flex-col text-xs sm:text-sm mt-1"
        show={!!selected}
        enter="transition ease-in-out duration-100"
        enterFrom="transform opacity-0 scale-y-0"
        enterTo="transform opacity-100 scale-y-100"
        leave="transition ease-in-out duration-1000"
        leaveFrom="transform opacity-100 scale-y-100"
        leaveTo="transform opacity-0 -translate-y-16 scale-y-0"
      >
        {selected && selected.wards.length > 0 ? (
          <>
            <span>Available wards:</span>
            <div className="flex flex-wrap gap-1">
              {selected.wards.map((ward) => (
                <button
                  key={ward}
                  className="bg-white appearance-none focus:outline-none rounded-lg px-2 flex border border-bunker-600 dark:border-transparent hover:bg-green-500 dark:bg-bunker-600"
                  type="button"
                  onClick={handleSubmit}
                >
                  {ward}
                </button>
              ))}
            </div>
          </>
        ) : (
          <span>No available wards</span>
        )}
      </Transition>
    </div>
  );
}
