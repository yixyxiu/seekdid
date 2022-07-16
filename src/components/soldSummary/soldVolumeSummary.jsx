
import { useTranslation } from 'react-i18next'
import { ListSkeleton } from '../Skeleton/listSkeleton';
import { numberFormatter } from '../../utils/helper';

/**
 * 
 * @param {*} props : loading, summary:market summary object
 * @returns 
 */
export const BitSoldVolumeSummary = (props) => {
    const [t] = useTranslation()

    let skeletonRows = props.summaryData.sources? Array(props.summaryData.sources.length).fill(0) : Array(5).fill(0);

    const renderChangePercent = (percent) => {
        let colorStyle = '';
        let changePercentStr = '---';
        percent *= 100;
       
        if (percent > 0) {
            colorStyle = 'text-[#00DF9B]';
            changePercentStr = `+${percent.toFixed(2)}%`;
        }
        else if (percent < 0) {
            colorStyle = 'text-[#F56100]';
            changePercentStr = `${percent.toFixed(2)}%`;
        }

        return <span className={`text-sm mr-2 ${colorStyle}`} >{changePercentStr}</span>

    }

    const renderArrowIcon = (percent) => {
        if (percent > 0) {
            return <img className='h-4 mt-1 rounded-full' src='images/marketplaces/arrow-up.svg' alt={`seekdid-arrow-up`} ></img>
        }
        else if (percent < 0) {
            return <img className='h-4 mt-1 rounded-full' src='images/marketplaces/arrow-down.svg' alt={`seekdid-arrow-down`} ></img>
        }

        return <div className='w-3'></div>
    }

    return (
       <div className='flex flex-col rounded-lg p-5 hover-up-2 bg-sub-card-1st bg-box-shadow'>
            <div className='flex flex-row mb-2' >
                <div className='grow text-sm card-title'>💰{t('dashboard.summary-volume-card-title')}</div>
            </div>

            {props.loading ? (skeletonRows.map((index) => <ListSkeleton key={index} />))
            :(<div className='mt-2 flex flex-col justify-between'>
                
                <div className={`flex flex-row mb-2 border-b-[1px] border-line seperator `}>
                    <div className='px-2 flex grow content-left'>
                        <span className='text-[30px]' >{numberFormatter(props.summaryData.summary.num, 2)}</span>
                        <span className='text-base mt-4 ml-1' >{`${t('dashboard.summary-volume-unit')}`}</span>
                    </div>
                        
                    <div className='flex flex-row mt-4 justify-end content-center'> 
                        {renderChangePercent(props.summaryData.summary.change_percent)}
                        {renderArrowIcon(props.summaryData.summary.change_percent)}
                    </div>
                </div>
                
            {
                    props.summaryData.sources?.map((item,i) => {
                        return <div key={`${i}-${item.from}`} className={`flex flex-row`}>
                        <div className='py-2 px-2 flex grow content-center'>
                            <img className='w-5 h-5 mr-3 rounded-full' src={`images/marketplaces/${item.from.toLowerCase()}-color.svg`} alt={`logo-${item.from}`} ></img>
                            <span className='text-sm ml-2' >{`${numberFormatter(item.num, 2)} ${t('dashboard.summary-volume-unit')}`}</span>
                        </div>
                        
                        <div className='py-2 flex flex-row justify-end'>
                            {renderChangePercent(item.change_percent)}
                            {renderArrowIcon(item.change_percent)}
                        </div>
                    </div>
                    })
            }
            </div>)}
        </div>
    );
};