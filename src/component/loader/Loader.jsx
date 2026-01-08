/* eslint-disable react/prop-types */
// import loaderimg from "../../"
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
export default function Loader({ active }) {
    return (
        <>
            {active ? <>  <div className="fixed  top-0 left-0 w-full h-full flex justify-center items-center z-50" >
                {/* <img className="w-20" src={"/images/loader.gif"} /> */}
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </div>
            </> : null
            }
        </>
    );
}