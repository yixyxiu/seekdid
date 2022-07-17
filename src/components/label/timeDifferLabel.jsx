import React from 'react'

import { useEffect, useState, useRef } from 'react';

import { useTranslation } from 'react-i18next'

import { timestampToString } from '../../utils/helper';

const TimeDifferLabel = (props) => {
    const [showText, setShowText] = useState('');
    const [t] = useTranslation()
    let intervalRef = useRef(null);

 
    useEffect(() => {

        update();

        clearInterval(intervalRef.current);

        // 5分钟更新一次数据
        intervalRef.current = setInterval(() => {
            update();
        }, props.interval);
        
        return () => {
            clearInterval(intervalRef.current)
        }
    }, []);

    const update = () => {
        setShowText(getTimeDiffString(props.startTime));
    }

    const formatData = (data) => (data < 10 ? `0${data}` : data)
    
    /**
     * 
     * @param {timestamp} from 
     * @returns 
     */
    const getTimeDiffString = (from) => {
        let now = new Date().getTime()/1000;

        // second
        const diff = (now - from);
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

        if (diff < 7*24*60*60) {
            const date = new Date(from * 1000)
            return `${formatData(date.getMonth() + 1)}/${formatData(date.getDate())} ${formatData(
                date.getHours(),
              )}:${formatData(date.getMinutes())}:${formatData(date.getSeconds())}` 
        }
            
        return timestampToString(from * 1000)
    }

    return (<div className='z-40 text-[12px] py-2 ml-2 min-w-[70px] text-right text-color-2nd'>
                {getTimeDiffString(props.startTime)}
            </div>
    )
}

export default TimeDifferLabel;
