import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useGroupCasinoList = () => {
    const [groupCasinoList, setGroupCasinoList] = useState({});

    const dispatch = useDispatch();
    const { getInternationalGroupCasinoListData } = useSelector(state => state.user);

    const cosinoGroupList = JSON.parse(localStorage.getItem('cosinoGroupList'))

    useEffect(() => {
        if (cosinoGroupList) {
            setGroupCasinoList(cosinoGroupList);
        }
    }, [getInternationalGroupCasinoListData]);

    return groupCasinoList;
};

export default useGroupCasinoList;