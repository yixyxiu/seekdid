import React from 'react'

import { useParams } from "react-router-dom";

import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next'

//import BitSimpleDetailCard from '../card/bitSimpleCard';
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
        asyncGetAccountList();
    }, []);

    async function asyncGetAccountList() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                account: props.account,
                page_index: data.pageIndex,
                limit:100
             })
        };

        let url = `https://api.das.la/api/v2/das_accounts/get_accounts_by_bit`
        const res = await fetch(url, requestOptions);
        res
          .json()
          .then(res => {
                console.log(res);
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
    
    return (
        <div>
            <div className='mt-2 gap-4 flex flex-wrap justify-center'>
            {
                    data.accountList?.map((item,i) => {
                        return <BitAccountCard key={item.account} detail={item} ownerAddress={data.owner}/>
                    })
            }
            </div>
        </div>
    )
}

export default BitOwnerAccountList
