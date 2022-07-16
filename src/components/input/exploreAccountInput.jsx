import React, {useState, useEffect, useRef} from 'react'
import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next';


const ExploreAccountInput = (props) => {

    const [t] = useTranslation();

    const [searchValue, setSearchValue] = useState('')

    const searchRef = useRef(null);

    useEffect(() => {

    }, [props]);

    const handleSearchChange = event => {
        setSearchValue(event.target.value);
    }

    const renderSearchBtn = () => {
        if (searchRef && searchRef.current && searchRef.current.value) {
            return <Link to={`/${searchRef.current.value}.bit`}>🔍 {t('accountlist.explore-it')}</Link>
        }

        return <span>🔍 {t('accountlist.explore-it')}</span>
    }

  
    return (<div className='flex flex-col md:flex-row place-content-center gap-4'>
                <span className='text-center mt-1'>{t("accountlist.explore-other-bit")}</span>
                <div className="flex flex-row gap-2 place-content-center">
                    <input className='w-[200px] h-[28px] enabled:hover:border-gray-400 rounded-full px-3 bg-box  shadow-[0_0_10px_0px_rgba(0,0,0,0.3)] ' ref={searchRef} type="text" placeholder='Search here...' onChange={handleSearchChange}/>
                    <button className='group w-[28px] h-[28px] bg-[#00DF9B] ml-2 rounded-full text-center text-[#fff] text-[14px] group-hover:text-black group-hover:bg-[#aabb00] font-semibold'>
                        {renderSearchBtn()}
                    </button>
                </div>
            </div>
    )
}

export default ExploreAccountInput