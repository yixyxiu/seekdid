
import { useTranslation } from 'react-i18next'
import { ListSkeleton } from '../Skeleton/listSkeleton';
import { numberFormatter } from '../../utils/helper';
import './distributeBar.css'
/**
 * 
 * @param {*} props : loading, summary:market summary object
 * @returns 
 */
export const BitSoldAddressSummary = (props) => {
    const [t] = useTranslation()

    let skeletonRows = Array(1).fill(0);

    const calcSubBarPercent = (count1, count2) => {
        const total = count1 + count2;
        let percent = 50;
        if (total > 0) {
            percent = count1*100/total;
        }

        let res = `${percent}%`;
        return res
    }

    // calcSubBarPercent(props.summaryData.buy, props.summaryData.sell)}
    return (
        <div className='flex flex-col rounded-lg p-5 bg-sub-card-1st bg-box-shadow'>
             <div className='text-sm card-title mb-2'>{t('dashboard.summary-address-card-title')}</div>
 
             {props.loading ? (skeletonRows.map((index) => <ListSkeleton key={index} />))
             :(
                 <div className={`flex flex-col`}>
                        
                     <div className='w-full flex flex-row mt-4 content-center'> 
                        <div className={`distribute-bar-left `} style={{'width': `${calcSubBarPercent(props.summaryData.buy, props.summaryData.sell)}`}}></div>
                        <div className={`distribute-bar-right`} style={{'width': `${calcSubBarPercent(props.summaryData.sell, props.summaryData.buy)}`}}></div>
                     </div>
                     <div className='w-full flex flex-row mt-2 '> 
                        <div className='text-xs grow'>{t('dashboard.summary-address-buyers')}</div>
                        <span className='text-xs ml-1' >{t('dashboard.summary-address-sellers')}</span>
                     </div>
                     <div className='px-2 flex content-left'>
                        <div className='flex grow'>
                            <span className='text-[30px]' >{numberFormatter(props.summaryData.buy, 0)}</span>
                            <span className='text-base mt-3.5 ml-1' >{`${t('dashboard.summary-count-unit')}`}</span>
                         </div>
                         <div className='flex'>
                            <span className='text-[30px]' >{numberFormatter(props.summaryData.sell, 0)}</span>
                            <span className='text-base mt-3.5 ml-1 ' >{`${t('dashboard.summary-count-unit')}`}</span>
                         </div>
                     </div>
                     
                 </div>)}
         </div>
     );
 };