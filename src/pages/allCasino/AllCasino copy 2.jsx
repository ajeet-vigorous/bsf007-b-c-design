import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCateogeory,
  getInternationalGroupCasinoList,
} from "../../redux/reducers/user_reducer";
import Loader from "../../component/loader/Loader";
import SlotBanner from "../../component/SlotBanner/SlotBanner";
import Login from "../../component/login/Login";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function AllCasino() {
  const [categoryData, setCategoryData] = useState([]);        // Main categories
  const [subCategory, setSubCategory] = useState([]);          // Sub categories
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(""); // Tracks which sub-cat is active
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, getInternationalGroupCasinoListData } = useSelector(
    (state) => state.user
  );

  const sliderRefs = React.useRef([]);
  const DEFAULT_STATIC_CATEGORY_ID = "67e1ac55ba22d539e4d29dd4";

  const handleResponseCasino = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoginModal(true);
      return;
    }
    if (product?.gameId) {
      navigate(`/iframe-casino-new/${product?.providerName}/${product?.gameId}`);
    }
  };

  // Step 1: Load Main Categories
  useEffect(() => {
    dispatch(getCateogeory({ status: 1, cateogeoryType: "main" })).unwrap()
      .then((res) => setCategoryData(res?.data || []))
      .catch((err) => console.log(err));
  }, [dispatch]);

  // Step 2: Load Sub-categories of Static Category + Auto-select first sub-category
  const loadSubCategories = async (categoryId) => {
    try {
      const res = await dispatch(
        getCateogeory({
          status: 1,
          cateogeoryType: "sub",
          cateogeoryId: categoryId,
        })
      ).unwrap();

      setSubCategory(res?.data || []);

      // Auto select first sub-category & fetch its data
      if (res?.data?.length > 0) {
        const firstSubCat = res.data[0];
        setSelectedSubCategoryId(firstSubCat._id);
        dispatch(getInternationalGroupCasinoList({ subCateogeoryId: firstSubCat._id }));
      }
    } catch (err) {
      console.log("Sub-category load error:", err);
    }
  };

  // Step 3: On page load → Load static category's sub-categories
  useEffect(() => {
    if (categoryData.length > 0) {
      const staticCat = categoryData.find((c) => c._id === DEFAULT_STATIC_CATEGORY_ID) || categoryData[0];
      loadSubCategories(staticCat._id);
    }
  }, [categoryData]);


  // Step 4: Main Category Click
  const handleMainCategoryClick = (item) => {
    loadSubCategories(item._id);
  };

  // Step 5: Sub-category Click
  const handleSubCategoryClick = (subCatId) => {
    setSelectedSubCategoryId(subCatId);
    dispatch(getInternationalGroupCasinoList({ subCateogeoryId: subCatId }));
  };


  console.log(getInternationalGroupCasinoListData, "getInternationalGroupCasinoListData");
  

  // Search Filter
  const filteredGames = getInternationalGroupCasinoListData?.subCateogeoryId?.filter((item) =>
    item?.gameName?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Check if we should show slider design
  const isAllCategoryView = () => {
    const selectedSubCat = subCategory.find(cat => cat._id === selectedSubCategoryId);
    return selectedSubCat?.cateogeoryName === "all" && selectedSubCat?.cateogeoryType === "sub";
  };

  // Extract categories from filteredGames
  const categoriesFromGames = () => {
    const categoryMap = {};
    filteredGames.forEach((item) => {
      if (item.category && !categoryMap[item.category]) {
        categoryMap[item.category] = {
          name: item.category,
          icon: item.categoryIcon || item.urlThumb,
        };
      }
    });
    return Object.values(categoryMap);
  };

  const categoriesList = categoriesFromGames();

  const scroll = (index, direction) => {
    const ref = sliderRefs.current[index];
    if (ref) ref.scrollBy({ left: direction === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <>
      {isLoginModal && <Login onClose={() => setIsLoginModal(false)} />}

      <section className="w-full h-full bg-white">
      <div className="w-full min-h-screen max-w-[890px] mx-auto px-2 md:px-4">
        <SlotBanner />

        <div className="relative block md:hidden ">
            <input
              type="text"
              placeholder="Search Games"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=" py-1 ps-3 border my-3 border-gray-400 bg-transparent h-[35px] rounded w-full text-sm text-black focus:outline-none"
            />
          </div>

        {/* Main Category Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-gray-300 text-[12px] my-4">
          {categoryData?.map((item) => {
            const isActive = subCategory.some((sub) => sub.parentId === item._id || sub.cateogeoryId === item._id);
            return (
              <div
                key={item._id}
                onClick={() => handleMainCategoryClick(item)}
                className="flex-shrink-0 cursor-pointer"
              >
                <div
                  className={`px-5 py-1 rounded-t border flex gap-0.5 ${
                    isActive ? "bg-[var(--primary)] text-white" : "text-black"
                  }`}
                >
                  {item.cateogeoryImg && <img src={item.cateogeoryImg} width={10} height={10}/>}
                  {item.cateogeoryName}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sub Category Tabs + Search */}
        <div className="flex text-[12px] justify-between border-b border-gray-300 items-center my-4">
          <div className="flex overflow-x-auto whitespace-nowrap">
            
            {subCategory?.map((cat, idx) => (
              <button
                key={cat._id}
                onClick={() => handleSubCategoryClick(cat._id)}
                className={`px-6 py-1 rounded-t-[5px] uppercase ${
                  selectedSubCategoryId === cat._id
                    ? "bg-[var(--primary)] text-white"
                    : "bg-transparent text-black"
                }`}
              >
                {cat.cateogeoryName || cat.name}
              </button>
            ))}
          </div>

          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search Games"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 py-1 ms-3 border border-gray-400 bg-transparent h-[35px] rounded min-w-[200px] text-sm text-black focus:outline-none"
            />
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Show Slider Design ONLY when viewing "all" subcategory */}
            {isAllCategoryView() && categoriesList.length > 0 ? (
              <div className="space-y-6 md:px-0 px-1 pt-1 pb-4">
                {categoriesList.map((cat, cidx) => {
                  const catGames = filteredGames?.filter?.(
                    (g) => g?.category === cat?.name
                  ) || [];

                  if (!catGames?.length) return null;

                  return (
                    <div key={cidx} className="my-3 relative">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-2 px-1">
                        <h2 className="text-[15px] font-semibold text-black tracking-wide flex items-center gap-2">
                          {cat?.name}
                        </h2>
                        <div className="flex items-center gap-2">
                          <button className="text-[12px] text-[var(--secondary)] bg-[var(--primary)] py-0.5 leading-0 px-2 rounded hover:underline">
                            View All
                          </button>
                          <div className="flex gap-1">
                            <button
                              onClick={() => scroll(cidx, "left")}
                              className="p-1 !bg-[var(--primary)] rounded text-white hover:bg-gray-300"
                            >
                              <FaChevronLeft size={14} />
                            </button>
                            <button
                              onClick={() => scroll(cidx, "right")}
                              className="p-1 !bg-[var(--primary)] rounded text-white hover:bg-gray-300"
                            >
                              <FaChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Slider */}
                      <div
                        ref={(el) => (sliderRefs.current[cidx] = el)}
                        className="flex gap-1 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
                      >
                        {catGames.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex-shrink-0  cursor-pointer hover:scale-105 transition-transform duration-300"
                            onClick={() => handleResponseCasino(item)}
                          >
                            <div className="relative w-[140px] md:w-[180px]">
                              <img
                                src={item?.urlThumb || item?.image}
                                alt={item?.gameName}
                                className="w-full h-[85px] md:h-[130px] "
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Grid Layout for other categories */
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-5 gap-0.5 md:px-0 px-1 pt-1 pb-4">
                {filteredGames.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      onClick={() => handleResponseCasino(item)}
                      className="relative w-full border border-[--primary] cursor-pointer hover:scale-105 transition-transform duration-300"
                    >
                      <div className="relative">
                        <img
                          src={item?.urlThumb || item?.image}
                          alt={item?.gameName}
                          className="w-full  h-[85px] md:h-[130px] "
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      </section>
    </>
  );
}

export default AllCasino;
