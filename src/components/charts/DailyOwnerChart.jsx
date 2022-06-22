import React, {useState, useEffect, useRef} from 'react'

import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Line } from '@ant-design/charts';
import { Column } from '@ant-design/plots';

import { numberFormatter } from '../../utils/helper'
import { GetDailyOwnerData } from '../../utils/api';

//import './DailyOwnerChart.css'


const DailyOwnerChart = (props) => {
    const [data, setData] = useState([]);
    const [t] = useTranslation()

    const themeReducer = useSelector(state => state.ThemeReducer.mode)
        
    let intervalRef = useRef(null);

    useEffect(() => {
        console.log('begin useEffect')
        asyncGetData();

        clearInterval(intervalRef.current);

        // 5分钟更新一次数据
        intervalRef.current = setInterval(() => {
            asyncGetData();
        }, 5 * 60 * 1000);
        
        console.log('end useEffect')
        return () => {
            clearInterval(intervalRef.current)
        }
    }, []);

    const asyncGetData = () => {
        console.log('begin asyncGetData')
        let dailyOwnerData = GetDailyOwnerData();
        
        if (dailyOwnerData) {
            setTimeout(() => {
                console.log('begin setData')
                setData(dailyOwnerData);
                console.log('eeeeeeee');
            }, 1000);
        }
        console.log('end asyncGetData')
    };

    const getThemeColor = () => {
        return (themeReducer === 'theme-mode-dark')? '#fafafa' : '#202020'
    }
    
    const lineConfig = {
        data,
        renderer:'svg',
        xField: 'date',
        yField: 'total',
        height: 288,
    //    seriesField: "category",
        padding:[30, 10, 30, 40],

        smooth: "true",
        color: ['#7B48F6','#FAA219'],
        theme: { "styleSheet": { "brandColor": "#7B48F6", "paletteQualitative10": ["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1"], "paletteQualitative20":["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1","#0E4D64"]}},
        lineStyle: {
            fillOpacity: 0.5,
            lineWidth: 2,
            color: 'C430FF',
        },
        xAxis: {
            label: {
                formatter: function formatter(v) {
                    let value = ''.concat(v).slice(-5);
                   
                    return value;
                }
            },
        },
        yAxis: {
            grid: {
                line: {
                    style: {
                        lineWidth: 0
                    }
                }
            },
            label: {
                formatter: function formatter(v) {

                    let value = numberFormatter(v, 0);

                    return value;
                }
            }
        }
    };

       
    const columnConfig = {
        data,
        padding: 'auto',
        xField: 'date',
        yField: 'value',
        padding:[30, 10, 60, 40],
        color: ['#7B48F6','#FAA219'],
        theme: { "styleSheet": { "brandColor": "#7B48F6", "paletteQualitative10": ["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1"], "paletteQualitative20":["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1","#0E4D64"]}}, 
        height: 288,
        renderer:'svg',
        xAxis: {
            label: {
                autoRotate: false,
                formatter: function formatter(v) {
                    let value = ''.concat(v).slice(-5);
                   
                    return value;
                }
            },
        },
        slider: {
            start: 0.8,
            end: 1.0,
            textStyle: {
                fill: getThemeColor(),
            }
        },
        yAxis: {
            grid: {
                line: {
                    style: {
                        lineWidth: 0
                    }
                }
            },
            label: {
                formatter: function formatter(v) {
                    let value = ""
                    .concat(v)
                    .replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                        return "".concat(s, ",");
                    });
                    return value;
                }
            }
        },
    };

    return  <div className='statistic-daily-chart'>
                <div className='statistic-das-count-title'>
                    {t('data.daily-new-owners-count-chart-title')} 
                </div>
                <div>
                    <Column {...columnConfig} /> 
                </div>
                <div className='statistic-das-count-title'>
                    {t('data.das-owners-count-chart-title')} {console.log('begin render1')} 
                </div>
                <div>
                    <Line {...lineConfig} /> 
                </div>
            </div>;
};

export default DailyOwnerChart;
