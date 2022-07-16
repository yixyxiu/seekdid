import React, { useEffect, useState } from 'react'

//import { useParams } from "react-router-dom";

import { useTranslation } from 'react-i18next'

import BitAccountCard from '../card/bitAccountCard';


const BitOwnerAccountList = (props) => {
    
    const initData = {
        account: props.account,
        accountList: [],
        pageIndex: 1,
        pageCount: 0,
        loading: true,
        owner:"0x0000000000000000000000000000000000000000",
    }

    console.log(props)
    
    const accountName = props.account.substring(0, props.account.length-4);   

    const [data, setData] = useState(initData)
    const [hasError, setErrors] = useState(false);

    const [t] = useTranslation()

    useEffect(() => {
        console.log(initData.account, 'accountlist useeffect')
        asyncGetAccountList(data.pageIndex);

        return () => {
            console.log('account list clear');
        }
    }, [props]);

    async function asyncGetAccountList(pageIndex) {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                account: props.account,
                page_index: pageIndex,
                limit:100
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
            <button>{data.pageIndex}</button>
            {nextPageBtn}
        </div>
    }

    return ( 
        <div className='flex flex-col gap-4'>
            {renderPagination()}
            {console.log('account list render')}
            <div className='mt-2 gap-4 flex flex-wrap justify-center'>
            {
                    data.accountList?.map((item,i) => {
                        return <BitAccountCard key={item.account} detail={item} ownerAddress={data.owner}/>
                    })
            }
            </div>
            {renderPagination()}
        </div>
    )
}

export default BitOwnerAccountList
