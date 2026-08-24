import type { SpotKind } from "@perch/core";

/**
 * Sample marks so the app is explorable before Supabase is wired up.
 * `isConfigured` in src/supabase.ts decides whether these or real rows
 * are used — see the screens.
 */
export interface SampleMark {
  id: string;
  name: string;
  kind: SpotKind;
  lat: number;
  lng: number;
  image: string;
  who: string;
  caption: string;
  saves: number;
  isVideo: boolean;
  marks: number;
}

const IMG = (id: string) =>
  `https://d8j0ntlcm91z4.cloudfront.net/user_3GGqBW4zpaaDAVr4CQwHyT8geRQ/${id}`;

export const SAMPLE_MARKS: SampleMark[] = [
  {
    id: "1",
    name: "The one with the whole city in it",
    kind: "bench",
    lat: 38.7139,
    lng: -9.1394,
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3GGqBW4zpaaDAVr4CQwHyT8geRQ/hf_20260824_154126_ea2a1269-48dc-4854-91fa-b57eb4c658e9_min.webp",
    who: "marta.r",
    caption: "Go at seven. The whole hill turns orange and nobody else is up here.",
    saves: 214,
    isVideo: false,
    marks: 12,
  },
  {
    id: "2",
    name: "Ridge bench, last light",
    kind: "viewpoint",
    lat: 38.7218,
    lng: -9.1502,
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3GGqBW4zpaaDAVr4CQwHyT8geRQ/hf_20260824_164312_ac1ff28d-04e9-4a7a-b415-15aec8d786ff_min.webp",
    who: "fellrunner",
    caption: "Forty minutes up from the car park. Worth every one of them.",
    saves: 168,
    isVideo: false,
    marks: 7,
  },
  {
    id: "3",
    name: "Flat rock above the cloud",
    kind: "trail_rest",
    lat: 38.7076,
    lng: -9.1365,
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3GGqBW4zpaaDAVr4CQwHyT8geRQ/hf_20260824_164312_0ec2b755-dd79-4817-a7a7-b96bdaa0b9e2_min.webp",
    who: "tomaslx",
    caption: "Not a bench. Better than most benches.",
    saves: 91,
    isVideo: false,
    marks: 4,
  },
  {
    id: "4",
    name: "River wall, after work",
    kind: "bench",
    lat: 38.6968,
    lng: -9.1774,
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3GGqBW4zpaaDAVr4CQwHyT8geRQ/hf_20260824_164312_1c54099f-193a-4961-a785-be26af776441_min.webp",
    who: "ade.walks",
    caption: "Every evening this week. The light does something different each time.",
    saves: 77,
    isVideo: false,
    marks: 9,
  },
  {
    id: "5",
    name: "Nothing to see, worth it anyway",
    kind: "viewpoint",
    lat: 38.7331,
    lng: -9.1602,
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3GGqBW4zpaaDAVr4CQwHyT8geRQ/hf_20260824_164312_677fa363-cac0-4752-98de-f4409353446c_min.webp",
    who: "hollyfoot",
    caption: "Fog came in ten minutes after I sat down. Stayed anyway.",
    saves: 143,
    isVideo: false,
    marks: 3,
  },
  {
    id: "6",
    name: "Leaf bench, third week of October",
    kind: "bench",
    lat: 38.7285,
    lng: -9.1301,
    image:
      "https://d8j0ntlcm91z4.cloudfront.net/user_3GGqBW4zpaaDAVr4CQwHyT8geRQ/hf_20260824_164312_b636ebfc-0488-4d25-bc4a-38d8b85d0fde_min.webp",
    who: "j.okonkwo",
    caption: "Only good for about two weeks a year. This is the week.",
    saves: 58,
    isVideo: false,
    marks: 6,
  },

  // A denser cluster around the default centre, so the map has something to
  // show before any real data exists.
  {
    id: "7",
    name: "Two benches facing each other",
    kind: "bench",
    lat: 38.7191,
    lng: -9.1421,
    image: IMG("hf_20260824_164312_b636ebfc-0488-4d25-bc4a-38d8b85d0fde_min.webp"),
    who: "marta.r",
    caption: "Good for an argument you want to finish sitting down.",
    saves: 34,
    isVideo: false,
    marks: 2,
  },
  {
    id: "8",
    name: "Wall by the tram stop",
    kind: "trail_rest",
    lat: 38.7247,
    lng: -9.1338,
    image: IMG("hf_20260824_164312_1c54099f-193a-4961-a785-be26af776441_min.webp"),
    who: "ade.walks",
    caption: "Not a bench but everyone sits on it anyway.",
    saves: 61,
    isVideo: false,
    marks: 5,
  },
  {
    id: "9",
    name: "Shade at two in the afternoon",
    kind: "bench",
    lat: 38.7164,
    lng: -9.1489,
    image: IMG("hf_20260824_164312_2173926a-6f55-47b7-a55d-a0924c2a569c_min.webp"),
    who: "j.okonkwo",
    caption: "The only shaded one on this whole stretch.",
    saves: 88,
    isVideo: false,
    marks: 4,
  },
  {
    id: "10",
    name: "Steps above the square",
    kind: "viewpoint",
    lat: 38.7269,
    lng: -9.1447,
    image: IMG("hf_20260824_164312_0ec2b755-dd79-4817-a7a7-b96bdaa0b9e2_min.webp"),
    who: "hollyfoot",
    caption: "Sit on the third step up. Any higher and you lose the river.",
    saves: 112,
    isVideo: false,
    marks: 8,
  },
  {
    id: "11",
    name: "Bench nobody uses",
    kind: "bench",
    lat: 38.7118,
    lng: -9.1352,
    image: IMG("hf_20260824_164312_677fa363-cac0-4752-98de-f4409353446c_min.webp"),
    who: "tomaslx",
    caption: "Faces a wall. Still quiet, still yours.",
    saves: 19,
    isVideo: false,
    marks: 1,
  },
];
