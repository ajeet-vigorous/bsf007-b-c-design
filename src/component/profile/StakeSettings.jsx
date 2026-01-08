import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { userUpdate } from '../../redux/reducers/user_reducer';
import { domainName } from '../../config/Auth';
import { message } from 'antd';

const StakeSettings = () => {
    const dispatch = useDispatch();
    const [formattedButtonValues, setFormattedButtonValues] = useState([]);
    const Id = JSON.parse(localStorage.getItem(`user_info_${domainName}`))?.data?.userId;

    useEffect(() => {
        let betChipsDataItems = JSON.parse(localStorage.getItem('clientbetChipsData'));
        let betChips = betChipsDataItems || {};

        const keyValues1 = Object.entries(betChips).map(([key, value]) => ({
            key,
            value: parseInt(value),
        }));
        setFormattedButtonValues(keyValues1);
    }, []);

    const handleKeyChange = (index, newKey) => {
        const updatedValues = [...formattedButtonValues];
        updatedValues[index].key = newKey;
        setFormattedButtonValues(updatedValues);
    };


    const handleValueChange = (index, newValue) => {
        if (/^\d*$/.test(newValue) && (newValue === '' || newValue.length <= 10)) {
            const updatedValues = [...formattedButtonValues];
            updatedValues[index].value = newValue === '' ? '' : Number(newValue);
            setFormattedButtonValues(updatedValues);
        } else {
            console.error('Please enter a valid integer value with up to 10 digits.');
        }
    };

    const handleSubmit = () => {
        const data = {};
        formattedButtonValues.forEach((item) => {
            data[item.key] = item.value;
        });
        let reqData = {
            userId: Id,
            betChipsData: data,
        };
        dispatch(userUpdate(reqData)).then((response) => {
            message.success(response?.payload?.message);
        });
        localStorage.setItem('clientbetChipsData', JSON.stringify(data));
    };


    return (
        <div className='w-full bg-white '>
            <div className="w-full text-sm text-left sm:px-4 my-4">
                <div>
                    <div className="grid grid-cols-1 gap-4">
                        {formattedButtonValues?.reduce((rows, item, index) => {
                            if (index % 2 === 0) {
                                rows.push(formattedButtonValues.slice(index, index + 2));
                            }
                            return rows;
                        }, []).map((pair, rowIndex) => (
                            <div key={rowIndex} className="grid grid-cols-2 sm:gap-10 gap-4">
                                {pair.map((item, itemIndex) => (
                                    <div key={`${rowIndex}-${itemIndex}`} className='border-2 rounded-[.375rem] border-[var(--secondary)] flex'>
                                        <div className='w-[70px]'>
                                            <input
                                                type="text"
                                                value={item.key}
                                                disabled
                                                className="text-center py-1.5 px-2 bg-[var(--secondary)] text-white w-[70px] text-[13px] font-[500]"
                                                onChange={(e) => {
                                                    handleKeyChange(rowIndex * 2 + itemIndex, e.target.value);
                                                    e.stopPropagation();
                                                }}
                                            />
                                        </div>
                                        <input
                                            type="number"
                                            value={item.value}
                                            className="w-full py-1.5 px-4 bg-white border-[var(--secondary)] text-[16px] focus:border-blue-400"
                                            onChange={(e) => {
                                                handleValueChange(rowIndex * 2 + itemIndex, e.target.value);
                                                e.stopPropagation();
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className=''>
                        <button
                            type='button'
                            className="hover:bg-[var(--primary)] bg-[var(--secondary)] border rounded-[.375rem] w-full my-4 py-2"
                            onClick={handleSubmit}
                        >
                            <span className="text-white w-full font-[600] tracking-wider text-[15px] px-[19px] py-[20px]">
                                SAVE
                            </span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default StakeSettings;