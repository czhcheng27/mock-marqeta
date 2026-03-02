import Image from "next/image";

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
            <a
              href=""
              className="link Inherit font-medium transition flex items-center px-4.25 py-0 text-sm rounded-lg leading-8! text-[#2a206a]"
            >
              Sign in
            </a>
            <a
              href=""
              className="transition items-center w-auto inline-flex justify-center text-center rounded-[10px] text-base font-medium bg-[#03bf99]  hover:bg-[#00e4b4] text-[#2a206a] hover:text-[#2a206a] px-4.25 py-2.25 tracking-[0px] leading-6!"
            >
              Contact us
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
