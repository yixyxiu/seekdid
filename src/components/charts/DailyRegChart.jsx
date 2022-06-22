import React, {useState, useEffect, useRef} from 'react'

import Chart from 'react-apexcharts'

import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Line } from '@ant-design/charts';
import { Column } from '@ant-design/plots';

import { numberFormatter } from '../../utils/helper'
import { GetDailyOwnerData } from '../../utils/api';

import './DailyRegChart.css'

const DailyRegCountChart = (props) => {
    const [data, setData] = useState([]);
    const [t] = useTranslation();
    const themeReducer = useSelector(state => state.ThemeReducer.mode)
      
    let intervalRef = useRef(null);

    useEffect(() => {
        asyncFetch();

        clearInterval(intervalRef.current);

        // 一分钟更新一次数据
        intervalRef.current = setInterval(() => {
            asyncFetch();
        }, 5 * 60 * 1000);
        
        return () => {
            clearInterval(intervalRef.current)
        }
    }, []);
  
    const asyncFetch = () => {
        const headers = {
            'content-type': 'application/json;charset=UTF-8',
          }

        //const data = {"keyword": account,"page":1,"size":50}

        const optionParam = {
            headers: headers,
        //    body: JSON.stringify(data),
            method: 'GET', 
        }

        let url = 'https://api.das.la/api/v1/das_accounts/daily_reg_count?begin_at=2021-07-20'

        fetch(url, optionParam)
            .then((response) => response.json())
            .then((dailydata) => {
                let totaldata = [];
                let recentData = [];
                let sum = 0;
                for (let index = 0; index < dailydata.length; index++) {
                    let total = {};
                    total["date"] = dailydata[index].date;
                    if (index > 0) {
                        sum = totaldata[index - 1].total;
                    }
                    total["value"] = dailydata[index].total;
                    total["total"] = dailydata[index].total + sum;
                    
                    totaldata.push(total);

                    if (index > dailydata.length - 4) {
                        recentData.push(total);
                    }
                }

                setData(totaldata)
                // 把数据提供给外面
                //props.dataUpdateCallback(recentData);
            })
            .catch((error) => {
            console.log('fetch data failed', error);
            });
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
        smooth: "true",
        color: ['#C6304F','#FAA219'],
        padding:[30, 10, 30, 40],
        //theme: {"background":"#313131","styleSheet": { "brandColor": "#C6304F", "paletteQualitative10": ["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1"], "paletteQualitative20":["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1","#0E4D64"]}},
        theme: {"styleSheet": { "brandColor": "#C6304F", "paletteQualitative10": ["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1"], "paletteQualitative20":["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1","#0E4D64"]}},

        lineStyle: {
            fillOpacity: 0.5,
            lineWidth: 2,
        //    stroke: 'C430FF',
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
        color: '#C6304F',
        height: 288,
        renderer:'svg',
        padding:[30, 10, 60, 40],
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
                  let value = numberFormatter(v, 0);    
                  return value;
                }
              }
            },
        
        };
    return <div className='statistic-daily-chart'>
                    <div className='statistic-das-count-title'>
                    {t('data.daily-registered-chart-title')} 
                    </div>
                    <div>
                    <Column {...columnConfig} /> 
                    
                    </div>
                    <div className='statistic-das-count-title'>
                     {t('data.total-registered-chart-title')} 
                    </div>
                    <div>
                    <Line {...lineConfig} /> 
                    </div>
            </div>;
};
/*
const DailyRegCountChart = (props) => {
    const [data, setData] = useState([]);
    const themeReducer = useSelector(state => state.ThemeReducer.mode)
    

    let intervalRef = useRef(null);

    useEffect(() => {
        asyncFetch();

        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            asyncFetch();
        }, 5 * 60 * 1000);
        
        return () => {
            clearInterval(intervalRef.current)
        }
    }, []);
  
    const asyncFetch = () => {
        const headers = {
            'content-type': 'application/json;charset=UTF-8',
          }

        //const data = {"keyword": account,"page":1,"size":50}

        const optionParam = {
            headers: headers,
            method: 'GET', 
        }

        let url = 'https://api.das.la/api/v1/das_accounts/daily_reg_count?begin_at=2021-07-21'

        fetch(url, optionParam)
            .then((response) => response.json())
            .then((dailydata) => {
                let totaldata = [];
                let recentData = [];

                let chartDataSeries = {
                    "series":[],
                    "labels":[]
                };
                
                let dailyValue = {
                    name: 'daily',
                    type: 'column',
                    data:[]
                }

                let totalValue = {
                    name: 'total',
                    type: 'line',
                    data:[]
                }

                let dateLabels = [];
                
                let sum = 0;
                for (let index = 0; index < dailydata.length; index++) {
                    let total = {};
                    total["date"] = dailydata[index].date;
                    if (index > 0) {
                        sum = totaldata[index - 1].total;
                    }
                    total["value"] = dailydata[index].total;
                    total["total"] = dailydata[index].total + sum;

                    dailyValue.data.push(total["value"])
                    totalValue.data.push(total["total"])
                    dateLabels.push(dailydata[index].date);
                    
                    
                    totaldata.push(total);

                    if (index > dailydata.length - 4) {
                        recentData.push(total);
                    }
                }

                chartDataSeries["series"].push(dailyValue);
                chartDataSeries["series"].push(totalValue);
                chartDataSeries["labels"] = dateLabels;
                setData(chartDataSeries)
                console.log(chartDataSeries);
                // 把数据提供给外面
                //props.dataUpdateCallback(recentData);
            })
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };


    const chartOptions = {
        series: data.series || [],
        
          options: {
            toolbar: {
                show: false,
                offsetX: 0,
                offsetY: 0,
                tools: {
                  download: false,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                  reset: false | '<img src="/static/icons/reset.png" width="20">',
                  customIcons: []
                }
            },
            chart: {
              height: 450,
              type: 'line',
              stacked: false
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [2, 2]
            },
            title: {
              text: 'XYZ - Stock Analysis (2009 - 2016)',
              align: 'left',
              offsetX: 110
            },
            xaxis: {
              categories: data.labels || [],
            },
            yaxis: [
              {
                seriesName: 'Income',
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: '#008FFB'
                },
                labels: {
                  style: {
                    colors: '#008FFB',
                  }
                },
                title: {
                  text: "Income (thousand crores)",
                  style: {
                    color: '#008FFB',
                  }
                },
                tooltip: {
                  enabled: true
                }
              },
              {
                seriesName: 'Cashflow',
                opposite: true,
                axisTicks: {
                  show: true,
                },
                axisBorder: {
                  show: true,
                  color: '#00E396'
                },
                labels: {
                  style: {
                    colors: '#00E396',
                  }
                },
                title: {
                  text: "Operating Cashflow (thousand crores)",
                  style: {
                    color: '#00E396',
                  }
                },
              }
            ],
            tooltip: {
              fixed: {
                enabled: true,
                position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                offsetY: 30,
                offsetX: 60
              },
            },
            
            legend: {
              horizontalAlign: 'left',
              offsetX: 40
            }
          },
        
        };
    

    return (
        <div className="col-12">
            <div className="card full-height">
                <Chart
                    options={themeReducer === 'theme-mode-dark' ? {
                        ...chartOptions.options,
                        theme: { mode: 'dark'}
                    } : {
                        ...chartOptions.options,
                        theme: { mode: 'light'}
                    }}
                    series={chartOptions.series}
                    type='line'
                    height='100%'
                />
            </div>
        </div>
    )
}
*/
export default DailyRegCountChart;
