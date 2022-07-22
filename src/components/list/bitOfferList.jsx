import React from 'react'

import { useEffect, useState, useRef } from 'react';

import { useTranslation } from 'react-i18next'

import TimeDifferLabel from '../label/timeDifferLabel';
import { SalesListSkeleton } from '../Skeleton/salesListSkeleton';

import { numberFormatter, getAccountMarketLink } from '../../utils/helper';

const BitOfferList = () => {
    const initData = {
        accountList: [],
        todayCount: 0,
        newAccounts: [],
        pageCount: 0,
        loading: true,
        
    }

    const [hasError, setErrors] = useState(false);
    const [data, setData] = useState(initData);

    const [t] = useTranslation()
    let intervalRef = useRef(null);

    // 对比是否有新数据，缓存下来
    const accountListRef = useRef();
    accountListRef.current = data.accountList;
    const newAccountsRef = useRef();
    newAccountsRef.current = data.newAccounts;

    useEffect(() => {
        asyncGetSalesAccountList();

        clearInterval(intervalRef.current);

        // 5分钟更新一次数据
        intervalRef.current = setInterval(() => {
            asyncGetSalesAccountList();
        }, 1 * 60 * 1000);
        
        return () => {
            clearInterval(intervalRef.current)
        }
    }, []);

    async function asyncGetSalesAccountList() {
        let url = `https://api.das.la/api/v2/das_accounts/get_bit_sales_data?limit=10&type=2`
        const res = await fetch(url);
        res
          .json()
          .then(res => {
            //    console.log(accountListRef.current);
                // data changed
                let newData = {};
                if (!accountListRef.current
                    || accountListRef.current.length === 0 
                    || (res.accounts && res.accounts.length > 0 && res.accounts[0].account != accountListRef.current[0].account)) {    
                    // todo: 不是初次请求，则标出具体哪个账号是新注册的，高亮显示几秒钟
                    if (accountListRef.current.length > 0) {
                        let newbies = generateNewItems(accountListRef.current, res.accounts);
                        newData.newAccounts = newbies;
                        newAccountsRef.current = newbies;
                    }

                    newData.accountList = res.accounts;
                    newData.pageCount = res.pages;
                    newData.todayMint = res.minted_today;
                    newData.loading = false;
                   
                    setData(newData);
                    
                    accountListRef.current = res.accounts;   

                }
                
            })
          .catch(err => setErrors(err));
    }

    const isNewItem = (account) => {
        if (newAccountsRef && newAccountsRef.current) {
            return newAccountsRef.current.includes(account);
        }
        
        return false;
    }

    // 在这里简单起见，只要新数据账号所处的索引序号不同，则认为不同
    const generateNewItems = (old_arr, new_arr) => {
        let newItems = [];
        const firstAccountInOldData = old_arr ? old_arr[0].account : '';

        const old_data_len = old_arr.length;

        for (let index = 0; index < new_arr.length; index++) {
            let item = new_arr[index];
            if (item.account === firstAccountInOldData) {
                break;
            }

            if (old_data_len > index) {
                if (old_arr[index].account !== item.account) {
                    newItems.push(item.account);
                }
            }
        }
   
        return newItems;
    }

    let skeletonRows = Array(10).fill(0);

    return (
        <div className='flex flex-col rounded-lg p-5 hover-up-2 bg-main-card bg-box-shadow'>
            <div className='flex flex-row mb-2' >
                <div className='grow text-base card-title'>💰{t('dashboard.offer-list-card-title')}</div>
            </div>

            {data.loading ? (skeletonRows.map((item, index) => <SalesListSkeleton key={index} />))
            :(<div className='mt-2 flex flex-col justify-left'>
            {
                    data.accountList?.map((item,i) => {
                        return <a key={i} href={getAccountMarketLink(item.from, item.account)} rel="noopener noreferrer" target="_blank"><div key={`${i}-${item.account}`} className={`flex flex-row cursor-pointer common-bitlist border-b-[1px] border-line seperator ${isNewItem(item.account) ? 'new_item_animation':' '}`}>
                        <div className='z-40 py-2 px-2 flex grow content-center'>
                            <img className='w-6 h-6 mt-2 rounded-full' src={`https://identicons.did.id/identicon/${item.account}`} alt={`bitAvatar-${item.account}`} ></img>
                            <span className="py-2 ml-2 text-base font-bold" >
                                {item.account}
                            </span>
                        </div>
                        <div className='z-40 flex flex-col pt-2 pr-2 content-center text-right'>
                            <div className='z-40 flex flex-row h-4 justify-end'>
                                <img className='h-full' src={`images/marketplaces/symbol-${item.symbol.toLowerCase()}.svg`} alt={`logo-${item.from}`} ></img>
                                <span className='text-sm ml-2 whitespace-nowrap' >{`${numberFormatter(item.price, 2)} ${item.symbol}`}</span>
                                <img className='ml-2 rounded-full' src={`images/marketplaces/${item.from}-color.svg`} alt={`logo-${item.from}`} ></img>
                            </div>
                            <TimeDifferLabel interval={1*60*1000} startTime={item.event_at}/>
                        </div>
                        </div></a>
                    })
            }
            </div>)}
        </div>
    )
}

export default BitOfferList
