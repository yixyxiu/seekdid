import i18n from '../utils/i18n'


export const FIXMETHODS = {
    ASPREFIX: 1,
    ASSUFFIX: 2
}

export const DASACCOUNTSTATUS = {
    Available: '0',
    ScheOpen:'1',
    OnSale:'2',
    NotOpen: '3',
    Registered: '4',
    Reserved: '5',
    Registering: '6',
}

// 注意，顺序与上面的DASACCOUNTSTATUS保持一致
/*let AccountStatusColors = [
    Available: '0',
    Reserved: '1',
    Registering: '2',
    Registered: '3',
    NotOpen: '4',

    '#22C493',
    '#808191',
    '#FFD717',
    '#FFA800',
    '#DF4A46',
]*/

export const AccountStatusColors = {
    '0':'#2471FE',      // 可注册
    '1':'#00E09C',      // 即将开放 
    '2':'#2471FE',      // 在售
    '3':'#DF4A46',      // 未开放
    '4':'#FFA800',      // 已注册
    '5':'#808191',      // 保留
    '6':'#FFD717',      // 注册中
}
    
export const defLocalConfig= {
    "newbie-add-favorite-tip-showed": "false",
    "newbie-remove-favorite-tip-showed": "false",
};


export const DASOPENEPOCH = [
    {
        //time: new Date('2022-04-11 12:00:00 GMT'), 
        time: new Date(1649678400000), 
        open_percents: 0.55,
        parameters: 2362232012,
        tips:'04-11 12:00PM(UTC+0)',
    },
    {
        //time: new Date('2022-04-18 12:00:00 GMT'), 
        time: new Date(1650283200000), 
        open_percents: 0.60,
        parameters: 2576980377,
        tips:'04-18 12:00PM(UTC+0)',
    },
    {
        //time: new Date('2022-07-18 12:00:00 GMT'), 
        time: new Date(1658145600000), 
        open_percents: 0.60,
        parameters: 2576980377,
        tips:'07-18 12:00PM(UTC+0)',
    }
];

export const TABLEFILTER = 
{
    "zh_CN":[
        {
            "name":"全部账号",
            "key":'-1',
            "iconClass":"fa fa-list-ul dropdown-icon-fa"
        },
        {
            "name":"可注册账号",
            "key":'0',
            "iconClass":"fa fa-check-circle dropdown-icon-fa"
        },
        {
            "name":"即将开放账号",
            "key":'1',
            "iconClass":"fa fa-calendar dropdown-icon-fa"
        },
        {
            "name":"在售账号",
            "key":'2',
            "iconClass":"fa fa-usd dropdown-icon-fa"
        },
        {
            "name":"未开放的账号",
            "key":'3',
            "iconClass":"fa fa-lock dropdown-icon-fa"
        },
        {
            "name":"已注册账号",
            "key":'4',
            "iconClass":"fa fa-registered dropdown-icon-fa"
        },
        {
            "name":"系统保留账号",
            "key":'5',
            "iconClass":"fa fa-certificate dropdown-icon-fa"
        },
        {
            "name":"注册中的账号",
            "key":'6',
            "iconClass":"fa fa-exclamation-circle dropdown-icon-fa"
        }
        
    ],
    "en_US":[
        {
            "name":"All Account",
            "key":'-1',
            "iconClass":"fa fa-list-ul dropdown-icon-fa"
        },
        {
            "name":"Available",
            "key":'0',
            "iconClass":"fa fa-check-circle dropdown-icon-fa"
        },
        {
            "name":"Release soon",
            "key":'1',
            "iconClass":"fa fa-calendar dropdown-icon-fa"
        },
        {
            "name":"On Sale",
            "key":'2',
            "iconClass":"fa fa-usd dropdown-icon-fa"
        },
        {
            "name":"Not yet Open Account",
            "key":'3',
            "iconClass":"fa fa-lock dropdown-icon-fa"
        },
        {
            "name":"Rigistered",
            "key":'4',
            "iconClass":"fa fa-registered dropdown-icon-fa"
        },
        {
            "name":"Reserved Account",
            "key":'5',
            "iconClass":"fa fa-certificate dropdown-icon-fa"
        },
        {
            "name":"Rigistering",
            "key":'6',
            "iconClass":"fa fa-exclamation-circle dropdown-icon-fa"
        }
    ]
};

// 显示标签时用到
export const getAccountStatusString = (status) => {
    let tips = ""
    switch (status) {
        case DASACCOUNTSTATUS.Available: tips = i18n.t("search.status-available"); 
            break;
        case DASACCOUNTSTATUS.Reserved: tips = i18n.t("search.status-reserved"); 
            break;
        case DASACCOUNTSTATUS.ScheOpen: tips = i18n.t("search.status-wait4open");
            break;
        case DASACCOUNTSTATUS.Registering: tips = i18n.t("search.status-registering"); 
            break;
        case DASACCOUNTSTATUS.Registered: tips = i18n.t("search.status-registered"); 
            break;
        case DASACCOUNTSTATUS.NotOpen: tips = i18n.t("search.status-notopen"); 
            break;
        case DASACCOUNTSTATUS.OnSale: tips = i18n.t("search.status-onsale"); 
            break;
        default:break;
    }

    return tips;
}

export const getAccountStatusLinkTitle = (status) => {
    let title = ""
    switch (status) {
        case DASACCOUNTSTATUS.Available: title = i18n.t("register-btn"); 
            break;
        case DASACCOUNTSTATUS.OnSale: title = i18n.t("btn-title-make-offer"); 
            break;
        case DASACCOUNTSTATUS.Reserved: title = i18n.t("btn-title-claim-reserved"); 
            break;
        case DASACCOUNTSTATUS.Registering: title = i18n.t("btn-title-view-profile"); 
            break;
        case DASACCOUNTSTATUS.Registered: title = i18n.t("btn-title-make-offer"); 
            break;
        case DASACCOUNTSTATUS.NotOpen: title = i18n.t("btn-title-release-rules"); 
            break;
        default: title = i18n.t("btn-title-release-rules"); 
        break;
    }

    return title;
}

export const DONATEADDRESS = 'ckb1qyqv6sge6as66xz2clgd8ffkjwgcaqv8t5asrghkn4';
export const DASLA_CLIENTID = '36b61db1c0210f05793f2105f38e6d9cdf9617c7';