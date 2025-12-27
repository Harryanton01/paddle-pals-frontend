import { ErrorState } from "src/components/ErrorState";

export const NotFound = () => {
  const fakeError = { response: { status: 404 } };

  return <ErrorState error={fakeError} />;
};
