
import {Buffer} from 'buffer';
import {DASACCOUNTSTATUS, DASOPENEPOCH} from '../constants/constants';


let blake2b = require('blake2b');
export const das = require('../constants/data/registered.json');
das.suffixList = require('../constants/data/suffix.json');
das.prefixList = require('../constants/data/prefix.json');
das.reserved = require('../constants/data/reserved.json');
das.recommendList = []//require('../constants/data/recommendList.json');
das.banners = require('../constants/config/banners.json');
das.linkResources = require('../constants/config/linkResources.json');
das.ownerStat = []//require('../constants/data/accountsOwner.json');
das.hotAccounts = []//require('../constants/data/hot_accounts.json');
das.appointments = []//require('../constants/data/appointments.json');    // 开放结束后，将其设置为空数组
das.recentRegData = [];
das.recentOwnerData = [];

export class dotbitModalMgr {
    globalVal = 1;
    lang = 'zh';

    cacheData = {
        DASMarketData : []
    };

    constructor(){
        console.log("--- dotbitModalMgr constructor ---")
    }


    setLanguage = (language) => {
        this.lang = language;
        console.log(this.lang);
    }

    getLanguage = () => {
        return this.lang;
    }

    // 检测是否可以注册,text 为不加.bit 后缀的字符串
    canRegister = (text) => {
        
        if (text.length < 4)
            return false;

        // 虽然 > 10 < 47 位都可以注册，但考虑到太长的账号没意义，在此只用15个字符以内的
        if (text.length > 9 && text.length < 20)
            return true;

        // 4-9 位的，算法决定
        text += '.bit';
        var hash = blake2b(32, null, null, Buffer.from('2021-07-22 12:00'));
        hash = hash.update(Buffer.from(text));
        var output = new Uint8Array(32)
        var out = hash.digest(output);

        let arr = out.slice(0,4);
        let uintValue = this.toBeUint32(arr);

        let localTime = new Date()
        // console.log('old: ' + uintValue);
        if (uintValue <= this.getCanRegistValue(localTime)) {
        //    console.log(text, arr, uintValue);
            return true;
        }

        return false
    }

    // 获取当前时间可注册的值（前4字节转换成Uint32后）
    getCanRegistValue = (localTime) => {
    
        let percents = 0.35;
        // 处于中间的区间
        for (let j = 0; j < DASOPENEPOCH.length; j++) {           
            if ((j < DASOPENEPOCH.length -1 ) && ((localTime >= DASOPENEPOCH[j].time) && (localTime < DASOPENEPOCH[j+1].time))) {
            	//console.log('find' + j)
                percents = DASOPENEPOCH[j].open_percents;
                break;
            }
        }
		
        if (localTime > DASOPENEPOCH[DASOPENEPOCH.length-1].time) {
            percents = DASOPENEPOCH[DASOPENEPOCH.length-1].open_percents;
        }
            
        let value = 4294967295 * percents;
		//console.log(localTime + ' need:' + value)

        return value;
    }


    getAccountOpenTimeString = (account) => {
        // 开放结束，返回null
        return undefined;// todo，再开放时再打开。


        let openTime = DASOPENEPOCH[0].tips;

        if (account.length < 4)
            return openTime;

        // 虽然 > 10 < 47 位都可以注册，但考虑到太长的账号没意义，在此只用15个字符以内的
        if (account.length > 9 && account.length < 20)
            return openTime;

        // 4-9 位的，算法决定
        account += '.bit';
        var hash = blake2b(32, null, null, Buffer.from('2021-07-22 12:00'));
        hash = hash.update(Buffer.from(account));
        var output = new Uint8Array(32)
        var out = hash.digest(output);
        
        
        let arr = out.slice(0,4);
        let uintValue = this.toBeUint32(arr);

        for (let index = 0; index < DASOPENEPOCH.length; index++) {
            const element = DASOPENEPOCH[index];
            if (uintValue <= element.parameters) {
                return element.tips;
            }

        }

        return undefined;
    }

    getAccountListByFilter = (dataSrcList, accountStatus) => {
        //console.log('getAccountListByFilter, accountStatus:' + accountStatus);
        if (accountStatus === "-1") {
            //console.log(JSON.stringify(dataSrcList));
            return dataSrcList;
        }
        
        let result = [];
        for ( let i in dataSrcList) {
            let account = dataSrcList[i];
            //console.log('getAccountListByFilter' ,accountStatus,account)
            if (account.status[0] === accountStatus) {
                result.push(account);
            }
        }

        // 按字符长度排序
        if (result.length > 1) {
            result.sort((a, b) => {
                return (a.name.length - b.name.length)
             });
        }

        return result;
    }

    // 数组转化成uint32
    toBeUint32 = (byteArray) => {
        if (!byteArray)
            return 0;
            
        let value = 0;
    //    for (var i = 0; i < byteArray.length; i++) {
    //        value = (value << 8) | byteArray[i];
    //    }
      /*  for (var i = byteArray.length - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }*/
    
        for (var i = 0; i < byteArray.length; i++) {
            value = (value * 256) + byteArray[i];
        }

        return value;
    }

    /**
     * 
     * @param {*} wordList 
     * @param {*} filters : object like {status: DASACCOUNTSTATUS.NotOpen}
     * @returns 
     */
    localSearch = (wordList, filters) => {
        let reserved = das.reserved;
        let registered = das.registered;
        let result = [];
        let arr = [];
        let dateData = {};

        //this.setState({isLoadingMain: true});

        //console.log(wordList)
        for (let i = 0; i < wordList.length; i++) {
            let item = wordList[i];

            //去标点符号并转小写
            item = item.replace(/\s/g, "").replace(/[^a-zA-Z0-9\-]/g, "").toLowerCase();
            //过滤非数字和字母组合
            if (/^[a-zA-Z\-\d]+$/.test(item)) {
                // 大于20位的，das.la 不推荐，小于4位的不支持
                if (item.length < 4 || item.length > 20) {
                    continue;
                }
                
                // 注意，下面的status附值顺序不能乱动
                let accountStatus = DASACCOUNTSTATUS.NotOpen;
                let account = item + '.bit';
                if (this.canRegister(item)) {
                    accountStatus = DASACCOUNTSTATUS.Available;                  
                }

                if (reserved.includes(account)) {
                    accountStatus = DASACCOUNTSTATUS.Reserved;
                }

                let price = undefined;
                if (registered.includes(account)) {
                    accountStatus = DASACCOUNTSTATUS.Registered;

                    // 如果上次查过在市场上挂单，则修改状态
                    if (account in this.cacheData.DASMarketData) {
                        // TODO， 是否需要加一个过期时间？用户一直不关闭浏览器或者不刷新浏览器，旧数据就一直在，再议。。
                        accountStatus = DASACCOUNTSTATUS.OnSale;
                        price = this.cacheData.DASMarketData[account].price_ckb/100000000;
                    }
                    else {
                    //    this.searchAccountFromMarket(account);    // 避免请求太多，加载的时候才去请求
                    }                    
                }    

                // 如果账户是未开放的，则检查该账号是什么时候开放
                let openDate = undefined;
                if (accountStatus === DASACCOUNTSTATUS.NotOpen) {
                    openDate = this.getAccountOpenTimeString(item);
                    if (openDate) {
                        this.cacheData.accountOpenInfoList[account] = openDate;
                        accountStatus = DASACCOUNTSTATUS.ScheOpen;
                        /* 抓取某一个开放窗口可注册的账号列表数据用
                        if (!dateData[openDate.toLocaleString()]) {
                            dateData[openDate.toLocaleString()] = []
                        }
                        dateData[openDate.toLocaleString()].push(item);
                        */
                    }
                }

                // 添加到结果中
                if (!arr.includes(account)) {
                    arr.push(account);
                    result.push({
                        id: result.length + 1,
                        status: [accountStatus],
                        name: account,
                        openDate: openDate,
                        price: price
                    })

                    //test.push(item);
                }
            }
        }

    //    
    //    if (result.length === 0) {
    //        this.refreshRecommendList();
    //    }
        //Todo，根据用户当前选择的过滤条件，筛选出符合过滤条件的数据
        // 按字符长度排序
        if (result.length > 1) {
            result.sort((a, b) => {
                return ((a.status[0] === b.status[0]) && (a.status[0] === DASACCOUNTSTATUS.ScheOpen) && (a.openDate-b.openDate)) || 
                (a.status[0]-b.status[0]) || (a.name.length - b.name.length)
             });
        }
        let filterList = this.getAccountListByFilter(result, filters.status ? filters.status : '-1');

        //console.log(test);
        return {
            list: filterList,
            mainTableDataList: result,
        };
    }
}



        

let dataMgr =  new dotbitModalMgr();

export default dataMgr;