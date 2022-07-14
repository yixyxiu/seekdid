import React from 'react'

import { useEffect, useState, useRef } from 'react';

import { useTranslation } from 'react-i18next'

import TimeDifferLabel from '../label/timeDifferLabel';
import { ListSkeleton } from '../Skeleton/listSkeleton';
import { timestampToString, getAccountMarketLink } from '../../utils/helper';

const BitMintList = () => {
    const initData = {
        accountList: [],
        todayMint: 0,
        newAccounts: [],
        pageCount: 0,
        loading: true,
    }
//    const [accountList, setAccountList] = useState([]);
//    const [todayBorn, setTodayBorn] = useState(0);
//    const [newAccounts, setNewAccounts] = useState([]);
//    const [pageCount, setPageCount] = useState(0);
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
        asyncGetMintAccountList();

        clearInterval(intervalRef.current);

        // 5分钟更新一次数据
        intervalRef.current = setInterval(() => {
            asyncGetMintAccountList();
        }, 1 * 60 * 1000);
        
        return () => {
            clearInterval(intervalRef.current)
        }
    }, []);

    async function asyncGetMintAccountList() {
        let url = `https://api.das.la/api/v2/das_accounts/get_latest_mint_accounts?limit=4`
        const res = await fetch(url);
        res
          .json()
          .then(res => {
                //console.log(accountListRef.current);
                // data changed
                let newData = {};
                if (accountListRef.current.length === 0 
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
                    setTimeout(() => {
                    //    newAccountsRef.current = null;
                    //    setErrors(false);
                    }, 10*1000);
                    accountListRef.current = res.accounts;   
                }
                setErrors(false);
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

    const getTimeDiffString = (mint_at) => {
        let now = new Date().getTime()/1000;

        // second
        const diff = (now - mint_at);
        if (diff < 0) {
            return t('common.justnow')
        }
        
        // 一分钟内用秒显示
        if (diff < 60) {
            return `${Math.floor(diff)} ${t('common.second_ago')}`
        }

        // 一小时内用分钟表示
        if (diff < 60*60) {
            return `${Math.floor(diff / 60)} ${t('common.minutes_ago')}`
        }

        // 一天内用小时表示
        if (diff < 24*60*60) {
            return `${Math.floor(diff /(60*60))} ${t('common.hour_ago')}`
        }
            
        return timestampToString(mint_at * 1000)
    }

    const renderInviter = (inviter_account) => {
        if (!inviter_account) {
            return ''
        }

        return <a className="py-2 text-sm grow cursor-pointer text-emerald-500 text-hover" href={`/${inviter_account}`} rel="noopener noreferrer" target="_blank">
                    {inviter_account}
            </a>
    }
    
    const renderMintInfo = (regInfo) =>{
        return ` was minted`
    }

    let skeletonRows = Array(5).fill(0);

    return (
        <div className='flex flex-col rounded-lg p-5 hover-up-2 bg-main-card bg-box-shadow'>
            <div className='flex flex-row mb-2' >
                <div className='grow text-base card-title'>⚒️{t('dashboard.new-mint-card-title')}</div>
                <div className='text-base text-[#2471FE]'>{t('dashboard.today-new')}{data.todayMint}</div>    
            </div>
            {data.loading ? (skeletonRows.map((item, index) => <ListSkeleton key={index} />))
            :(<div className='mt-2 gap-2 flex flex-col justify-left'>
            {
                    data.accountList?.map((item,i) => {
                        return <div key={`${i}-${item.account}`} className={`flex flex-row border-b-[1px] border-dashed seperator ${isNewItem(item.account) ? 'new_item_animation':' '}`}>
                        <div className='z-40 py-2 grow'>
                            <a className="py-2 text-sm font-bold cursor-pointer text-[#2471FE] text-hover" href={getAccountMarketLink('opensea',item.account)} rel="noopener noreferrer" target="_blank">
                                {item.account}
                            </a>
                            <span  className={`text-sm py-2 ml-2 mr-2 grow`} >
                                {renderMintInfo(item)}
                            </span>
                            
                            
                        </div>
                        <TimeDifferLabel interval={1*60*1000} startTime={item.mint_at}/>
                        </div>
                    })
            }
            </div>)}
        </div>
    )
}

export default BitMintList
