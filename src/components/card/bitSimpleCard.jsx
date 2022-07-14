import React, {useState} from 'react'
import { useTranslation } from 'react-i18next';

import './bitSimpleCard.css'
import accountIdHex from '../../utils/helper';

/*
props.detail : {
    "owner_chain_type":1,
    "account":"beatsaber.bit",
    "registered_at":1626956018,
    "expired_at":1690028018,
    "inviter":"",
    "status":"",
    "price_ckb":"",
    "price_usd":"",
    "profit_rate":"",
    "description":"",
}
*/



const BitSimpleDetailCard = (props) => {

    const initAccount = props.detail;
    console.log(initAccount);
    // yixiu.bit -> yixiu
    const accountName = initAccount.account.substring(0, initAccount.account.length-4);   

    const [accountDetail, setAccountDetail] = useState(initAccount)

    const [t] = useTranslation();

    const colors = ['#00E495','brown','dimgrey','chocolate',
                        'blueviolet','darkcyan','darkgoldenrod','coral','none','indianred',
                        'orangered', 'peru'];
    
    // 获取min 到 max 之间的随机数，包含min，不含 max
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
    }

    const formatAddress = (address) => {
        if (address.length < 10){
            return address;
        }

        let begin = address.substring(0,6);
        let end = address.substring(address.length-6);
        let str = begin + '...' + end;

        return str;
    }

    // 根据账号长度计算字体大小
    const calcAccountNameFontSize = () => {
        let maxFontSize = 64;   // 4 个字符时
        let minFontSize = 18;   // 非常长时
        let accountLen = accountName.length;
        if (accountLen > 15) {
            return minFontSize;
        }

        if (accountLen < 4) {
            return maxFontSize;
        }
        
        let fontSize = 64 - (64-24)/(15-4)*(accountLen-4)-5.5;
        return fontSize;
    }

    /* 
    "data": {
        "owner_chain_type":1,
        "account":"beatsaber.bit",
        "registered_at":1626956018,
        "expired_at":1690028018,
        "inviter":"",
        "status":"",
        "price_ckb":"",
        "price_usd":"",
        "profit_rate":"",
        "description":"",
    }
    */
    const getAccountDetailField = (key) => {
        if (!accountDetail) {
            return '';
        }

        if (key in accountDetail) {
            return accountDetail[key];
        }

        return '';
    }

    // 格式化持有人地址展示
    const formatOwnerAddress = () => {
        let address = getAccountDetailField('owner_address');
        if (address.length < 15) {
            return address;
        }

        return formatAddress(address);
    }

    // 格式化地址与DAS反向解析结果的显示
    const formatDASReverseRecord = () => {
        let address = getAccountDetailField('reverse_record');
        if (!address || address.length === 0) {
            return formatOwnerAddress();
        }

        if (address.length < 15) {
            return address;
        }

        return formatAddress(address);
    }

    const formatExpireTime = () => {
        let timestamp = getAccountDetailField('expired_at');
        
        let date = new Date(timestamp * 1000);
        console.log(date);

        let strTime = "" + date.getFullYear()+
                    "-"+("0" + (date.getMonth()+1)).slice(-2) +
                    "-"+("0" + (date.getDate())).slice(-2) +
                    " "+("0" + (date.getHours())).slice(-2) +
                    ":"+("0" + (date.getMinutes())).slice(-2) +
                    ":"+("0" + (date.getSeconds())).slice(-2) ;                    
        
        return strTime;
    }

    const parseDiffFromNow = (endTime) => {
        const second = (endTime - new Date.now()) / 1000
        if (second < 0) {
          throw Error('End timestamp must be bigger than start timestamp')
        }
        const hour = Math.floor((second / 3600) % 24)
        const day = Math.floor(second / 3600 / 24)
        return `${day} days ${hour} hrs`
    }

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

    const formatAccountDescription = () => {
        let desc = getAccountDetailField('description');
        if (!desc) {
            desc = '----------'
        }
        return desc;
    }

    const viewMarketAccount = () => {
        let url = "https://did.top/account/" + accountDetail.account + "?inviter=cryptofans.bit&channel=cryptofans.bit";
        //https://did.top/account/oline.bit?inviter=00711.bit&
        this.props.parent.openLink(url, 'view_market_' + accountDetail.account);
    }

    const renewAccount = () => {
        let url = "https://data.did.id/" + accountDetail.account +  "?action=renew&channel=seekdid.bit";
        this.props.parent.openLink(url, 'renew_account_' + accountDetail.account);
    }
    
    return (<div className="relative cursor-pointer flex flex-col rounded-lg p-4 hover-up-2 bg-secondary w-[300px] min-h-[350px] bg-box-shadow"> 
                <div className="mini-card-owner-row">
                <img src={`https://identicons.did.id/identicon/${accountDetail.account}`} style={{height: "32px", width: "32px",borderRadius: "32px"}}></img>
                    <div className="author-name">{formatDASReverseRecord()}</div>
                </div>
                <div className="mini-card-describle-row">
                    <div className="fa fa-quote-left fa-card-quote-left"></div>
                    <div className="account-describle">{formatAccountDescription()}</div>
                    <div className="fa fa-quote-right fa-card-quote-right"></div>
                </div>
                {/*min-h-[140px] flex flex-col items-center justify-between rounded-lg bg-box-shadow*/}
                <div className="golden-das-name-container" style={{backgroundColor: colors[getRandomInt(0, colors.length-1)]}}>
                    <div className="golden-das-name px-2"style={{fontSize: calcAccountNameFontSize()}}>{accountName}
                    </div>
                    <div className="golden-das-bit-fix">
                    .bit</div>
                </div>
                <time>
                <strong>{t('expire_time')}</strong>
                {formatExpireTime()}
                </time>
                <div className="mini-card-price">{formatCKBPrice()}
                </div>
                {console.log(accountIdHex('barbe.bit'))}
                {console.log(accountIdHex('didtop.bit'))}
                {console.log(accountIdHex('web3world.bit'))}
            </div>
    )
}

export default BitSimpleDetailCard