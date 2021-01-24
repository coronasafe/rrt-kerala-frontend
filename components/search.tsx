import { Transition } from "@headlessui/react";
import fuzzysort from "fuzzysort";
import Link from "next/link";
import { useMemo, useState, useCallback } from "react";
import { Menu, X } from "react-feather";
import { Scrollbar } from "react-scrollbars-custom";
import { useMeasure } from "react-use";

import { genLsgTitleFull, makeWardPath } from "../lib/utils";
import PathTree from "./pathtree";

type SelectModalProps = {
  lsgs: RRT.LsgdType[];
};

function SelectModal({ lsgs }: SelectModalProps) {
  const [showModal, setShowModal] = useState(false);
  const handleModalButton = useCallback(() => setShowModal(!showModal), [
    showModal,
    setShowModal,
  ]);
  const [ref, { height }] = useMeasure();

  return (
    <>
      <button
        type="button"
        className="absolute right-0 appearance-none outline-none h-12 focus:outline-none pr-2 shine"
        onClick={handleModalButton}
      >
        <Menu className="w-6" />
      </button>
      <Transition
        as="div"
        className="fixed top-0 right-0 z-40 h-screen sm:max-w-sm w-full p-4"
        show={showModal}
        enter="transition ease-in-out duration-200"
        enterFrom="transform translate-x-full"
        enterTo="transform"
        leave="transition ease-in-out duration-200"
        leaveFrom="transform"
        leaveTo="transform translate-x-full"
      >
        <div className="flex flex-col h-full w-full card p-2 dark:border-green-500 text-xs sm:text-base overflow-hidden">
          <div className="flex justify-between mb-1 items-center">
            <span className="font-bold uppercase">District Menu</span>
            <button
              type="button"
              className="appearance-none outline-none focus:outline-none shine"
              onClick={handleModalButton}
            >
              <X className="w-6" />
            </button>
          </div>
          <div ref={ref} className="flex flex-col flex-1">
            <Scrollbar style={{ height }}>
              <PathTree lsgs={lsgs} />
            </Scrollbar>
          </div>
        </div>
      </Transition>
    </>
  );
}

type SearchProps = {
  lsgs: RRT.LsgdType[];
  limit?: number;
  showModal?: boolean;
  initSelected?: RRT.LsgdType;
};

export default function Search({
  lsgs,
  limit = 5,
  showModal = false,
  initSelected = null,
}: SearchProps) {
  const [selected, setSelected] = useState<null | RRT.LsgdType>(initSelected);
  const [focused, setFocused] = useState(false);
  const title = useMemo(() => (selected ? genLsgTitleFull(selected) : ""), [
    selected,
  ]);
  const [query, setQuery] = useState(title);
  const filteredSearchList = useMemo(
    () =>
      fuzzysort
        .go(query, lsgs, {
          keys: ["lsg", "type", "district"],
          limit,
        })
        .map((a) => a.obj),
    [query]
  );

  const handleSelectedFocus = useCallback(() => setFocused(true), [setFocused]);
  const handleQueryChange = useCallback((e) => setQuery(e.target.value), [
    setQuery,
  ]);
  const handleSelectedChange = useCallback(
    (a: RRT.LsgdType) => () => {
      setQuery(genLsgTitleFull(a));
      setSelected(a);
      setFocused(false);
    },
    [setSelected, setQuery, setFocused]
  );

  return (
    <>
      <div className="flex flex-col text-sm sm:text-xl w-full relative z-30">
        <input
          placeholder={selected === null ? "Search for a LSG" : title}
          className="capitalize card pl-2 pr-10 appearance-none outline-none h-12 w-full border focus:border-green-500"
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={handleSelectedFocus}
        />
        {showModal && <SelectModal lsgs={lsgs} />}
        <Transition
          as="ul"
          className="space-y-1 absolute mt-14 w-full card border-none"
          show={focused && filteredSearchList.length > 0}
          enter="transition ease-in-out duration-100"
          enterFrom="transform opacity-0 -translate-y-16"
          enterTo="transform opacity-100"
          leave="transition ease-in-out duration-1000"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0 -translate-y-16"
        >
          {filteredSearchList.map((a, i) => (
            <li key={i} className="flex flex-1">
              <button
                className={`card capitalize appearance-none focus:outline-none px-2 flex flex-1 hover:bg-green-500 truncate ${
                  selected && selected === a ? "bg-green-500" : ""
                }`}
                type="button"
                onClick={handleSelectedChange(a)}
              >
                {genLsgTitleFull(a)}
              </button>
            </li>
          ))}
        </Transition>
        <Transition
          as="div"
          className="flex flex-col text-xs sm:text-sm mt-1 px-1 space-y-1 w-full"
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
                  <Link
                    key={ward.wardNo}
                    href={makeWardPath(selected, ward.wardNo)}
                  >
                    <a className="appearance-none focus:outline-none px-2 flex card shine">
                      {ward.wardNo}
                    </a>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <span>No available wards</span>
          )}
        </Transition>
      </div>
    </>
  );
}
