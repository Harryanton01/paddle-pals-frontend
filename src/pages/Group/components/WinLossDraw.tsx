import clsx from "clsx";
import { match } from "ts-pattern";

type ResultProps = {
  result: "W" | "L" | "D";
  withBg?: boolean;
  prefix?: React.ReactNode;
};

function getColorClasses({ result, withBg = false }: ResultProps) {
  return match(result)
    .with("W", () =>
      clsx(
        "text-green-400",
        withBg &&
          "bg-green-500/20 border-green-500 rounded-md w-7 h-6 flex items-center justify-center"
      )
    )
    .with("L", () =>
      clsx(
        "text-red-400",
        withBg &&
          "bg-red-500/20 border-red-500 rounded-md w-7 h-6 flex items-center justify-center"
      )
    )
    .with("D", () =>
      clsx(
        "text-yellow-300",
        withBg &&
          "bg-yellow-700 border-yellow-600 rounded-md w-7 h-6 flex items-center justify-center"
      )
    )
    .exhaustive();
}

export const WinLossDraw = ({
  result,
  withBg = false,
  prefix,
}: ResultProps) => {
  return (
    <div className={getColorClasses({ result, withBg })}>
      {prefix}
      {result}
    </div>
  );
};
