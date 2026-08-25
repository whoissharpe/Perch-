import Svg, { Circle, Path } from "react-native-svg";

/**
 * A small hand-drawn icon set rather than a library, so the stroke weight
 * matches the Perch mark — 1.6 at 24px, rounded caps, nothing thicker.
 */
export type IconName =
  | "map"
  | "feed"
  | "plus"
  | "bookmark"
  | "person"
  | "close"
  | "camera"
  | "video"
  | "pin"
  | "chevron"
  | "search";

const PATHS: Record<IconName, React.ReactNode> = {
  map: (
    <>
      <Path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
      <Path d="M9 4v13.5M15 6.5V20" />
    </>
  ),
  feed: (
    <>
      <Path d="M4 5.5h16M4 12h16M4 18.5h10" />
    </>
  ),
  plus: <Path d="M12 5.5v13M5.5 12h13" />,
  bookmark: <Path d="M6 3.5h12v17l-6-4.5-6 4.5z" />,
  person: (
    <>
      <Circle cx="12" cy="8" r="3.6" />
      <Path d="M4.8 20.2a7.4 7.4 0 0 1 14.4 0" />
    </>
  ),
  close: <Path d="M6 6l12 12M18 6L6 18" />,
  camera: (
    <>
      <Path d="M3.5 8.5h3.2l1.4-2h7.8l1.4 2h3.2v11H3.5z" />
      <Circle cx="12" cy="13.6" r="3.5" />
    </>
  ),
  video: (
    <>
      <Path d="M3.5 6.5h11v11h-11z" />
      <Path d="M14.5 10.5l6-3v9l-6-3z" />
    </>
  ),
  pin: (
    <>
      <Path d="M12 21.5s7-6.4 7-11.2A7 7 0 0 0 5 10.3c0 4.8 7 11.2 7 11.2z" />
      <Circle cx="12" cy="10" r="2.6" />
    </>
  ),
  chevron: <Path d="M9 5l7 7-7 7" />,
  search: (
    <>
      <Path d="M11 4.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z" />
      <Path d="M15.8 15.8L20 20" />
    </>
  ),
};

export function Icon({
  name,
  color,
  size = 23,
}: {
  name: IconName;
  color: string;
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name]}
    </Svg>
  );
}
