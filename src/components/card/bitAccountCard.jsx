import { list } from 'postcss';
import React, {useState} from 'react'
import { useTranslation } from 'react-i18next';

//import './bitSimpleCard.css'
import { numberFormatter,getAccountMarketLink} from '../../utils/helper';

const BitAccountCard = (props) => {

    const initAccount = props.detail;
    // yixiu.bit -> yixiu
    const accountName = initAccount.account.substring(0, initAccount.account.length-4);   

    const [accountDetail, setAccountDetail] = useState(initAccount)

    const [t] = useTranslation();

    const parseDiffFromNow = (endTime) => {
        const second = (endTime - Date.now()) / 1000
        if (second < 0) {
          throw Error('End timestamp must be bigger than start timestamp')
        }
        const hour = Math.floor((second / 3600) % 24)
        const day = Math.floor(second / 3600 / 24)
        return `${day} days ${hour} hrs`
    }

    const formatExpireTime = () => {
        let timestamp = accountDetail.expired_at;
        
        let date = new Date(timestamp * 1000);

    /*    let strTime = "" + date.getFullYear()+
                    "-"+("0" + (date.getMonth()+1)).slice(-2) +
                    "-"+("0" + (date.getDate())).slice(-2) +
                    " "+("0" + (date.getHours())).slice(-2) +
                    ":"+("0" + (date.getMinutes())).slice(-2) +
                    ":"+("0" + (date.getSeconds())).slice(-2) ;                    
    */
        
        let strTime = "" + date.getFullYear()+
                    "-"+("0" + (date.getMonth()+1)).slice(-2) +
                    "-"+("0" + (date.getDate())).slice(-2) ;  

        return strTime;
    }

    const renderExpireInfo = () => {
        let expired_at = accountDetail.expired_at;
        const second = (expired_at - Date.now() / 1000);
        let renew_url = `https://data.did.id/${accountDetail.account}?action=renew&channel=seekdid.bit`
        if (second < 0) {
            // expired, tips to recycle
            return <><div className="flex flex-col text-[12px] text-center text-[#EB5757]">
                        {t('accountlist.to-be-recycled')}
                    </div>
                    <div className="flex place-content-center">
                        <a className="flex-grow-0 text-[12px] text-center text-[#fff] bg-[#EB5757] rounded-[8.5px] w-1/2" href={renew_url} rel="noopener noreferrer" target="_blank">
                        {t('accountlist.renew-now')}
                        </a>
                    </div>
                </>
          
        }
        else if (second > 0 && second < 30 * 24 * 60 * 60) {
            // expired in 30 days, tips to renew
            return <><div className="flex flex-col text-[12px] text-center text-[#EB5757]">
                        {t('accountlist.expiry-at')}{formatExpireTime()}

                    </div>
                    <div className="flex place-content-center">
                        <a className="flex-grow-0 text-[12px] text-center text-[#fff] bg-[#EB5757] rounded-[8.5px] w-1/4" href={renew_url} rel="noopener noreferrer" target="_blank">
                        {t('accountlist.renew')}
                        </a>
                    </div>
                </>   
        }
        else {
            // expired after 30 days, common tips to renew
            return <><div className="flex flex-col text-[12px] text-center font-light font-[#5D6880]">
                        {t('accountlist.expiry-at')}{formatExpireTime()}
                    </div>
                    <div className="flex place-content-center">
                        <a className="flex-grow-0 text-[12px] text-center text-[#fff] bg-[#2471FE] rounded-[8.5px] w-1/4" href={renew_url} rel="noopener noreferrer" target="_blank">
                        {t('accountlist.renew')}
                        </a>
                    </div>
                </>
        }

    }

    const renderPriceArea = () => {
        let markets = accountDetail.listing_for_sale;
        if (markets && markets.length > 0) {
            // 有挂单时显示挂单价格
            let listingInfo = markets[0];
            if (listingInfo) {
                if (!listingInfo.symbol) {
                    console.log('error, listingInfo.symbol is undefined, account:', accountDetail.account);
                    if (listingInfo.from === 'didtop') {
                        listingInfo.symbol = 'CKB';
                    }
                    else if (listingInfo.from === 'opensea') {
                        listingInfo.symbol = 'ETH';
                    }
                    else {
                        listingInfo.symbol = 'ETH';
                    }
                }
                return  <div className='flex flex-row h-6 justify-center'>
                        <img className='h-4 mt-1' src={`images/marketplaces/symbol-${listingInfo.symbol.toLowerCase()}.svg`} alt={`logo-${listingInfo.from}`} ></img>
                        <span className='text-sm mt-1 ml-2 whitespace-nowrap' >{`${numberFormatter(listingInfo.price, 2)} ${listingInfo.symbol}`}</span>
                        <a className="group h-[24px] w-[72px] bg-[#00DF9B] ml-2 rounded-full pt-1 text-center text-[#fff] text-[12px] group-hover:text-black group-hover:bg-[#aabb00] font-semibold" href={getAccountMarketLink(listingInfo.from, accountDetail.account)} rel="noopener noreferrer" target="_blank">
                            🛒{t("accountlist.buy")}
                        </a> 
                    </div>
            }   
        }

        return  <a className="group w-[120px] h-[24px] bg-[#2471FE] rounded-full pt-1 text-center text-[#fff] text-[12px] group-hover:text-black group-hover:bg-[#aabb00] font-semibold" href={getAccountMarketLink('didtop', accountDetail.account)} rel="noopener noreferrer" target="_blank">
                    📢 {t("accountlist.make-offer")}
                </a> 
    }

    const renderListingMarket = () => {
        let markets = accountDetail.listing_for_sale;
        if (markets && markets.length > 0) {
            let listingInfo = markets[0];
            let from_dittop = listingInfo.from === "didtop";
            let from_opensea = listingInfo.from === "opensea";

            if (from_opensea) {
                return <>
                <div className="flex flex-row gap-5 place-content-center">
                    <a href={getAccountMarketLink('opensea', accountDetail.account)} rel="noopener noreferrer" target="_blank">
                        <img className={`h-[24px] rounded-full`} src={`images/marketplaces/${'opensea'}-color.svg`} alt={`logo-${'opensea'}`} ></img>
                    </a>
                    <a href={getAccountMarketLink('looksrare', accountDetail.account)} rel="noopener noreferrer" target="_blank">
                        <img className={`h-[24px] rounded-full`} src={`images/marketplaces/${'looksrare'}-color.svg`} alt={`logo-${'looksrare'}`} ></img>
                    </a>
                    <a href={getAccountMarketLink('x2y2', accountDetail.account)} rel="noopener noreferrer" target="_blank">
                        <img className={`h-[24px] rounded-full`} src={`images/marketplaces/${'x2y2'}-color.svg`} alt={`logo-${'x2y2'}`} ></img>
                    </a>
                    <img className={`h-[24px] rounded-full opacity-25`} src={`images/marketplaces/${'didtop'}-color.svg`} alt={`logo-${'didtop'}`} ></img>
                </div> 
                <div className="flex h-[30px] place-content-center ">
                    {renderPriceArea()}
                </div>
            </>
            }
            else {
                return <>
                <div className="flex flex-row gap-5 place-content-center">
                    <img className='h-[24px] rounded-full opacity-25' src={`images/marketplaces/${'opensea'}-color.svg`} alt={`logo-${'opensea'}`} ></img>
                    <img className='h-[24px] rounded-full opacity-25' src={`images/marketplaces/${'looksrare'}-color.svg`} alt={`logo-${'looksrare'}`} ></img>
                    <img className='h-[24px] rounded-full opacity-25' src={`images/marketplaces/${'x2y2'}-color.svg`} alt={`logo-${'x2y2'}`} ></img>
                    <a href={getAccountMarketLink('didtop', accountDetail.account)} rel="noopener noreferrer" target="_blank">
                        <img className='h-[24px] rounded-full' src={`images/marketplaces/${'didtop'}-color.svg`} alt={`logo-${'didtop'}`} ></img>
                    </a>
                </div> 
                <div className="flex h-[30px] place-content-center">
                    {renderPriceArea()}
                </div>
            </>
            }
        }

        return <>
                <div className="flex flex-row gap-5 place-content-center">
                    <img className='h-[24px] rounded-full opacity-25' src={`images/marketplaces/${'opensea'}-color.svg`} alt={`logo-${'opensea'}`} ></img>
                    <img className='h-[24px] rounded-full opacity-25' src={`images/marketplaces/${'looksrare'}-color.svg`} alt={`logo-${'looksrare'}`} ></img>
                    <img className='h-[24px] rounded-full opacity-25' src={`images/marketplaces/${'x2y2'}-color.svg`} alt={`logo-${'x2y2'}`} ></img>
                    <img className='h-[24px] rounded-full opacity-25' src={`images/marketplaces/${'didtop'}-color.svg`} alt={`logo-${'didtop'}`} ></img>
                </div> 
                <div className="flex h-[30px] place-content-center">
                    {renderPriceArea()}
                </div>
            </>
    }

    /*
    const formatCKBPrice = () => {
        let ckbPrice = getAccountDetailField('price_ckb');
        if (!ckbPrice) {
            return '0 CKB';
        }

        let realPrice = ckbPrice/100000000;
        let value = "".concat(realPrice).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                      return "".concat(s, ",");
        });
        
        return value + ' CKB';
    }
    */
    
    // 根据账号长度计算字体大小
    const calcAccountNameFontSize = () => {
        let maxFontSize = 30;   // 11 个字符时
        let minFontSize = 14;   // 23 个字符时
        let accountLen = accountName.length;
        if (accountLen > 22) {
            return minFontSize;
        }

        if (accountLen < 11) {
            return maxFontSize;
        }
        
        let fontSize = (30 - (30-14)/(23-11)*(accountLen-11)-4).toFixed(0)-1;
        if (fontSize < minFontSize) {
            fontSize = minFontSize;
        }

        return fontSize;
    }

    const renderAccountName = () => {

        let font_Size = calcAccountNameFontSize();
        //let style = {{'font-size': `${fontSize}px`}}
        return  <div className="flex flex-col h-12">
                    <span className={`px-2 h-full text-center font-semibold break-all`} style = {{fontSize: `${font_Size}px`}}>{accountName}</span>
                </div>
    }

    return (<div className="p-2.5 flex flex-col gap-3.5 bg-box  shadow-[0_0_10px_0px_rgba(0,0,0,0.3)] w-full md:w-[250px] h-[300px] rounded-[10px] ">
                <div className="flex flex-row h-[14px] pl-2.5">
                    <img className="h-[14px]" src={'images/seekdid/logo_1_5@10x.svg'}/>
                </div> 
                <div className="w-full h-[160px] flex flex-col gap-2 justify-center align-items-center bg-[#00DF9B] text-[#fff] rounded-[10px]">
                    {renderAccountName()}
                    
                    <div className="flex place-content-center">
                        <div className="flex flex-col text-[20px] font-bold bg-[#00B981] w-[60px] text-center rounded-[22.5px]">
                        .bit 
                        </div>
                    </div>
                    {renderExpireInfo()}
                </div>
                {renderListingMarket()}
            </div>
    )
}

export default BitAccountCard