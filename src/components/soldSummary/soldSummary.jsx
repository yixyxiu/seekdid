import React from 'react'

import { useEffect, useState, useRef } from 'react';

import { useTranslation } from 'react-i18next'

import { ListSkeleton } from '../Skeleton/listSkeleton';
import { BitSoldCountSummary } from './soldCountSummary';
import { BitSoldVolumeSummary } from './soldVolumeSummary';
import { BitSoldAddressSummary } from './soldAddressSummary';

const BitSoldSummary = () => {
    const initData = {
        summaryData: {
            "sold_count":{
                "summary":{
                    "num":0,
                    "change_percent":0
                },
                "sources":[
                    {
                        "from":"opensea",
                        "num":0,
                        "change_percent":0
                    },
                    {
                        "from":"didtop",
                        "num":0,
                        "change_percent":0
                    },
                    {
                        "from":"looksrare",
                        "num":0,
                        "change_percent":0
                    },
                    {
                        "from":"x2y2",
                        "num":0,
                        "change_percent":0
                    }
                ]
            },
            "sold_volume":{
                "summary":{
                    "num":0,
                    "change_percent":0
                },
                "sources":[
                    {
                        "from":"opensea",
                        "num":0,
                        "change_percent":0
                    },
                    {
                        "from":"didtop",
                        "num":0,
                        "change_percent":0
                    },
                    {
                        "from":"looksrare",
                        "num":0,
                        "change_percent":0
                    },
                    {
                        "from":"x2y2",
                        "num":0,
                        "change_percent":0
                    }
                ]
            },
            "tx_distribution":{
                "buy":0,
                "sell":0
            }
        },
      
        loading: true,
    }

    const [hasError, setErrors] = useState(false);
    const [data, setData] = useState(initData);

    const [t] = useTranslation()
    let intervalRef = useRef(null);

    useEffect(() => {
        asyncGet24HrsSalesSummary();

        clearInterval(intervalRef.current);

        // 5分钟更新一次数据
        intervalRef.current = setInterval(() => {
            asyncGet24HrsSalesSummary();
        }, 1 * 60 * 1000);
        
        return () => {
            clearInterval(intervalRef.current)
        }
    }, []);

    async function asyncGet24HrsSalesSummary() {
        let url = `https://api.das.la/api/v2/das_accounts/get_24hrs_sales_summary`
        const res = await fetch(url);
        res
          .json()
          .then(res => {
                let newData = {};
                newData.summaryData = res;
                newData.loading = false;
                
                setData(newData);       
            })
          .catch(err => setErrors(err));
    }

    let skeletonRows = Array(5).fill(0);

    return (
        <div className='flex flex-col rounded-lg p-5 bg-main-card bg-box-shadow'>
            <div className='mb-2 text-base card-title'>💯{t('dashboard.sold-summary-card-title')}</div>
           
            {data.loading ? (skeletonRows.map((item, index) => <ListSkeleton key={index} />))
            :(<div className='mt-2 gap-4 flex flex-col'>
                <div className='mt-2 gap-4 grid grid-cols-1 lg:grid-cols-2 justify-items-stretch'>
                    <BitSoldCountSummary loading={data.loading} summaryData={data.summaryData.sold_count}/>
                    <BitSoldVolumeSummary loading={data.loading} summaryData={data.summaryData.sold_volume}/>
                </div>
                <div>
                    <BitSoldAddressSummary loading={data.loading} summaryData={data.summaryData.tx_distribution}/>
                </div>
            </div>)}
        </div>
    )
}

export default BitSoldSummary
