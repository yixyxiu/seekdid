import React, {useState, useEffect} from 'react'
import { useTranslation } from 'react-i18next';

//import './bitSimpleCard.css'

const BitOwnerSummary = (props) => {

    const initAccount = props.account;
    const initOwnerSummary = {
            "total_accounts":'-',
            "hodl_rank":'-',
            "four_len_num":'-',
            "five_len_num":'-',
            "sixplus_len_num":'-',
            "hodl_num":'-',
            "for_sale_num":'-',
            "has_bid_num":'-',
            "expired_soon_num":'-',
            "tobe_recycled_num":'-',
            "fav_num":'-',
            "fans_num":'-'
        }

    const dataGridInfo = [
        {
            dataKey:"total_accounts",
            valueColor:'#00DF9B',
            i18nKey:"accountownersummary.total_accounts",
        },
        {
            dataKey:"hodl_rank",            
            valueColor:'#00DF9B',
            i18nKey:"accountownersummary.hodl_rank",
        },
        {
            dataKey:"four_len_num",
            valueColor:'#00DF9B',
            i18nKey:"accountownersummary.four_len_num",
        },
        {
            dataKey:"five_len_num",
            valueColor:'#00DF9B',
            i18nKey:"accountownersummary.five_len_num",
        },
        {
            dataKey:"sixplus_len_num",
            valueColor:'#00DF9B',
            i18nKey:"accountownersummary.sixplus_len_num",
        },
        {
            dataKey:"hodl_num",
            valueColor:'#00DF9B',
            i18nKey:"accountownersummary.hodl_num",
        },
        {
            dataKey:"for_sale_num",
            valueColor:'#00DF9B',
            i18nKey:"accountownersummary.for_sale_num",
        },
        {
            dataKey:"has_bid_num",
            valueColor:'#F56100',
            i18nKey:"accountownersummary.has_bid_num",
        },
        {
            dataKey:"expired_soon_num",
            valueColor:'#F56100',
            i18nKey:"accountownersummary.expired_soon_num",
        },
        {
            dataKey:"tobe_recycled_num",
            valueColor:'#F56100',
            i18nKey:"accountownersummary.tobe_recycled_num",
        }
    ]

    const initData = {
        loading: false,
        account: props.account,
        ownerSummary: initOwnerSummary
    }

    const accountName = initAccount.substring(0, initAccount.length-4);   

    const [data, setData] = useState(initData)
    const [hasError, setErrors] = useState(false);

    const [t] = useTranslation();

    useEffect(() => {
        asyncGetOwnerSummary(props.account);
    }, [props.account]);

    const renderGridCell = (item, index) => {
        //console.log(data);
        if (data.loading) {
            return  <div key={index} className={`flex flex-col animate-pulse `}>
                        <div className="h-6  w-1/2 rounded-full bg-slate-200"/>                         
                        <div className="h-6 w-1/2 rounded-full bg-slate-200 "></div>
                    </div>
        }
        else if(hasError) {
            return <div>error</div>
        }

        if (data.ownerSummary) {
            return  <div key={`${item.account}-${item.dataKey}`} className="flex flex-col h-[86px] text-center border-[0.1px] seperator justify-center align-items-center">
            <span className={`text-[${item.valueColor}] text-2xl font-bold`}>{data.ownerSummary[item.dataKey]}</span>
            <span className="text-sm font-bold">{t(item.i18nKey)}</span>
          </div>
        }
        else {
            return  <div key={`${item.account}-${item.dataKey}`} className="flex flex-col h-[86px] text-center border-[0.1px] seperator justify-center align-items-center">
            <span className={`text-[${item.valueColor}] text-2xl font-bold`}>{initOwnerSummary[item.dataKey]}</span>
            <span className="text-sm font-bold">{t(item.i18nKey)}</span>
          </div>
        }
    }

    // 根据账号长度计算字体大小
    const calcAccountNameFontSize = () => {
        let maxFontSize = 50;   // 9 个字符时
        let minFontSize = 14;   // 30 个字符时
        let accountLen = accountName.length;
        if (accountLen > 30) {
            return minFontSize;
        }

        if (accountLen < 9) {
            return maxFontSize;
        }
        
        let fontSize = (50 - (50-14)/(30-9)*(accountLen-9)-4).toFixed(0)-1;
        if (fontSize < minFontSize) {
            fontSize = minFontSize;
        }

        return fontSize;
    }

    const renderAccountName = () => {

        let font_Size = calcAccountNameFontSize();
        //let style = {{'font-size': `${fontSize}px`}}
        /*<div className=" text-center h-[60px] font-bold text-[50px] golden-text text-[#000000]/80">{accountName}</div>*/
              
        return    <div className="flex flex-col h-15">
                    <span className={`h-full text-center font-semibold text-[#000000]/80 break-all`} style = {{fontSize: `${font_Size}px`}}>{accountName}</span>
                </div>
    }

    async function asyncGetOwnerSummary(account) {
        let url = `https://api.das.la/api/v2/das_accounts/get_bitowner_summary?account=${account}`
        const res = await fetch(url);
        res
          .json()
          .then(res => {
                //console.log(res);
                // data changed
                let newData = {};
                newData.ownerSummary = res.account_info;
                newData.account = res.account;
                newData.loading = false; 
                setData(newData);
            })
          .catch(err => setErrors(err));
    }
    
    return (<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:p-5 ">
    <div className="flex py-8 gap-4 flex-col rounded-[10px] bg-[#00DF9B] border-[5px] border-[#CFFFF0] w-full md:w-full h-[200px] items-center">
        {renderAccountName()}
        <div className="mb-7 justify-center items-center flex text-[35px] w-24 font-bold rounded-full bg-[#00B981] text-[#000000]/60 golden-text-shadow" >.bit</div>
    </div>
    <div className="grow owner-summary-grid-bg rounded-[10px] grid grid-cols-2 px-4 py-3.5 w-full md:grid-cols-4 lg:grid-cols-5 auto-cols-max justify-center align-items-center">
        
        {dataGridInfo?.map((item,i) => {
            return renderGridCell(item, i);
        })} 
      </div>
    </div>
    )
}

export default BitOwnerSummary