import {currentLanguage} from './i18n';

export function numberFormatter(num, digits) {
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

