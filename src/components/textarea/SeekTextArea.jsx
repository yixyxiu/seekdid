import React, {useRef, useState, useImperativeHandle, forwardRef} from 'react'
import TextArea from 'antd/lib/input/TextArea';
import { useTranslation } from 'react-i18next';


const SeekTextArea = forwardRef((props, ref) => {

    const [t] = useTranslation();
    const [wordList, setWordList] = useState([]);
    const [wordCount, setWordCount] = useState(0);
    const [searchData, setSearchData] = useState(
        {
            wordList: [],
            wordCount: 0,
            text: '',
        }
    )

    const inputRef = useRef();

    const clearEdit = () => {
        setSearchData({
            wordList: [],
            wordCount: 0,
            text: '',
        })
    }

    useImperativeHandle(ref, () => {
        return {
            getWordList: () => {
                return searchData.wordList;
            },
            clearInput: () => {
                clearEdit();
            }
        }
    })

    const OnEditChanged = (e) => {
        let input = e.target.value
        let wordList = input.match(/[a-z0-9\-]+/gi);

        if (wordList) {
            let words = wordList.filter(word => word.length > 3);
            wordList = [...new Set(words)].sort(function (a, b) {
                if (a.length !== b.length) {
                    return a.length - b.length;
                } else {
                    return a.localeCompare(b);
                }
                
            });
        }

        setSearchData({
            wordList: wordList,
            wordCount: wordList ? wordList.length : 0,
            text: input,
        })
    }

    let countColor = searchData.wordCount > 1000 ? 'bg-[#F56100]' : 'bg-[#00DF9B]';
    return (
        <div className="relative">
            <TextArea value={searchData.text} className='w-full' type="text" placeholder={t('search.search-edit-placeholder')} onChange={OnEditChanged}/>
            <button onClick={clearEdit} className={`absolute right-2 top-2  ${searchData.text.length > 0 ? 'block' : 'hidden'}`}>
                <i className='bx bx-x bg-[#F56100] rounded-full'></i>
            </button>
            <div className={`absolute right-2 bottom-2 ${countColor} rounded-full px-3 text-[#fff] ${searchData.wordCount > 0 ? 'block' : 'hidden'}`}>{searchData.wordCount}</div>

        </div>
    )
})

export default SeekTextArea;