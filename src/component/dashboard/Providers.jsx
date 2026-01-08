// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import LoginPopUp from "../LoginPopUp/LoginPopUp";
// import Login from "../login/Login";

// const providers = [
//   {
//     "name": "EZUGI",
//     "image": "/casino-providers/ezugi-casino.webp"
//   },
//   {
//     "name": "DC",
//     "image": "/casino-providers/dc-casino.webp"
//   },
//   {
//     "name": "AWC",
//     "image": "/casino-providers/awc-casino.webp"
//   },
//   {
//     "name": "KINGMIDAS",
//     "image": "/casino-providers/kingmidas-casino.webp"
//   },
//   {
//     "name": "BETGAMES",
//     "image": "/casino-providers/betgames-casino.webp"
//   },
//   {
//     "name": "SUNO",
//     "image": "/casino-providers/suno-casino.webp"
//   },
//   {
//     "name": "CRASH88",
//     "image": "/casino-providers/crash88-casino.webp"
//   },
//   {
//     "name": "SAP",
//     "image": "/casino-providers/sap-casino.webp"
//   },
//   {
//     "name": "JiLi",
//     "image": "/casino-providers/jili-casino.webp"
//   },
//   {
//     "name": "EVOLUTION",
//     "image": "/casino-providers/evolution-casino.webp"
//   },
//   {
//     "name": "RG",
//     "image": "/casino-providers/rg-casino.webp"
//   }
// ];

// function Providers({ filterSection, name, providersData }) {
//   const navigate = useNavigate();
  
//   const ProvidersList = providers || providersData;
//   const [logniModal, setLogniModal] = useState(false);

//   const token = localStorage.getItem("token");

//   const handleLoginModal = () => {
//     if (!localStorage.getItem("token")) {
//       setLogniModal(true);
//     }
//   };

//   return (
//     <div>
//       {logniModal && (
//               <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[99]" onClose={() => setLogniModal(false)}>
//                 <Login onClose={() => setLogniModal(false)} />
//               </div>
//             )}
//       <div className=" mx-2 mb-8 ">
//         <div>
//           <div className="text-[18px] font-bold my-3 text-[#001F3F] text-center">CASINO GAME PROVIDERS</div>
//         </div>

//         <div className="max-w-3xl mx-auto grid lg:grid-cols-4 md:grid-cols-3  grid-cols-3 gap-2 mt-0.5">
//           {ProvidersList?.map((item, idx) => (
//             <div key={idx} className="!w-auto">
//               {token ? <a href={`/casino-list-by-providername/${item.name}`} className="block">
//                 <div className="text-gray-300 font-bold text-xs">
//                   <img 
//                     src={item.image} 
//                     alt={item.name} 
//                     className="object-cover rounded-[5px]" 
//                   />
//                 </div>
//               </a> : <div onClick={handleLoginModal} className="block cursor-pointer">
                
//                 <div className="text-gray-300 font-bold text-xs">
//                   <img 
//                     src={item.image} 
//                     alt={item.name} 
//                     className="object-cover rounded-[5px]" 
//                   />
//                 </div>
            
//             </div>}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Providers;

















import { useNavigate } from "react-router-dom";


function Providers({ name, data }) {
    const navigate = useNavigate();

   const handleResponseCasino = (product) => {
   navigate(`/casino?name=${product?.category}&gameName=all`);

    };


    return (
         <section>
            <div className="pt-1">
              
                <div className="text-white text-[16px] font-bold leading-none px-3 h-[29px] flex justify-start items-center uppercase bg-[var(--primary)]">
                    <h2 className="textAnime tracking-tight">{name}</h2>
                </div>
                <div className="grid md:grid-cols-4 grid-cols-3 gap-1 py-0.5">
      {data?.sort((a, b) => a.position - b.position)?.map((item, idx) => (
        <div
          key={idx}
          onClick={() => handleResponseCasino(item)}
          className="relative cursor-pointer"
        >
          <div className="w-full ">
            <img
              src={`https://speedcdn.io/${item?.url_thumb}`}
              alt={item?.name}
              className="w-full h-full"
            />
             
          </div>

         
        </div>
      ))}
    </div>
            </div>
        </section>
    );
}

export default Providers;