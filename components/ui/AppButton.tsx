import type { AnchorHTMLAttributes, ReactNode } from "react";
import { joinClasses } from "@/utils";

type AppButtonVariant = "filled" | "outlined" | "ghost";

interface AppButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: AppButtonVariant;
}

const baseClasses =
  "max-h-10.5 transition items-center w-auto inline-flex justify-center text-center rounded-[10px] text-base font-medium px-4.25 py-2.25 tracking-[0px] leading-6";

const variantClasses: Record<AppButtonVariant, string> = {
  filled:
    "bg-[#03bf99] hover:bg-[#00e4b4] text-[#2a206a] hover:text-[#2a206a] border border-transparent",
  outlined:
    "bg-transparent border-2 border-[#2a206a] text-[#2a206a] hover:bg-[#e9eaf6] hover:text-[#2a206a]",
  ghost:
    "bg-transparent border border-transparent text-[#2a206a] hover:text-[#2a206a] hover:underline",
};

const AppButton = ({
  children,
  variant = "filled",
  className,
  ...props
}: AppButtonProps) => {
  return (
    <a
      {...props}
      className={joinClasses(baseClasses, variantClasses[variant], className)}
    >
      {children}
    </a>
  );
};

export type { AppButtonProps, AppButtonVariant };
export default AppButton;
