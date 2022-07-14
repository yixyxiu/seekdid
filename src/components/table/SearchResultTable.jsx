import React, {useState} from 'react'
import { useTranslation } from 'react-i18next';

import {Card, Space, Tooltip, Button, Table, Tag} from 'antd';

import * as spritejs from 'spritejs';   // 头像用到
import md5 from 'blueimp-md5';
import AVATAR_MASK from '../../assets/images/avatar-mask.png';

import REG_DAS_LOGO from '../../assets/images/ic-registrar-das.png';

import SEEKDID_LOGO from '../../assets/images/logo-green.webp'
import {FIGURE_PATHS, COLORS, getColors, getPositions, getFigurePaths} from "../../utils/bitAvata"


import localChace from '../../utils/localCache';

import { 
    AccountStatusColors, 
    DASACCOUNTSTATUS, 
    getAccountStatusString,
    getAccountStatusLinkTitle
} from '../../constants/constants';

import {das} from '../../utils/bitModalMgr';
import { getAvatar } from '../../utils/bitAvata';
import { numberFormatter } from '../../utils/helper';





const SearchResultTable = props => {
    let state = {
        isNarrowScreen: false,
        accountOpenInfoList:[],
        DASMarketData:[],
        focusItem:''

    };
    const [t] = useTranslation();

    const [expendedItem, setExpended] = useState();

    const expend = (index) => {
        if (expendedItem === index) {
            setExpended(undefined);
        }
        else  {
            setExpended(expendedItem);
        }
    };

    let localeAllMatch = {
        emptyText: (
          <span>
              <div><img src={SEEKDID_LOGO} height='48px' alt="" /></div>
            <p>
                {t('toast.empty-data-main')}                  
            </p>
          </span>
        )
    };

    // 查询账号是否在市场挂单
    const  searchAccountFromMarket = async (account) => {
        
    }

    const getDASRegisterLink = (account) => {
        return "https://app.did.id/account/register/" + account + "?inviter=cryptofans.bit&channel=cryptofans.bit"
    }
        
    const goDASRegister = record => {
        let account = record.name ? record.name : record;
        let url = getDASRegisterLink(account);
        this.openLink(url, "DasReg" + account);  
    }

    const select = record => {
        // window.open("https://app.did.id/account/register/" + record.name + "?inviter=cryptofans.bit&channel=cryptofans.bit", "newW")
        let status = record.status[0];
        if (status === DASACCOUNTSTATUS.Registered) {
            if (-1 != record.status.indexOf(DASACCOUNTSTATUS.OnSale)) {
                status = DASACCOUNTSTATUS.OnSale;
            }
        }
                        
        // 如果是窄屏幕（手机），则在本页打开，否则新开窗口。
        let url = "";
        switch (status) {
            case DASACCOUNTSTATUS.Registered: 
            //    url = "https://" + record.name + t("dascc-host");
            //    this.openLink(url, 'view_host_'+record.name);
                url = "https://did.top/account/" + record.name + "?inviter=cryptofans.bit";
                this.openLink(url, 'make_offer_'+record.name);
                break;
            case DASACCOUNTSTATUS.ScheOpen: 
                this.openLink(t("das-limit-link"));
                break;
            case DASACCOUNTSTATUS.OnSale: 
                url = "https://did.top/account/" + record.name + "?inviter=cryptofans.bit";
                this.openLink(url, 'view_market_'+record.name);
                break;
            case DASACCOUNTSTATUS.Reserved: 
                this.openLink(t("das-claim-link"));
                break;
            case DASACCOUNTSTATUS.Registering: 
                url = "https://app.did.id/explorer/account/" + record.name;
                this.openLink(url);
                break;
            case DASACCOUNTSTATUS.NotOpen: 
                this.openLink(t("das-limit-link"));
                break;
            default:
                break; 
        }
        
        state.focusItem = record.name;
    }

    // 考虑到不同状态、不同设备，需要特殊处理列字断
    const getTableColumns = () => {
        let columns = [];
        
        columns.push(
            {
                dataIndex: 'fav',
                key: 'fav', 
                width: 10, 
                render: (text, record, index) => {
                    if (localChace.isFavorite(record.name)) {
                        // 自选
                        return <Tooltip placement="topLeft" title={''}>
                            <span className="fa fa-star fa-favorite-sel" onClick={() => localChace.removeFromFavorite(record.name)}></span>
                        </Tooltip>
                    }
                    else {
                        // 非自选
                        return <Tooltip placement="topLeft" title={t('toast.unfavorite-item-tip')}>
                            <span className="fa fa-star fa-favorite-unsel" onClick={() => localChace.addToFavorite(record.name)}></span>
                        </Tooltip>
                    }
                    
                },
            }
        )
        if (!state.isNarrowScreen) {
            columns.push(
                {
                    dataIndex: 'avatar',
                    key: 'name', 
                    width: 50,                   
                    render: (text, record, index) => {
                        {
                            //console.log('avatar drawing')
                            let nameMD5 = md5(record.name)
                            let id = `img${nameMD5}`
                            let dom = <div id={id} style={{width: "32px", height: "32px"}}></div>
                            setTimeout(() => {
                                getAvatar(id, record.name)
                            }, 10)
                            
                            return dom
                        }
                        
                    },
                }
            )
        }
        
        columns.push(
            {
                title: '可选账号',
                dataIndex: 'name',
                key: 'name',
                minWidth:60,
                /*
                render: (text, record, index) =>{
                    return (
                        <div className="das-account-info-wrapper">
                        <div className="das-account-name">{text}</div> 
                        {record.status.map(status => {
                        let color = AccountStatusColors[status];
                    
                        return (
                        <Tag color={color} key={status} className="das-account-status-tag">
                        {getAccountStatusString(status)}
                        </Tag>
                        );
                        })}
                        </div>
                    )}*/
            },
            {
                title: '状态',
                key: 'status',
                dataIndex: 'status',
                width:50,
            /*    defaultSortOrder: 'ascend',
                sorter: {
                    compare: (a, b) => a.status[0] - b.status[0],
                },*/
                render: (text, record, index) => (
                <>

                    {record.status?.map(status => {
                        let color = AccountStatusColors[status];
                        
                        let otherTag = '';

                        if (record.name in state.accountOpenInfoList) {
                            otherTag = <><Tag color={color} key={status}>
                            {t("das-will-open-tips")}
                            </Tag>
                            <Tag color={color} key={status}>
                                {state.accountOpenInfoList[record.name]}
                            </Tag></>
                        }
                        else {
                            otherTag = <><Tag color={color} key={status}>
                                    {getAccountStatusString(status)}
                                    </Tag></>
                        }

                        // 如果上次查过在市场上挂单，则修改状态
                        if (status === DASACCOUNTSTATUS.Registered) {
                            if (record.name in state.DASMarketData) {

                            } 
                            else {
                                // 搜索
                                searchAccountFromMarket(record.name);
                            }   
                        }
                            
                        if (status === DASACCOUNTSTATUS.OnSale) {
                            if (record.price) {
                                let value = numberFormatter(record.price, 2);
                                return (
                                    <Tag color={color} key={status}>
                                    {getAccountStatusString(status)}<span className="das-account-price"> 🍔 {value} CKB</span>
                                    </Tag>
                                );
                            }
                            else {
                                return (
                                    otherTag
                                );
                            }
                        }
                        else {
                            return (
                                otherTag
                            );
                        }
                        
                        })}
                        
                </>
                ),
            },
            /*{
                title: '价格',
                key: 'price',
                dataIndex: 'price',
                render: (text, record, index) => {
                    if (record.price) {
                        let value = numberFormatter(record.price, 2);
                        return <span className="das-account-price">🍔 {value} CKB</span>
                    }
                }
            },*/
            {
                title: '操作',
                width: state.isNarrowScreen ? 100 : undefined,
                key: 'action',
                align: 'right',
                render: record => {
                    //console.log('record add:' + record.name + ',' + state.focusItem)
                    // 状态数组中，第一个状态为注册状态
                    if (record.status[0] === DASACCOUNTSTATUS.Available) {
                        //console.log('record:' + record)
                        // 状态可用，且当前帐号是用户此前选择的账号   
                        if (state.focusItem === record.name) {
                            return <div className="dasla-register-container">
                                
                            <div className="dasla-btn-register-wraper">
                            <Tooltip placement="topRight" title={t('registry-das-supprts')}>
                                <Button className="dasla-btn-register-account" size={'normal'} shape="round"
                                    onClick={() => goDASRegister(record)}>{t('goto-register-btn')}</Button>
                                <img src={REG_DAS_LOGO}  alt="" className="image-5"/>
                            </Tooltip>
                            </div>
                            </div>        
                        
                        }
                        else {
                            return <Space size="small">
                            <Button className="dasla-btn-select-account" size={'normal'} shape="round"
                                    onClick={() => select(record)}>{t('register-btn')}</Button>
                        
                            </Space>
                        }
                    }
                    else {
                        let status = record.status[0];
                        if (status === DASACCOUNTSTATUS.OnSale) {
                                return <Space size="small">
                                        <Button className="dasla-btn-select-account" size={'normal'} shape="round"
                                        onClick={() => select(record)}>{getAccountStatusLinkTitle(status)}</Button>
                                        </Space>
                        }
                        
                        return <Space size="small">
                        <Button type="primary" size={'normal'} shape="round"
                                    onClick={() => select(record)}>{getAccountStatusLinkTitle(status)}</Button>
                        
                            </Space>
                    }
                },
            }
        )

        return columns;
    }
    const getPagination = (dataSrc) => {
            
        let multiPage = false;
        
        multiPage = dataSrc && (dataSrc.length > 10);
        let pagination = {
            showSizeChanger: multiPage ? true : false,
            showQuickJumper: multiPage ? true : false,
        }

        return pagination;
    }

    return (
        <div>SearchResultTable
            <Table locale={localeAllMatch} rowKey={(item) => item.id} dataSource={props.data} columns={getTableColumns()}
                rowClassName='das-account-name' showHeader={false} pagination={getPagination(props.data)} />

            <div class="w-full visible wow animate__ animate__fadeIn animated animated" data-wow-delay=".1s">
                <div class="w-full gap-1.5 grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 py-4">
                {props.data ?.map((item, index) => {
            
                return <div class="relative flex gap-1 items-center rounded-lg bg-box box dark:dark-box shadow hover:shadow-lg hover-up-2">
                        <div class="min-h-[24px] h-full px-1 border-b border-gray-300 dark:border-gray-800 shadow bg-green-400"></div>
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check min-w-[32px] text-2xl text-green-400" role="img" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"></path>
                            </svg>
                        </span>
                        <a class="py-2 flex grow cursor-pointer" href={`/profile/${item.name}`} rel="noopener noreferrer" target="_blank">
                            <p class="break-all text-md lg:text-lg font-semibold text-primary hover:text-hover">{item.name}</p>
                        </a>
                        <div class="px-2 flex justify-end items-center flex-row gap-2">
                            <span>
                            <button class="cursor-pointer flex justify-center items-center group">
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bag-shopping" class="svg-inline--fa fa-bag-shopping text-[26px] group-hover:md:text-hover text-accent" role="img" viewBox="0 0 448 512">
                                    <path fill="currentColor" d="M112 112C112 50.14 162.1 0 224 0C285.9 0 336 50.14 336 112V160H400C426.5 160 448 181.5 448 208V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V208C0 181.5 21.49 160 48 160H112V112zM160 160H288V112C288 76.65 259.3 48 224 48C188.7 48 160 76.65 160 112V160zM136 256C149.3 256 160 245.3 160 232C160 218.7 149.3 208 136 208C122.7 208 112 218.7 112 232C112 245.3 122.7 256 136 256zM312 208C298.7 208 288 218.7 288 232C288 245.3 298.7 256 312 256C325.3 256 336 245.3 336 232C336 218.7 325.3 208 312 208z"></path>
                                </svg>
                            </button>
                            </span>
                            <span>
                            <a class="flex justify-center items-center group" target="_blank" rel="noreferrer" href="https://app.ens.domains/name/nervosyixiu.eth/register">
                                <svg xmlns="http://www.w3.org/2000/svg" class="fill-gray-200 dark:fill-[#131317] text-white dark:text-boxsecondary group-hover:fill-amber-400" width="37" height="37" viewBox="0 0 194 194" fill="none">
                                    <path d="M168 93C168 132.212 136.212 164 97 164C57.7878 164 26 132.212 26 93C26 53.7878 57.7878 22 97 22C136.212 22 168 53.7878 168 93Z" fill=""></path>
                                    <path d="M66.6996 69.4713C67.5542 67.8863 68.7875 66.535 70.2907 65.5367L95.5182 48L69.6695 90.5491C69.6695 90.5491 67.411 86.7495 66.5302 84.8272C65.4326 82.41 64.879 79.7831 64.9083 77.1306C64.9375 74.478 65.549 71.8639 66.6996 69.4713ZM56.2879 98.8229C56.5727 102.892 57.7276 106.853 59.6751 110.442C61.6226 114.03 64.3179 117.163 67.5804 119.631L95.4842 139C95.4842 139 78.026 113.954 63.3005 89.0315C61.8097 86.3985 60.8075 83.5196 60.3419 80.5329C60.1358 79.1804 60.1358 77.8048 60.3419 76.4523C59.958 77.1605 59.2127 78.6106 59.2127 78.6106C57.7195 81.642 56.7027 84.8836 56.1976 88.2221C55.9068 91.7512 55.937 95.2992 56.2879 98.8229ZM127.431 102.195C126.527 100.273 124.291 96.4734 124.291 96.4734L98.4881 139L123.716 121.475C125.219 120.476 126.452 119.125 127.307 117.54C128.457 115.147 129.069 112.533 129.098 109.881C129.127 107.228 128.574 104.601 127.476 102.184L127.431 102.195ZM137.673 88.1884C137.388 84.1194 136.233 80.158 134.286 76.5694C132.338 72.9808 129.643 69.8479 126.381 67.3804L98.5219 48C98.5219 48 115.969 73.0461 130.706 97.9685C132.192 100.602 133.191 103.481 133.653 106.467C133.859 107.82 133.859 109.195 133.653 110.548C134.037 109.84 134.782 108.389 134.782 108.389C136.275 105.358 137.292 102.116 137.797 98.7779C138.092 95.2491 138.065 91.7011 137.718 88.1771L137.673 88.1884Z" fill="currentColor"></path>
                                </svg>
                            </a>
                            </span>
                            <div class="mt-0.5">
                            <span>
                                <button class="flex justify-center items-center group">
                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart text-gray-200 dark:text-box text-[26px] group-hover:md:text-hover" role="img" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"></path>
                                    </svg>
                                </button>
                            </span>
                            </div>
                        </div>
                    </div>})}
                </div>
                <div class="flex w-full justify-center items-center flex-row rounded-lg px-4 py-4"></div>
            </div>
        </div>
    )
}


export default SearchResultTable;

   