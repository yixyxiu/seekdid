import {currentLanguage} from './i18n';
import {Buffer} from 'buffer';
import blake2b from 'blake2b'
import BN from 'bn.js'
//let blake2b = require('blake2b');

const URL_PREFIX_OPENSEA = 'https://opensea.io/assets/ethereum/';
const URL_PREFIX_LOOKSRARA = 'https://looksrare.org/collections/';
const URL_PREFIX_X2Y2 = 'https://x2y2.io/eth/';
const URL_PREFIX_DIDTOP = 'https://did.top/account/'

const BIT_ERC721_CONTRACTADDR = '0x60eB332Bd4A0E2a9eEB3212cFdD6Ef03Ce4CB3b5';

export function numberFormatter(num, digits) {
    if (!num) {
        return '-';
    }

    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    
    let locale = currentLanguage();

    // 中文的习惯，使用万，百万。。
    if (locale.indexOf("zh") !== -1) {
        si = [
            { value: 1, symbol: "" },
            { value: 1E4, symbol: "万" },
            { value: 99999900, symbol: "亿" }
          ];
    }

    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }

    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

/**
 * .bit account -> erc721 nft accountid
 * @param {*} account: nervosyixiu.bit
 */
export default function accountIdHex (account) {
    const personal = Buffer.from('ckb-default-hash')
    const accountBuf = Buffer.from(account)
    const hasher = blake2b(32, null, null, personal)
    hasher.update(accountBuf)
    const hashBuffer = hasher.digest('binary')
    const first20Bytes = Buffer.from(hashBuffer.slice(0, 20))

    const tokenId = new BN(first20Bytes.toString('hex'), 16).toString(10)
    
    return tokenId
}

export function pad0x(str) {
    return str.startsWith('0x') ? str : `0x${str}`
}

/**
 * 
 * @param {*} marketSrc : opensea，looksrara，x2y2，did.top
 * @param {*} account : full account name, eg: nervosyixiu.bit
 * return : https://**** ....
 */
export function getAccountMarketLink(marketSrc, account) {
    let market = marketSrc.toLowerCase();
    let url = '';

    switch (market) {
        case "opensea":
            url = `${URL_PREFIX_OPENSEA}${BIT_ERC721_CONTRACTADDR}/${accountIdHex(account)}`;
            break;
        case "looksrare":
            url = `${URL_PREFIX_LOOKSRARA}${BIT_ERC721_CONTRACTADDR}/${accountIdHex(account)}`;
            break;
        case "x2y2":
            url = `${URL_PREFIX_X2Y2}${BIT_ERC721_CONTRACTADDR}/${accountIdHex(account)}`;
            break;
        default:
            url = `${URL_PREFIX_DIDTOP}${account}?inviter=seekdid.bit&channel=seekdid.bit`;
    }

    return url;
}


export const formatData = (data) => (data < 10 ? `0${data}` : data)

export const timestampToString = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getFullYear()}/${formatData(date.getMonth() + 1)}/${formatData(date.getDate())} ${formatData(
    date.getHours(),
  )}:${formatData(date.getMinutes())}:${formatData(date.getSeconds())}`
}
