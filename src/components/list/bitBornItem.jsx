import React from 'react'

import { useEffect, useState, useRef } from 'react';

import { useTranslation } from 'react-i18next'

import { timestampToString } from '../../utils/helper';

const BitBornItem = (props) => {
    const [item, setAccountList] = useState([]);
    const [isNew, setNewFlag] = useState(false);
    
    const [t] = useTranslation()
    let intervalRef = useRef(null);
    const breathBeatRef = useRef();
    breathBeatRef.current = 0;

    useEffect(() => {

        clearInterval(intervalRef.current);

        // 1秒钟更新一次闪烁状态
        intervalRef.current = setInterval(() => {
            asyncGetBornAccountList();
        }, 1 * 60 * 1000);
        
        return () => {
            clearInterval(intervalRef.current)
        }
    }, []);

    async function asyncGetBornAccountList() {
        let url = `https://api.das.la/api/v2/das_accounts/get_latest_born_accounts?limit=4`
        const res = await fetch(url);
        res
          .json()
          .then(res => {
                //console.log(res);
                //console.log(accountListRef.current);
                // data changed
                if (accountListRef.current.length === 0 || (res.accounts && res.accounts.length > 0 && res.accounts[0].account != accountList[0].account)) {
                    setAccountList(res.accounts);
                    setPageCount(res.pages);
                    setTodayBorn(res.borned_today);
                    console.log('data changed');
                    // todo: 标出具体哪个账号是新注册的，高亮显示几秒钟
                    accountListRef.current = res.accounts;   
                }
            })
          .catch(err => setErrors(err));
    }

    //const render
    const calcRegisteredDuration = (registered_at, expired_at) => {
        let registered = new Date(registered_at * 1000);
        let expired = new Date(expired_at * 1000);

        return expired.getFullYear() - registered.getFullYear();
    }

    const getTimeDiffString = (registered_at) => {
        let registered = registered_at;
        let now = new Date().getTime()/1000;

        // second
        const diff = (now - registered_at);
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
            return `${Math.floor(diff / 60)} ${t('common.hour_ago')}`
        }
            
        return timestampToString(registered_at * 1000)
    }

    const renderInviter = (inviter_account) => {
        if (!inviter_account) {
            return ''
        }

        return <a className="py-2 text-sm grow cursor-pointer text-emerald-500 text-hover" href={`/${inviter_account}`} rel="noopener noreferrer" target="_blank">
                    {inviter_account}
            </a>
    }
    
    const renderRegisterInfo = (regInfo) =>{
        if (!regInfo) {
            return ''
        }

        let duration = calcRegisteredDuration(regInfo.registered_at, regInfo.expired_at);
        let str_years = duration > 1 ? 'years' : 'year';

        if (regInfo.inviter_account) {
            return ` registered for ${duration} ${str_years}, invited by `
        }
        else {
            return ` registered for ${duration} ${str_years}`
        }
    }

    return (
        <div className='flex flex-col rounded-lg p-5 hover-up-2 bg-secondary sm:w-full min-h-[310px] bg-box-shadow'>
            <div className='flex flex-row mb-2' >
                <div className='grow text-base card-title'>{t('dashborad.new-born-card-title')}</div>
                <div className='text-base text-emerald-500'>今日新增：{todayBorn}个</div>    
            </div>
            <div className='mt-2 gap-2 flex flex-col justify-left'>
            {
                    accountList?.map((item,i) => {
                        return <div className='flex flex-row border-b-[1px] border-dashed seperator bg-[#00DF9B]/[0.2]'>
                        <div className='py-2 grow'>
                            <a className="py-2 text-sm cursor-pointer text-emerald-500 text-hover" href={`/${item.account}`} rel="noopener noreferrer" target="_blank">
                                {item.account}
                            </a>
                            <span  className={`text-sm py-2 ml-2 mr-2 ${!item.inviter_account ? 'grow':' '}`} >
                                {renderRegisterInfo(item)}
                            </span>
                            {renderInviter(item.inviter_account)}
                            
                        </div>
                        <div className='text-sm py-2 ml-2 min-w-[70px] text-right'>
                            {getTimeDiffString(item.registered_at)}
                        </div>
                        </div>
                    })
            }
            </div>
        </div>
    )
}

export default BitBornItem
