import CoronaSafeLogo from "../assets/coronaSafeLogo.svg";

const links = [
  {
    href: "https://github.com/coronasafe/rrt-kerala-frontend",
    label: "Github",
  },
  {
    href: "https://github.com/coronasafe/rrt-kerala-frontend/issues",
    label: "Issues",
  },
  {
    href: "https://coronasafe.network/volunteer",
    label: "Volunteer",
  },
  {
    href: "mailto:info@coronasafe.network",
    label: "Contact",
  },
];

export default function Footer() {
  return (
    <footer className="flex flex-col sticky inset-x-0 bottom-0 space-y-2 mt-auto">
      <div className="flex text-sm space-x-2">
        {links.map((l) => (
          <a key={l.label} className="shine" href={l.href}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="flex flex-col">
        <a
          href="https://coronasafe.network/"
          className="inline-flex text-xs space-x-1 shine"
        >
          <span>Copyright © 2021</span>
          <CoronaSafeLogo className="h-4" aria-hidden="true" />
        </a>
        <a
          href="https://github.com/coronasafe/rrt-kerala-frontend/blob/master/LICENSE"
          className="text-xxs shine"
        >
          Released under the MIT License
        </a>
      </div>
    </footer>
  );
}
