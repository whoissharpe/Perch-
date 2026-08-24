import { Redirect } from "expo-router";

/**
 * The centre tab never renders — its tab button opens the capture modal.
 * This exists only so expo-router has a route to hang that button on.
 */
export default function MarkPlaceholder() {
  return <Redirect href="/" />;
}
