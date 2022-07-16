import React, { useEffect, useState } from 'react'

//import { useParams } from "react-router-dom";

import { useTranslation } from 'react-i18next'

import BitAccountCard from '../card/bitAccountCard';

import { getBitSearchForRegLink } from '../../utils/helper';

const BitOwnerAccountList = (props) => {
    
    const initData = {
        account: props.account,
        accountList: [],
        pageIndex: 1,
        pageCount: 0,
        loading: true,
        isRequestingData: false,
        owner:"0x0000000000000000000000000000000000000000",
    }

    //console.log(props)
    
    const accountName = props.account.substring(0, props.account.length-4);   

    const [data, setData] = useState(initData)
    const [hasError, setErrors] = useState(false);

    const [t] = useTranslation()

    //console.log(props.account, data.account);
    let reset = props.account != data.account ? setData(initData) : false;

    useEffect(() => {
        asyncGetAccountList(data.pageIndex);
       
    }, [props.account]);

    async function asyncGetAccountList(pageIndex) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                account: props.account,
                page_index: pageIndex,
                limit:20
             })
        };

        let url = `https://api.das.la/api/v2/das_accounts/get_accounts_by_bit`
        const res = await fetch(url, requestOptions);
        res
          .json()
          .then(res => {
            //    console.log(res);
                let newData = {};
                newData.account = props.account;
                newData.accountList = res.accounts;
                newData.pageIndex = res.page_index;
                newData.pageCount = res.pages;
                newData.loading = false;
                newData.owner = res.owner_address;
                
                setData(newData);
            })
          .catch(err => setErrors(err));
    }
    
    const gotoPage = (pageIndex) => {
        if (pageIndex > data.pageCount || pageIndex < 1) {
            return;
        }

        asyncGetAccountList(pageIndex);
    }

    const renderData = () => {
        if (data.accountList) {
            return (
                data.accountList.map((item,i) => {
                    return <BitAccountCard key={item.account} detail={item} ownerAddress={data.owner}/>
                })
            )
        }
        else {
            
            return  <div className='flex flex-col items-center place-content-center mb-5 gap-4'>
                        <div className='text-center w-full text-[#00DF9B] text-4xl'>{`${data.account}`}</div>
                        <span className='text-center w-full '>{t('accountlist.bit-not-registered-tip')}</span>
                        <a className='group pt-1 h-[28px] px-5 text-[#000] bg-[#00DF9B] ml-2 rounded-full text-center text-[#fff] text-[14px] group-hover:text-black group-hover:bg-[#aabb00] font-semibold' href={getBitSearchForRegLink(data.account)} rel="noopener noreferrer" target='_blank'>
                        {t('accountlist.register-now')}👉
                        </a>
                    </div>    
        }
    }

    const renderLoadingCards = () => {
        return (<div className='flex flex-col gap-4'>
                    {renderPagination()}
                    <div className='mt-2 gap-4 flex flex-wrap justify-center'>
                        {skeletonRows.map((item, index) => <BitCardSkeleton key={index} />)}
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
                <div className="w-full h-[160px] flex flex-col gap-2 justify-center align-items-center bg-slate-200 text-[#fff] rounded-[10px]">
                    
                    <div className="flex place-content-center">
                        <div className="flex flex-col text-[20px] font-bold bg-slate-200 w-[60px] text-center rounded-[22.5px]">
                        
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
                    <div className="group h-[24px] w-[72px] bg-slate-200 ml-2 rounded-full pt-1 text-center  text-[12px]  font-semibold">
                        
                    </div> 
                </div>
            </div>
        </div>
    </div>
        );
    };

    const renderPagination = () => {
        let hasNextPage = data.pageCount > data.pageIndex;
        let hasPrevPage = data.pageIndex > 1 && data.pageCount > 1;

        //console.log(hasPrevPage, hasNextPage)
        
        let nextPageBtn = <button className={`opacity-50 cursor-not-allowed didsabled:cursor-not-allowed disabled:opacity-50`} disabled>{t('accountlist.next-page')}</button>
        if (hasNextPage) {
            nextPageBtn = <button className={`hover:text-[#00DF9B]`} onClick={()=>{gotoPage(data.pageIndex + 1)}}>{t('accountlist.next-page')}</button>
        }

        let prevPageBtn = <button className={`opacity-50 cursor-not-allowed didsabled:cursor-not-allowed disabled:opacity-50`} disabled>{t('accountlist.prev-page')}</button>
        if (hasPrevPage) {
            prevPageBtn = <button className={`hover:text-[#00DF9B]`} onClick={()=>{gotoPage(data.pageIndex - 1)}}>{t('accountlist.prev-page')}</button>
        }

        return <div className='flex flex-row gap-4 place-content-center'>
            {prevPageBtn}
            <span>{data.pageIndex}/{data.pageCount}</span>
            {nextPageBtn}
        </div>
    }

    let skeletonRows = Array(20).fill(0);

    return ( <>
        {data.loading ? (renderLoadingCards())
            :(
        <div className='flex flex-col gap-4'>
            {data.accountList? renderPagination(): ''}
            {console.log(`account list render, ${data.loading}`)}
            <div className='mt-2 gap-4 flex flex-wrap justify-center'>
            {
                renderData()
                /*    data.accountList?.map((item,i) => {
                        return <BitAccountCard key={item.account} detail={item} ownerAddress={data.owner}/>
                    })*/
            }
            </div>
            {data.accountList? renderPagination(): ''}
        </div>)}
    </>
    )
}

export default BitOwnerAccountList
