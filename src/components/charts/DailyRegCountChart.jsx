import React, {useState, useEffect, useRef} from 'react'

import Chart from 'react-apexcharts'

import { useSelector } from 'react-redux'

import './DailyRegCountChart.css'



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
                {/* chart */console.log(chartOptions)}
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

export default DailyRegCountChart;
