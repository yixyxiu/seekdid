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

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            let value = getValidInput();
            if (value.length > 3) {
                let url = `/${value}.bit`;
                document.location.href = url;
                document.location.rel = "noopener noreferrer";
            }
        }
    };

    const renderSearchBtn = () => {
        let value = getValidInput();
        if (value.length > 0) {
            return <Link to={`/${value}.bit`}>🔍 {t('accountlist.explore-it')}</Link>
        }

        return <span>🔍 {t('accountlist.explore-it')}</span>
    }

    const getValidInput = () => {
        if (searchRef && searchRef.current) {
            let value = searchRef.current.value.replace(/\s*/g,"");

            return value;
        }

        return "";
    }

    const renderSearchLink = () => {
        let value = getValidInput();
        if (value.length > 3) {
            return <a className='group pt-1 w-[28px] h-[28px] bg-[#00DF9B] ml-2 rounded-full text-center text-[#fff] text-[14px] group-hover:text-black group-hover:bg-[#aabb00] font-semibold' href={`/${value.trim()}.bit`} rel="noopener noreferrer">
                🔍 {t('accountlist.explore-it')}
            </a>
        //    return <a to={`/${searchRef.current.value}.bit`}>🔍 {t('accountlist.explore-it')}</a>
        }

        return <span className='group w-[28px] pt-1 h-[28px] bg-[#00DF9B] ml-2 rounded-full text-center text-[#fff] text-[14px] group-hover:text-black group-hover:bg-[#aabb00] font-semibold'>🔍 {t('accountlist.explore-it')}</span>
    }

  
    return (<div className='flex flex-col md:flex-row place-content-center gap-4'>
                <span className='text-center mt-1'>{t("accountlist.explore-other-bit")}</span>
                <div className="flex flex-row gap-2 place-content-center">
                    <div className='relative w-[200px]'>
                        <input className='w-[200px] h-[28px] border-gray-400 rounded-full pl-3 pr-10 bg-box shadow-[0_0_10px_0px_rgba(0,0,0,0.3)] ' 
                        ref={searchRef} type="text" placeholder={t('accountlist.explore-input-placeholder')} 
                        onChange={handleSearchChange} onKeyDown={handleKeyDown}/>
                        <div className="absolute top-0.5 right-3 width-[30px]">
                            <span className='text-[#00DF9B]'>.bit</span>
                        </div>
                    </div>
                    {renderSearchLink()}
                    {/*<button className='group w-[28px] h-[28px] bg-[#00DF9B] ml-2 rounded-full text-center text-[#fff] text-[14px] group-hover:text-black group-hover:bg-[#aabb00] font-semibold'>
                        {renderSearchBtn()}
                    </button> 理想情况是走Link，减少页面加载，不过遗留页面底部白屏的问题，当上一个账号数量多，而下一个账号不足一页的时候出现此bug，等之后再解决*/}
                </div>
            </div>
    )
}

export default ExploreAccountInput