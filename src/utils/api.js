
/**
 * GetDailyOwnerData
 */
export function GetDailyOwnerData() {

    console.log('begin GetDailyOwnerData')
    let url = 'https://api.das.la/api/v1/das_accounts/daily_new_owner?begin_at=2021-07-21'

    let totaldata = [];

    fetch(url)
        .then((response) => response.json())
        .then((dailydata) => {
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
        })
        .catch((error) => {
            console.log('fetch GetDailyOwnerData data Error', error);
        });

        console.log('end GetDailyOwnerData')
        return totaldata;
}

