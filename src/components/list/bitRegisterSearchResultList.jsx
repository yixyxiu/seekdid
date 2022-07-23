import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { getBitRegisterLink, getBitSearchForRegLink, getAccountMarketLink, numberFormatter } from '../../utils/helper';
import { getAccountStatusString, AccountStatusColors, DASACCOUNTSTATUS } from '../../constants/constants';

/**
 * 外部传进来所有的数据（有不同的状态），以及筛选的条件，组件内部进行筛选，得到一个结果集，在这个结果集里做分页显示
 * @param {dataList} props ：dataList，filter：{status}
 * @returns 
 */
const BitRegisterSearchResultList = (props) => {
    
    const initData = {
        accountList: props.dataList,    // 原始数据
        filter: props.filter,           // 过滤器
        pageCount: 0,       // 页数
        pageLimit: 20,      // 每页条数
        loading: props.loading,      // 是否正在加载
    }

    const initDataShow = {
        accountList: [],
        pageIndex: 1,       // 页序
    }

    const [data, setData] = useState(initData)
    const [dataShow, setDataShow] = useState(initDataShow)
    
    const [t] = useTranslation()

    //let reset = props.dataList != data.dataList ? setData(initData) : false;

    useEffect(() => {
        let curData = data;
        curData.accountList = filterDataFromProps(props);
        curData.loading = props.loading;
        let page = Math.floor(curData.accountList.length / Number(20))
        curData.pageCount = curData.accountList.length % Number(20) === 0 ? page : page + 1

        setData(curData);
        //console.log(curData);
        if (dataShow.pageIndex > curData.pageCount) {
            gotoPage(1);
        }
        else {
            gotoPage(dataShow.pageIndex);
        }

    },[props.dataList, props.filter,dataShow.pageIndex]);

    
    const filterDataFromProps = (props) => {
        let dstData = [];
        if (!props.filter || props.filter.status == -1) {
            dstData = props.dataList;
        }
        else {
            dstData = props.dataList.filter(item => item.status == props.filter.status);
        }

        return dstData;
    }

    const gotoPage = (pageIndex) => {
        if (pageIndex > data.pageCount || pageIndex < 1) {
            if (data.pageCount === 0) {
                let curPageData = {}
                curPageData.accountList = [];
                curPageData.pageIndex = 1;
                setDataShow(curPageData);
            }
            return;
        }

        const start = Number(data.pageLimit) * (dataShow.pageIndex - 1)
        const end = start + Number(data.pageLimit)

        let curPageData = {}
        curPageData.accountList = data.accountList.slice(start, end);
        curPageData.pageIndex = pageIndex;
        setDataShow(curPageData);
    }

    const renderStatusLink = (detail) => {
        if (detail.status == DASACCOUNTSTATUS.Available) {
            return <div className={`flex flex-col pt-3.5 content-center text-center items-center`}>
            <a className='group pt-1 h-[28px] px-3 bg-[#00DF9B] ml-2 rounded-full text-center text-[#fff] text-[14px] group-hover:text-black group-hover:bg-[#aabb00] font-semibold' href={getBitRegisterLink(detail.account)} rel="noopener noreferrer" target='_blank'>
                {t('search.register')}
            </a>
        </div>
        }
        else if (detail.status == DASACCOUNTSTATUS.OnSale) {
            // todo
            return <a className={`flex flex-row my-3.5  pr-3 content-center text-center items-center text-sm bg-[#FFA800] h-[28px] rounded-full text-white font-semibold`} href={getAccountMarketLink(detail.listing_for_sale[0].from, detail.account)} rel="noopener noreferrer" target="_blank">
            <img src={`images/marketplaces/${detail.listing_for_sale[0].from.toLowerCase()}-color.svg`} alt={`logo-${detail.listing_for_sale[0].from}`} className='group h-[16px] pl-1  mx-2 rounded-full text-center ' >
            </img>
            {t("search.buy")}
        </a>
        }
        else if(detail.status == DASACCOUNTSTATUS.Registered || detail.status == detail.status == DASACCOUNTSTATUS.Registering) {
            return <div className={`flex flex-col pt-3.5 content-center text-center items-center`}>
            <a className="group pt-1 h-[28px] px-3 bg-[#2471FE] ml-2 rounded-full text-center text-[#fff] text-[14px] group-hover:text-black group-hover:bg-[#aabb00] font-semibold" href={getAccountMarketLink('didtop', detail.name)} rel="noopener noreferrer" target="_blank">
                {t("accountlist.make-offer")}
            </a>      
        </div>
        }
        else {
            return <></>
        }
    } 

    const renderMarketInfo = (item) => {
        if(item.status == 2) {
            if (item.listing_for_sale && item.listing_for_sale[0]) {
                let value = numberFormatter(item.listing_for_sale[0].price, 2);

                return <span className={`px-3 mt-2.5 pt-[1.5px] rounded-full h-[20px] text-[12px] ml-2 whitespace-nowrap text-[#fff] bg-[#00E09C]`} >{value} {item.listing_for_sale[0].symbol}</span>
            }
        }
       
        return <></>
    }

    const renderStatusTag = (status) => {

        /*
        '0':'#2471FE',      // 可注册
        '1':'#00E09C',      // 即将开放 
        '2':'#2471FE',      // 在售
        '3':'#DF4A46',      // 未开放
        '4':'#FFA800',      // 已注册
        '5':'#808191',      // 保留
        '6':'#FFD717',      // 注册中
        */
        // 由于 taiwandcss 对变量颜色支持有bug，所以单独写
        if (status == 0) {
            return <span className={`px-3 mt-2.5 pt-[1.5px] rounded-full h-[20px] text-[12px] ml-2 whitespace-nowrap text-[#fff] bg-[#2471FE]`} >{getAccountStatusString(status)}</span>
        }
        else if (status ==1) {
            return <></>
        }
        else if(status == 2) {
            return <span className={`px-3 mt-2.5 pt-[1.5px] rounded-full h-[20px] text-[12px] ml-2 whitespace-nowrap text-[#fff] bg-[#00E09C]`} >{getAccountStatusString(status)}</span>
        }
        else if(status == 3) {
            return <span className={`px-3 mt-2.5 pt-[1.5px] rounded-full h-[20px] text-[12px] ml-2 whitespace-nowrap text-[#fff] bg-[#DF4A46]`} >{getAccountStatusString(status)}</span>
        }
        else if(status == 4) {
            return <span className={`px-3 mt-2.5 pt-[1.5px] rounded-full h-[20px] text-[12px] ml-2 whitespace-nowrap text-[#fff] bg-[#FFA800]`} >{getAccountStatusString(status)}</span>
        }
        else if(status == 5) {
            return <span className={`px-3 mt-2.5 pt-[1.5px] rounded-full h-[20px] text-[12px] ml-2 whitespace-nowrap text-[#fff] bg-[#808191]`} >{getAccountStatusString(status)}</span>
        }
        else if(status == 6) {
            return <span className={`px-3 mt-2.5 pt-[1.5px] rounded-full h-[20px] text-[12px] ml-2 whitespace-nowrap text-[#fff] bg-[#FFD717]`} >{getAccountStatusString(status)}</span>
        }
        else {
            return <></>
        }
    }

    const BitSearchResultItem = (props) => {
        let item = props.detail;
        
        if (props.loading) {
            return (<div key={props.key} className={`flex flex-row animate-pulse border-b-[1px] border-line  seperator`}>
            <div className='py-2 md:px-2 flex grow content-center grow'>
                <span className='w-6 h-6 mt-2 rounded-full bg-slate-500' ></span>
                <span className="my-2 ml-2 w-3/12 h-6 rounded-full bg-slate-500"></span>
                <div className='flex flex-col  w-5/12 md:flex-row'>
                    <span className={`px-3 mt-2.5 pt-[1.5px] w-full rounded-full h-[20px] ml-2 bg-slate-500`} ></span>
                </div>
            </div>     
            <div className={`flex flex-col pt-3.5 w-3/12 content-center text-center items-center`}>
                <div className="group pt-1 h-[28px] px-3 w-full bg-slate-500 ml-2 rounded-full">       
                </div>      
            </div>
        </div>)
        }

        //let statusTagColor = AccountStatusColors[item.status];
        
        return (
            <div key={`${item.name}`} className={`flex flex-row common-bitlist border-b-[1px] border-line seperator`}>
                <div className='py-2 md:px-2 flex grow content-center grow'>
                    <img className='w-6 h-6 mt-2 rounded-full' src={`https://identicons.did.id/identicon/${item.account}`} alt={`bitAvatar-${item.account}`} ></img>
                    <span className="py-2 ml-2 text-base font-bold">
                        {item.account}
                    </span>
                    <div className='flex flex-col md:flex-row'>
                        {renderStatusTag(item.status)}
                        {renderMarketInfo(item)}
                    </div>
                </div>     
                {renderStatusLink(item)}
            </div>
        )
    }

    const renderData = () => {
        if (dataShow.accountList) {
            return (
                dataShow.accountList.map((item,i) => {
                    return <BitSearchResultItem key={item.name} detail={item} loading={props.loading}/>
                })
            )
        }
        else {
            
            return  <div >No data
                    </div>    
        }
    }


    const renderLoadingCards = () => {

        let skeletonRows = Array(20).fill(0);

        return (<div className='flex flex-col gap-4'>
        <div className='gap-x-4 grid grid-cols-1 md:grid-cols-2 justify-center my-4'>
        {
            skeletonRows?.map((item,i) => {
                    return <BitSearchResultItem key={i} loading={true}/>
                })
        }
        </div>
    </div>
        )
    }


    const BitCardSkeleton = () => {
        return ( <div className='flex flex-col gap-4'>
            
        <div className='mt-2 gap-4 flex flex-wrap justify-center'>
            <div className="p-2.5 flex flex-col gap-3.5 bg-box animate-pulse shadow-[0_0_10px_0px_rgba(0,0,0,0.3)] w-full md:w-[250px] h-[300px] rounded-[10px] ">
                <div className="flex flex-row h-[14px] pl-2.5">
                    <img className="h-[14px]" src={'images/seekdid/logo_1_5@10x.svg'}/>
                </div> 
                <div className="w-full h-[160px] flex flex-col gap-2 justify-center align-items-center bg-slate-500 text-[#fff] rounded-[10px]">
                    
                    <div className="flex place-content-center">
                        <div className="flex flex-col text-[20px] font-bold bg-slate-500 w-[60px] text-center rounded-[22.5px]">
                        
                        </div>
                    </div>
                    
                </div>
                <div className="flex flex-row gap-5 place-content-center">
                    <img className='h-[24px] rounded-full opacity-10' src={`images/marketplaces/${'opensea'}-color.svg`} alt={`logo-${'opensea'}`} ></img>
                    <img className='h-[24px] rounded-full opacity-10' src={`images/marketplaces/${'looksrare'}-color.svg`} alt={`logo-${'looksrare'}`} ></img>
                    <img className='h-[24px] rounded-full opacity-10' src={`images/marketplaces/${'x2y2'}-color.svg`} alt={`logo-${'x2y2'}`} ></img>
                    <img className='h-[24px] rounded-full opacity-10' src={`images/marketplaces/${'didtop'}-color.svg`} alt={`logo-${'didtop'}`} ></img>
                </div> 
                <div className='flex flex-row h-6 justify-center'>
                    <span className='text-sm  whitespace-nowrap' ></span>
                    <div className="group h-[24px] w-[72px] bg-slate-500 ml-2 rounded-full pt-1 text-center  text-[12px]  font-semibold">
                        
                    </div> 
                </div>
            </div>
        </div>
    </div>
        );
    };

    const renderPagination = () => {
        let hasNextPage = data.pageCount > dataShow.pageIndex;
        let hasPrevPage = dataShow.pageIndex > 1 && data.pageCount > 1;
        
        let nextPageBtn = <button className={`opacity-50 cursor-not-allowed didsabled:cursor-not-allowed disabled:opacity-50`} disabled>{t('accountlist.next-page')}</button>
        if (hasNextPage) {
            nextPageBtn = <button className={`hover:text-[#00DF9B]`} onClick={()=>{gotoPage(dataShow.pageIndex + 1)}}>{t('accountlist.next-page')}</button>
        }

        let prevPageBtn = <button className={`opacity-50 cursor-not-allowed didsabled:cursor-not-allowed disabled:opacity-50`} disabled>{t('accountlist.prev-page')}</button>
        if (hasPrevPage) {
            prevPageBtn = <button className={`hover:text-[#00DF9B]`} onClick={()=>{gotoPage(dataShow.pageIndex - 1)}}>{t('accountlist.prev-page')}</button>
        }

        return <div className='flex flex-row gap-4 place-content-center'>
            {prevPageBtn}
            <span>{dataShow.pageIndex}/{data.pageCount}</span>
            {nextPageBtn}
        </div>
    }


    data.accountList = filterDataFromProps(props);

    return ( <>
        {data.loading ? (renderLoadingCards())
            :(
        <div className='flex flex-col gap-4'>
            
            <div className='gap-x-4 grid grid-cols-1 md:grid-cols-2 justify-center my-4'>
            {
                renderData()
                /*    data.accountList?.map((item,i) => {
                        return <BitAccountCard key={item.account} detail={item} ownerAddress={data.owner}/>
                    })*/
            }
            </div>
            {dataShow.accountList? renderPagination(): ''}
        </div>)}
    </>
    )
}

export default BitRegisterSearchResultList
