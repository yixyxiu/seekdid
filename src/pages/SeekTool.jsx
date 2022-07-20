import React, { useRef, useState } from 'react'

import TextArea from 'antd/lib/input/TextArea';
import { CSVLink } from "react-csv";
import Dropdown from '../components/dropdown/Dropdown';
import DropdownMenu from '../components/dropdown/DropdownMenu';
import SeekTextArea from '../components/textarea/SeekTextArea';
import BitRegisterSearchResultList from '../components/list/bitRegisterSearchResultList';

import { numberFormatter } from '../utils/helper';
import { useTranslation } from 'react-i18next';

import dasData from '../utils/bitModalMgr'

import './SeekTool.css'

const SeekTool = () => {
    const [t] = useTranslation();
    const [searchStatusFilter, setSearchStatusFilter] = useState({status: '-1'});
    const [searchResult, setSearchResult] = useState([]);

    const searchEditRef = useRef(null);
    
    let wordList = [];
    const search_filter_config = [
        {
            "name":"search.filter-all-account",
            "status":'-1',
            "iconClass":"fa fa-list-ul dropdown-icon-fa"
        },
        {
            "name":"search.filter-available",
            "status":'0',
            "iconClass":"fa fa-check-circle dropdown-icon-fa"
        },
        {
            "name":"search.filter-not-yet-open-account",
            "status":'3',
            "iconClass":"fa fa-lock dropdown-icon-fa"
        },
        {
            "name":"search.filter-registered",
            "status":'4',
            "iconClass":"fa fa-registered dropdown-icon-fa"
        },
        {
            "name":"search.filter-reserved-account",
            "status":'5',
            "iconClass":"fa fa-certificate dropdown-icon-fa"
        }
    ]

    const top_categories_config = [
        {
            "name":"search.10k-club",
            "file":"4number.json"
        },
        {
            "name":"search.0x99-club",
            "file":"0x99.json"
        },
        {
            "name":"search.0x999-club",
            "file":"0x999.json"
        },
        {
            "name":"search.date-club",
            "file":"dateMMDD.json"
        },
        {
            "name":"search.time-club",
            "file":"time00h00.json"
        }
    ]

    /*
    const search_filter_config = [
        {
            "name":"search.filter-all-account",
            "status":'-1',
            "iconClass":"fa fa-list-ul dropdown-icon-fa"
        },
        {
            "name":"search.filter-available",
            "status":'0',
            "iconClass":"fa fa-check-circle dropdown-icon-fa"
        },
        {
            "name":"search.filter-release-soon",
            "status":'1',
            "iconClass":"fa fa-calendar dropdown-icon-fa"
        },
        {
            "name":"search.filter-on-sale",
            "status":'2',
            "iconClass":"fa fa-usd dropdown-icon-fa"
        },
        {
            "name":"search.filter-not-yet-open-account",
            "status":'3',
            "iconClass":"fa fa-lock dropdown-icon-fa"
        },
        {
            "name":"search.filter-registered",
            "status":'4',
            "iconClass":"fa fa-registered dropdown-icon-fa"
        },
        {
            "name":"search.filter-reserved-account",
            "status":'5',
            "iconClass":"fa fa-certificate dropdown-icon-fa"
        },
        {
            "name":"search.filter-registering",
            "status":'6',
            "iconClass":"fa fa-exclamation-circle dropdown-icon-fa"
        }
    ]*/

    const onSearch = () => {
        let wordList = searchEditRef.current.getWordList();
        
        let data = dasData.localSearch(wordList, {status: '-1'});
        //console.log(data);

        setSearchResult(data.list);
    }

    const onClearEdit = () => {
        searchEditRef.current.clearInput();
    }

    const renderCurrStatusFilter = () => {
        let filterText = t("search.filter-all-account");

        let config = search_filter_config.find(item => item.status[0] == searchStatusFilter.status);
        if (config) {
            filterText = t(config.name);
        }

        return <div className='flex flex-row common-menu pl-5 h-[30px] text-sm border-gray-400 rounded-[6px] bg-box shadow-[0_0_1px_0px_rgba(0,0,0,0.3)]'>
            <div className='py-1'>{filterText}</div>
            <i className="fa fa-angle-down mx-4 py-2 text-bold" aria-hidden="true"></i>
        </div>
    }

    
    const changeSearchStatusFilter = (newStatus) => {
        setSearchStatusFilter({
            status: newStatus
        })
    }

    const RenderSearchFilterMenuItem = (item, index) => {
        const [t] = useTranslation()
        return(
            <div className="flex flex-row py-2 pl-5 cursor-pointer common-menu pr-5" key={index} onClick={() => changeSearchStatusFilter(item.status)}>
                <i className={item.iconClass}></i>
                <span className='text-sm'>{t(item.name)}</span>
            </div>
       )
    }

    const renderTopCategoried = () => {
        return top_categories_config.map((item, i) => {
            return <div className='rounded-full text-sm p-3  flex items-center justify-center border-[1px] border-green-1 shadow-lg'>{t(item.name)}</div>
        })
    }

    const onLoadCategory = (fileName) => {
        let jsonList = require(`../constants/data/${fileName}`);
        
        if (!jsonList){
            return;
        }

        let wordList = JSON.stringify(jsonList).match(/[a-z0-9\-]+/gi);

        if (wordList) {
            wordList = [...new Set(wordList)].sort(function (a, b) {
                return a.length - b.length;
            });
        }

        let data = dasData.localSearch(wordList, {status: '-1'});
        //console.log(data);

        setSearchResult(data.list);
    }

    return (
        <div className='bg-main-card h-full rounded-[10px]'>
        <div className='w-full p-3 md:p-6 flex flex-col'>
            <span className='mb-6'>{t('search.bulk-search-title')}</span>
            <div className="flex flex-col">
                <div className='flex flex-wrap gap-4 overflow-auto mb-5'>
                    <span className='rounded-full text-sm px-3 flex items-center justify-center text-[#00DF9B]'>{t("search.top-categories")}</span>
                    {
                        top_categories_config.map((item, i) => {
                            return <div className='rounded-full text-sm px-3 py-1 flex items-center justify-center border-[1px] border-green-1 shadow-lg' onClick={ () => onLoadCategory(item.file)}>
                                {t(item.name)}
                            </div>
                        })
                    }
                </div>
                <SeekTextArea ref={searchEditRef}/>
               
                <div className="flex flex-row w-full items-center my-4 gap-5">
                    <div className='grow'></div>
                    <DropdownMenu className="p-3 z-0"
                        customToggle={() => renderCurrStatusFilter()}
                        contentData={search_filter_config}
                        renderItems={(item, index) => RenderSearchFilterMenuItem(item, index)}
                    ></DropdownMenu> 
                    <div onClick={onSearch} className="px-2 hover:bg-[#2471FE] text-[#fff] pt-1 w-[100px] cursor-pointer text-sm bg-[#00DF9B] text-primary h-[30px]  text-center font-semibold rounded-full">🔍 {t('search.search-btn')}</div>

                </div>
                

                <BitRegisterSearchResultList dataList={searchResult} filter={searchStatusFilter}/>
                           
            </div> 
          
        </div>
        </div>
        )
}

export default SeekTool


