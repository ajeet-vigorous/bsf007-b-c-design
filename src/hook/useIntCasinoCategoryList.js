import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { intCasinoCateogeoryWiseList } from "../redux/reducers/casino.reducer";

const useIntCasinoCategoryList = () => {
    const dispatch = useDispatch();
    const intCasinoCateogeoryWiseListData = useSelector(
        (state) => state.casino.intCasinoCateogeoryWiseListData
    );

    const [localData, setLocalData] = useState(null);
    const [hasFetchedSubCategory, setHasFetchedSubCategory] = useState(false);

    // Step 1: Load from localStorage or dispatch main category fetch
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("intCasinoList"));
        if (storedData && Array.isArray(storedData) && storedData.length > 0) {
            setLocalData(storedData);
        } else if (!intCasinoCateogeoryWiseListData || intCasinoCateogeoryWiseListData.length === 0) {
            const reqData = {
                cateogeoryType: "main",
                status: 1
            };
            dispatch(intCasinoCateogeoryWiseList(reqData));
        }
    }, [dispatch]);

    // Step 2: Watch for main category data and save to localStorage
    useEffect(() => {
        if (intCasinoCateogeoryWiseListData && intCasinoCateogeoryWiseListData.length > 0 && !localData) {
            setLocalData(intCasinoCateogeoryWiseListData);
            localStorage.setItem("intCasinoList", JSON.stringify(intCasinoCateogeoryWiseListData));
        }
    }, [intCasinoCateogeoryWiseListData, localData]);

    // Step 3: After localData is available, fetch sub category
    useEffect(() => {
        if (localData && !hasFetchedSubCategory) {
            const reqDataSub = {
                cateogeoryType: "sub",
                cateogeoryId: localData[3]?._id || 0
            };
            dispatch(intCasinoCateogeoryWiseList(reqDataSub));
            setHasFetchedSubCategory(true);
        }
    }, [localData, hasFetchedSubCategory, dispatch]);

    return { intCasinoCateogeoryWiseListData };
};

export default useIntCasinoCategoryList;
