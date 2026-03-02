import Image from "next/image";
import AppButton from "@/components/ui/AppButton";

type Props = {};

const HeaderNavs = [
  {
    name: "Platform",
  },
  {
    name: "Solutions",
  },
  {
    name: "Developers",
  },
  {
    name: "Resources",
  },
  {
    name: "Company",
  },
];

const Header = (props: Props) => {
  return (
    <header className="border-b bg-[#f5f6f7] border-[#ceccec] z-9999 w-full sticky top-0">
      <div className="container w-full lg:max-w-210 xl:max-w-261 px-8 lg:px-0 mx-auto">
        <nav className="relative z-10 flex-1 justify-center mx-auto flex items-center h-15 md:h-22">
          <a href="/">
            <Image
              src="/logo/logo.svg"
              alt="Marqeta Logo"
              width={170}
              height={24}
              className="w-34 h-5 md:w-42.5 md:h-6"
            />
          </a>
          <div className="flex grow justify-center">
            <div className="relative">
              <ul className="group flex-1 list-none items-center justify-center space-x-1 hidden md:flex">
                {HeaderNavs.map((nav) => (
                  <li key={nav.name} className="">
                    <button className="group inline-flex h-10 w-max items-center justify-center md:px-3 xl:px-5 py-2 text-sm transition-colors focus:underline focus:outline-none disabled:pointer-events-none group text-[#33298e] hover:text-[#2a206a] hover:underline">
                      {nav.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="items-center gap-2 hidden md:flex">
            <AppButton href="" variant="ghost" className="text-sm rounded-lg py-0 leading-8">
              Sign in
            </AppButton>
            <AppButton href="" variant="filled">
              Contact us
            </AppButton>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
