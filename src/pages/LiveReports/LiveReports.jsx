import { useEffect, useState } from "react";

const LiveReports = () => {
  const data = [
    { id: 1, name: "Bac Bo", user: "an****n*er", win: "₹2000" },
    { id: 2, name: "Crazy777", user: "s*m*i**k*t", win: "₹1755" },
    { id: 3, name: "Super Sic Bo", user: "su**j***2", win: "₹2180" },
    { id: 4, name: "Aviator", user: "k**a**3", win: "₹1800" },
    { id: 5, name: "Andar Bahar", user: "g*n*s**2*4", win: "₹1000" },
    { id: 1, name: "Bac Bo", user: "an****n*er", win: "₹2000" },
    { id: 2, name: "Crazy777", user: "s*m*i**k*t", win: "₹1755" },
    { id: 3, name: "Super Sic Bo", user: "su**j***2", win: "₹2180" },
    { id: 4, name: "Aviator", user: "k**a**3", win: "₹1800" },
    { id: 5, name: "Andar Bahar", user: "g*n*s**2*4", win: "₹1000" },
    { id: 5, name: "Andar Bahar", user: "g*n*s**2*4", win: "₹1000" },
    { id: 1, name: "Bac Bo", user: "an****n*er", win: "₹2000" },
    { id: 2, name: "Crazy777", user: "s*m*i**k*t", win: "₹1755" },
    { id: 3, name: "Super Sic Bo", user: "su**j***2", win: "₹2180" },
    { id: 2, name: "Crazy777", user: "s*m*i**k*t", win: "₹1755" },
    { id: 3, name: "Super Sic Bo", user: "su**j***2", win: "₹2180" },
    { id: 2, name: "Crazy777", user: "s*m*i**k*t", win: "₹1755" },
    { id: 3, name: "Super Sic Bo", user: "su**j***2", win: "₹2180" },
    { id: 2, name: "Crazy777", user: "s*m*i**k*t", win: "₹1755" },
    { id: 3, name: "Super Sic Bo", user: "su**j***2", win: "₹2180" },
    { id: 2, name: "Crazy777", user: "s*m*i**k*t", win: "₹1755" },
    { id: 3, name: "Super Sic Bo", user: "su**j***2", win: "₹2180" },
  ];

  const duplicatedData = [...data, ...data];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        // If we're at the first item, go to the last (for downward scroll)
        if (prev <= 0) return data.length - 1;
        return prev - 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [data.length]);

return (
  <>
  
      <div className="w-full bg-[#e5e7eb] rounded overflow-hidden">
      <div className="flex bg-[var(--primary)] text-[--secondary] text-[12px] font-bold px-2 rounded-t">
        <div className="flex-1 text-left p-2.5">Daily Wins</div>
        <div className="flex-1 text-left p-2.5">Winner</div>
        <div className="flex-1 text-right p-2.5">Winnings</div>
      </div>

      <div className="h-[450px] overflow-hidden relative">
        <div
          className="transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateY(-${index * 40}px)`,
          }}
        >
          {duplicatedData.map((item, index) => (
            <div
              key={index}
              className="flex text-[12px] items-center bg-[#e5e7eb] border-b border-gray-300 py-2 px-2"
            >
              <div className="flex-1 font-semibold text-left">{item.name}</div>
              <div className="flex-1 text-left">
                <span className="bg-[var(--primary)] text-[--secondary] px-1.5 py-0.5 rounded">
                  {item.user}
                </span>
              </div>
              <div className="flex-1 text-right text-green-600 font-medium text-[14px]">
                {item.win}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
  )
}

export default LiveReports



  {/* <div className="md:w-full rounded my-4">
      <div className="w-full mx-auto bg-gray-200 rounded">
        <div className="flex bg-[var(--primary)] text-[--secondary] rounded-t text-[12px] font-bold px-2">
          <div className="flex-1 text-left p-2.5">Daily Wins</div>
          <div className="flex-1 text-left p-2.5">Winner</div>
          <div className="flex-1 text-right p-2.5">Winnings</div>
        </div>
        <div className="overflow-hidden w-full px-2 h-[450px]">
            <div className="animate-slideUp space-y-2">
              
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/dc.svg"/><span className="truncate">Bac Bo</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-skin-sportsHeaderBg tems-center  px-1.5 py-0.5 rounded capitalize font-medium bg-[var(--primary)] text-[--secondary]">an****n*er</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹2000</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/jili.svg"/><span className="truncate">Crazy777</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-medium">s*m*i**k*t</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹1755</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/dc.svg"/><span className="truncate">Super Sic Bo</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-medium">su**j***2</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹2180</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/spribe1.svg"/><span className="truncate">Aviator</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-medium">k**a**3</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹1800</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/spribe1.svg"/><span className="truncate">Aviator</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-mediu bg-[var(--primary)] text-[--secondary]">k****23</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹3540</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/spribe1.svg"/><span className="truncate">Aviator</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-mediu bg-[var(--primary)] text-[--secondary]">k***1*3</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹2472</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/universe.svg"/><span className="truncate">ANDAR BAHAR - A</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-medium">g*n*s**2*4</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹1000</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/dc.svg"/><span className="truncate">Super Sic Bo</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-mediu bg-[var(--primary)] text-[--secondary]">s*****992</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹35840</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/spribe1.svg"/><span className="truncate">Aviator</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-medium">l**s*m*1*3</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹1180</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/dc.svg"/><span className="truncate">Super Sic Bo</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-medium">s**a*1**2</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹1300</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/spribe1.svg"/><span className="truncate">Aviator</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-mediu bg-[var(--primary)] text-[--secondary]">k****23</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹3275</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/dc.svg"/><span className="truncate">Super Sic Bo</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-skin-sportsHeaderBg tems-center  px-1.5 py-0.5 rounded capitalize font-mediu bg-[var(--primary)] text-[--secondary]">s****19*2</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹1940</div>
              </div>
              <div className="flex gap-1 text-[12px] py-2 items-center border-b border-gray-300 bg-gray-200 dark:bg-skin-sportsHeaderBg transition-all duration-300  animate-slidedownallrows ">
                <div className="flex-1 w-full max-w-[140px]  md:max-w-full truncate text-left px-2.5 capitalize pr-1">
                  <div className="truncate flex gap-1 font-semibold items-center"><img className="w-7 noradius" alt="" src="/providers/dc.svg"/><span className="truncate">Super Sic Bo</span></div>
                </div>
                <div className="flex-1 w-full max-w-[140px] md:max-w-full truncate rounded text-left text-[--secondary]"><span className="bg-[var(--primary)] text-[--secondary] tems-center  px-1.5 py-0.5 rounded capitalize font-medium">s*r*j***2</span></div>
                <div className="flex-1 w-full text-right text-[14px] px-2.5 text-green-600 font-medium">₹13560</div>
              </div>
              
            </div>
        </div>
      </div>
    </div> */}


    