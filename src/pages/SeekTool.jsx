import React, { useRef, useState } from 'react'

import {Card, Space, Input, Button, Table, Radio, Select, Spin} from 'antd';
import {SearchOutlined, QuestionCircleFilled} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { CSVLink } from "react-csv";
import Dropdown from '../components/dropdown/Dropdown';
import SeekTextArea from '../components/textarea/SeekTextArea';
import SearchResultTable from '../components/table/SearchResultTable';

import { numberFormatter } from '../utils/helper';
import { useTranslation } from 'react-i18next';

import dasData from '../utils/bitModalMgr'

import './SeekTool.css'

const SeekTool = () => {
    const [t] = useTranslation();
    const [searchParam, setSearchParam] = useState({});
    const [searchResult, setSearchResult] = useState([]);

    const searchEditRef = useRef(null);
    
    let wordList = [];
    

    const textAreaChange = (e) => {
        let input = e.target.value
        let wordList = input.match(/[a-z0-9]+/gi);

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

        console.log(wordList);
    }

    const onSearch = () => {
        let wordList = searchEditRef.current.getWordList();
        
        let data = dasData.localSearch(wordList, {status: '0'});
        console.log(data);

        setSearchResult(data.list);
    }

    const onClearEdit = () => {
        searchEditRef.current.clearInput();
    }

    return (
        <div>{t('search.bulk-search-title')}
        <div className='w-full mt-6'>
            <div className="flex flex-col">

                <SeekTextArea ref={searchEditRef}/>
               
                <div className="flex flex-row w-full justify-center items-center my-4 pb-12 gap-5">
                    <button onClick={onSearch} className="flex-1 px-4 py-4 text-md text-primary bg-box text-center font-semibold shadow leading-none outline-black default-btn rounded-lg">{t('search.search-btn')}</button>
                    <button onClick={onClearEdit} className="flex-1 px-4 py-4 text-md text-primary bg-box text-center font-semibold shadow leading-none outline-black rounded-lg">{t('search.clear-btn')}</button>
                    <div onClick={onSearch} className="flex-1 px-4 text-[#fff] w-[100px] text-md bg-[#00DF9B] text-primary h-[30px]  text-center font-semibold rounded-full">{t('search.search-btn')}</div>

                </div>

                <SearchResultTable data={searchResult}/>
                <div class="flex w-full items-center flex-col gap-5 min-h-screen">
                    <div class="hidden md:flex items-center gap-4 justify-center flex-row">
                        <div class="min-w-[16px] md:min-w-[50px] max-h-[1px] border border-t-1 border-amber-400"/>
                        <p class="text-primary font-semibold text-2xl md:text-4xl">Result</p>
                        <div class="min-w-[16px] md:min-w-[50px] max-h-[1px] border border-t-1 border-amber-400"/>
                    </div>
                    
                    <div class="px-4 md:px-0 flex w-full items-center flex-col mb-64">
                        <div class="w-full flex items-center justify-center flex-col">
                        <div class="flex w-full justify-between items-center flex-row bg-box rounded-lg px-4 py-4">
                            <div class="flex flex-row gap-2 flex-0">
                            <span>
                                <button>
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-csv" class="svg-inline--fa fa-file-csv text-2xl text-primary hover:text-hover" role="img" viewBox="0 0 384 512">
                                    <path fill="currentColor" d="M256 0v128h128L256 0zM224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM128 280C128 284.4 124.4 288 120 288H112C103.1 288 96 295.1 96 304v32C96 344.9 103.1 352 112 352h8C124.4 352 128 355.6 128 360v16C128 380.4 124.4 384 120 384H112C85.5 384 64 362.5 64 336v-32C64 277.5 85.5 256 112 256h8C124.4 256 128 259.6 128 264V280zM172.3 384H160c-4.375 0-8-3.625-8-8v-16C152 355.6 155.6 352 160 352h12.25c6 0 10.38-3.5 10.38-6.625c0-1.25-.75-2.625-2.125-3.875l-21.88-18.75C150.3 315.5 145.4 305.3 145.4 294.6C145.4 273.4 164.4 256 187.8 256H200c4.375 0 8 3.625 8 8v16C208 284.4 204.4 288 200 288H187.8c-6 0-10.38 3.5-10.38 6.625c0 1.25 .75 2.625 2.125 3.875l21.88 18.75c8.375 7.25 13.25 17.5 13.25 28.12C214.6 366.6 195.6 384 172.3 384zM288 284.8V264C288 259.6 291.6 256 296 256h16C316.4 256 320 259.6 320 264v20.75c0 35.5-12.88 69-36.25 94.13C280.8 382.1 276.5 384 272 384s-8.75-1.875-11.75-5.125C236.9 353.8 224 320.3 224 284.8V264C224 259.6 227.6 256 232 256h16C252.4 256 256 259.6 256 264v20.75c0 20.38 5.75 40.25 16 56.88C282.3 325 288 305.1 288 284.8z"/>
                                </svg>
                                </button>
                            </span>
                            </div>
                            <div class="flex-1">
                            <div class="w-full">
                                <div class="flex justify-center items-center">
                                <button class="flex text-sm md:text-md text-primary leading-tight font-bold transition duration-150 ease-in-out mx-4">1 / 1</button>
                                </div>
                            </div>
                            </div>
                            <div class="flex-0 flex justify-end"/>
                        </div>
                        <div class="w-full visible wow animate__ animate__fadeIn animated animated" data-wow-delay=".1s">
                            <div class="w-full gap-1.5 grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 py-4">
                            <div class="relative flex gap-1 items-center rounded-lg bg-box box dark:dark-box shadow hover:shadow-lg hover-up-2">
                                <div class="min-h-[24px] h-full px-1 border-b border-gray-300 dark:border-gray-800 shadow bg-green-400"></div>
                                <span>
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check min-w-[32px] text-2xl text-green-400" role="img" viewBox="0 0 448 512">
                                    <path fill="currentColor" d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/>
                                </svg>
                                </span>
                                <a class="py-2 flex grow cursor-pointer" href="/name/nervosyixiu.eth">
                                <p class="break-all text-md lg:text-lg font-semibold text-primary hover:text-hover">nervosyixiu.eth</p>
                                </a>
                                <div class="px-2 flex justify-end items-center flex-row gap-2">
                                <span>
                                    <button class="cursor-pointer flex justify-center items-center group">
                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bag-shopping" class="svg-inline--fa fa-bag-shopping text-[26px] group-hover:md:text-hover text-accent" role="img" viewBox="0 0 448 512">
                                        <path fill="currentColor" d="M112 112C112 50.14 162.1 0 224 0C285.9 0 336 50.14 336 112V160H400C426.5 160 448 181.5 448 208V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V208C0 181.5 21.49 160 48 160H112V112zM160 160H288V112C288 76.65 259.3 48 224 48C188.7 48 160 76.65 160 112V160zM136 256C149.3 256 160 245.3 160 232C160 218.7 149.3 208 136 208C122.7 208 112 218.7 112 232C112 245.3 122.7 256 136 256zM312 208C298.7 208 288 218.7 288 232C288 245.3 298.7 256 312 256C325.3 256 336 245.3 336 232C336 218.7 325.3 208 312 208z"/>
                                    </svg>
                                    </button>
                                </span>
                                <span>
                                    <a class="flex justify-center items-center group" target="_blank" rel="noreferrer" href="https://app.ens.domains/name/nervosyixiu.eth/register">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-gray-200 dark:fill-[#131317] text-white dark:text-boxsecondary group-hover:fill-amber-400" width="37" height="37" viewBox="0 0 194 194" fill="none">
                                        <path d="M168 93C168 132.212 136.212 164 97 164C57.7878 164 26 132.212 26 93C26 53.7878 57.7878 22 97 22C136.212 22 168 53.7878 168 93Z" fill=""/>
                                        <path d="M66.6996 69.4713C67.5542 67.8863 68.7875 66.535 70.2907 65.5367L95.5182 48L69.6695 90.5491C69.6695 90.5491 67.411 86.7495 66.5302 84.8272C65.4326 82.41 64.879 79.7831 64.9083 77.1306C64.9375 74.478 65.549 71.8639 66.6996 69.4713ZM56.2879 98.8229C56.5727 102.892 57.7276 106.853 59.6751 110.442C61.6226 114.03 64.3179 117.163 67.5804 119.631L95.4842 139C95.4842 139 78.026 113.954 63.3005 89.0315C61.8097 86.3985 60.8075 83.5196 60.3419 80.5329C60.1358 79.1804 60.1358 77.8048 60.3419 76.4523C59.958 77.1605 59.2127 78.6106 59.2127 78.6106C57.7195 81.642 56.7027 84.8836 56.1976 88.2221C55.9068 91.7512 55.937 95.2992 56.2879 98.8229ZM127.431 102.195C126.527 100.273 124.291 96.4734 124.291 96.4734L98.4881 139L123.716 121.475C125.219 120.476 126.452 119.125 127.307 117.54C128.457 115.147 129.069 112.533 129.098 109.881C129.127 107.228 128.574 104.601 127.476 102.184L127.431 102.195ZM137.673 88.1884C137.388 84.1194 136.233 80.158 134.286 76.5694C132.338 72.9808 129.643 69.8479 126.381 67.3804L98.5219 48C98.5219 48 115.969 73.0461 130.706 97.9685C132.192 100.602 133.191 103.481 133.653 106.467C133.859 107.82 133.859 109.195 133.653 110.548C134.037 109.84 134.782 108.389 134.782 108.389C136.275 105.358 137.292 102.116 137.797 98.7779C138.092 95.2491 138.065 91.7011 137.718 88.1771L137.673 88.1884Z" fill="currentColor"/>
                                    </svg>
                                    </a>
                                </span>
                                <div class="mt-0.5">
                                    <span>
                                    <button class="flex justify-center items-center group">
                                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart text-gray-200 dark:text-box text-[26px] group-hover:md:text-hover" role="img" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"/>
                                        </svg>
                                    </button>
                                    </span>
                                </div>
                                </div>
                            </div>
                            <div class="relative flex gap-1 items-center rounded-lg bg-box box dark:dark-box shadow hover:shadow-lg hover-up-2">
                                <div class="min-h-[24px] h-full px-1 border-b border-gray-300 dark:border-gray-800 shadow bg-green-400"></div>
                                <span>
                                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check min-w-[32px] text-2xl text-green-400" role="img" viewBox="0 0 448 512">
                                    <path fill="currentColor" d="M438.6 105.4C451.1 117.9 451.1 138.1 438.6 150.6L182.6 406.6C170.1 419.1 149.9 419.1 137.4 406.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4C21.87 220.9 42.13 220.9 54.63 233.4L159.1 338.7L393.4 105.4C405.9 92.88 426.1 92.88 438.6 105.4H438.6z"/>
                                </svg>
                                </span>
                                <a class="py-2 flex grow cursor-pointer" href="/name/sdds.eth">
                                <p class="break-all text-md lg:text-lg font-semibold text-primary hover:text-hover">sdds.eth</p>
                                </a>
                                <div class="px-2 flex justify-end items-center flex-row gap-2">
                                <span>
                                    <button class="cursor-pointer flex justify-center items-center group">
                                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bag-shopping" class="svg-inline--fa fa-bag-shopping text-gray-200 dark:text-box text-[26px] group-hover:md:text-hover" role="img" viewBox="0 0 448 512">
                                        <path fill="currentColor" d="M112 112C112 50.14 162.1 0 224 0C285.9 0 336 50.14 336 112V160H400C426.5 160 448 181.5 448 208V416C448 469 405 512 352 512H96C42.98 512 0 469 0 416V208C0 181.5 21.49 160 48 160H112V112zM160 160H288V112C288 76.65 259.3 48 224 48C188.7 48 160 76.65 160 112V160zM136 256C149.3 256 160 245.3 160 232C160 218.7 149.3 208 136 208C122.7 208 112 218.7 112 232C112 245.3 122.7 256 136 256zM312 208C298.7 208 288 218.7 288 232C288 245.3 298.7 256 312 256C325.3 256 336 245.3 336 232C336 218.7 325.3 208 312 208z"/>
                                    </svg>
                                    </button>
                                </span>
                                <span>
                                    <a class="flex justify-center items-center group" target="_blank" rel="noreferrer" href="https://app.ens.domains/name/sdds.eth/register">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-gray-200 dark:fill-[#131317] text-white dark:text-boxsecondary group-hover:fill-amber-400" width="37" height="37" viewBox="0 0 194 194" fill="none">
                                        <path d="M168 93C168 132.212 136.212 164 97 164C57.7878 164 26 132.212 26 93C26 53.7878 57.7878 22 97 22C136.212 22 168 53.7878 168 93Z" fill=""/>
                                        <path d="M66.6996 69.4713C67.5542 67.8863 68.7875 66.535 70.2907 65.5367L95.5182 48L69.6695 90.5491C69.6695 90.5491 67.411 86.7495 66.5302 84.8272C65.4326 82.41 64.879 79.7831 64.9083 77.1306C64.9375 74.478 65.549 71.8639 66.6996 69.4713ZM56.2879 98.8229C56.5727 102.892 57.7276 106.853 59.6751 110.442C61.6226 114.03 64.3179 117.163 67.5804 119.631L95.4842 139C95.4842 139 78.026 113.954 63.3005 89.0315C61.8097 86.3985 60.8075 83.5196 60.3419 80.5329C60.1358 79.1804 60.1358 77.8048 60.3419 76.4523C59.958 77.1605 59.2127 78.6106 59.2127 78.6106C57.7195 81.642 56.7027 84.8836 56.1976 88.2221C55.9068 91.7512 55.937 95.2992 56.2879 98.8229ZM127.431 102.195C126.527 100.273 124.291 96.4734 124.291 96.4734L98.4881 139L123.716 121.475C125.219 120.476 126.452 119.125 127.307 117.54C128.457 115.147 129.069 112.533 129.098 109.881C129.127 107.228 128.574 104.601 127.476 102.184L127.431 102.195ZM137.673 88.1884C137.388 84.1194 136.233 80.158 134.286 76.5694C132.338 72.9808 129.643 69.8479 126.381 67.3804L98.5219 48C98.5219 48 115.969 73.0461 130.706 97.9685C132.192 100.602 133.191 103.481 133.653 106.467C133.859 107.82 133.859 109.195 133.653 110.548C134.037 109.84 134.782 108.389 134.782 108.389C136.275 105.358 137.292 102.116 137.797 98.7779C138.092 95.2491 138.065 91.7011 137.718 88.1771L137.673 88.1884Z" fill="currentColor"/>
                                    </svg>
                                    </a>
                                </span>
                                <div class="mt-0.5">
                                    <span>
                                    <button class="flex justify-center items-center group">
                                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart text-gray-200 dark:text-box text-[26px] group-hover:md:text-hover" role="img" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M0 190.9V185.1C0 115.2 50.52 55.58 119.4 44.1C164.1 36.51 211.4 51.37 244 84.02L256 96L267.1 84.02C300.6 51.37 347 36.51 392.6 44.1C461.5 55.58 512 115.2 512 185.1V190.9C512 232.4 494.8 272.1 464.4 300.4L283.7 469.1C276.2 476.1 266.3 480 256 480C245.7 480 235.8 476.1 228.3 469.1L47.59 300.4C17.23 272.1 .0003 232.4 .0003 190.9L0 190.9z"/>
                                        </svg>
                                    </button>
                                    </span>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div class="flex w-full justify-center items-center flex-row rounded-lg px-4 py-4"/>
                        </div>
                        </div>
                    </div>
                </div>

                <div className="py-2">
                    <div className="rounded-xl overflow-hidden mb-6 card-shadow bg-box w-1/2 md:w-full flex flex-row p-4">
                        <div className="w-8 h-8 mr-2 m-auto">
                            <img className='rounded-full' src="https://identicons.did.id/identicon/nervosyixiu.bit"></img>
                        </div>
                        <div className="w-full flex flex-row justify-between">
                            <div className="flex flex-col">
                                <span className="text-lg no-underline pt-0 pb-0 font-bold">nervosyixiu.bit</span>
                                <span className="text-xs">registered at 2021/07/21</span>
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-lg pt-0 pb-0"><b>16</b> transactions</span>
                            </div>
                        </div>
                        <div className="absolute z-10 left-0 right-0 top-0 bottom-0 pointer-events-none bg-none">
                        </div>
                    </div>
                </div>
                <p class="md:space-x-1 space-y-1 md:space-y-0 mb-4">
                    <a class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" data-bs-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">Toggle first element</a>
                    <button class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2">Toggle second element</button>
                    <button class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseExample1 multiCollapseExample2">Toggle both elements</button>
                </p>
                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <div class="collapse multi-collapse" id="multiCollapseExample1">
                        <div class="block p-6 rounded-lg shadow-lg bg-white">
                            Some placeholder content for the first collapse component of this multi-collapse example. This panel is hidden by default but revealed when the user activates the relevant trigger.
                        </div>
                        </div>
                    </div>
                    <div>
                        <div class="collapse multi-collapse" id="multiCollapseExample2">
                        <div class="block p-6 rounded-lg shadow-lg bg-white">
                            Some placeholder content for the second collapse component of this multi-collapse example. This panel is hidden by default but revealed when the user activates the relevant trigger.
                        </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col justify-center">
                    <div class="bg-blue-600 shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3" id="static-example" role="alert" aria-live="assertive" aria-atomic="true" data-mdb-autohide="false">
                        <div class="bg-blue-600 flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-blue-500 rounded-t-lg">
                        <p class="font-bold text-white flex items-center">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path>
                            </svg>
                            MDBootstrap</p>
                        <div class="flex items-center">
                            <p class="text-white opacity-90 text-xs">11 mins ago</p>
                            <button type="button" class="btn-close btn-close-white box-content w-4 h-4 ml-2 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline" data-mdb-dismiss="toast" aria-label="Close"></button>
                        </div>
                        </div>
                        <div class="p-3 bg-blue-600 rounded-b-lg break-words text-white">
                        Hello, world! This is a toast message.
                        </div>
                    </div>
                    <div class="bg-green-500 shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3" id="static-example" role="alert" aria-live="assertive" aria-atomic="true" data-mdb-autohide="false">
                        <div class="bg-green-500 flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-green-400 rounded-t-lg">
                        <p class="font-bold text-white flex items-center">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
                            </svg>
                            MDBootstrap</p>
                        <div class="flex items-center">
                            <p class="text-white opacity-90 text-xs">11 mins ago</p>
                            <button type="button" class="btn-close btn-close-white box-content w-4 h-4 ml-2 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline" data-mdb-dismiss="toast" aria-label="Close"></button>
                        </div>
                        </div>
                        <div class="p-3 bg-green-500 rounded-b-lg break-words text-white">
                        Hello, world! This is a toast message.
                        </div>
                    </div>
                    <div class="bg-yellow-500 shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3" id="static-example" role="alert" aria-live="assertive" aria-atomic="true" data-mdb-autohide="false">
                        <div class="bg-yellow-500 flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-yellow-400 rounded-t-lg">
                        <p class="font-bold text-white flex items-center">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation-triangle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path>
                            </svg>
                            MDBootstrap</p>
                        <div class="flex items-center">
                            <p class="text-white opacity-90 text-xs">11 mins ago</p>
                            <button type="button" class="btn-close btn-close-white box-content w-4 h-4 ml-2 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline" data-mdb-dismiss="toast" aria-label="Close"></button>
                        </div>
                        </div>
                        <div class="p-3 bg-yellow-500 rounded-b-lg break-words text-white">
                        Hello, world! This is a toast message.
                        </div>
                    </div>
                    <div class="bg-red-600 shadow-lg mx-auto w-96 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3" id="static-example" role="alert" aria-live="assertive" aria-atomic="true" data-mdb-autohide="false">
                        <div class="bg-red-600 flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-red-500 rounded-t-lg">
                        <p class="font-bold text-white flex items-center">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" class="w-4 h-4 mr-2 fill-current" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path>
                            </svg>
                            MDBootstrap</p>
                        <div class="flex items-center">
                            <p class="text-white opacity-90 text-xs">11 mins ago</p>
                            <button type="button" class="btn-close btn-close-white box-content w-4 h-4 ml-2 text-white border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline" data-mdb-dismiss="toast" aria-label="Close"></button>
                        </div>
                        </div>
                        <div class="p-3 bg-red-600 rounded-b-lg break-words text-white">
                        Hello, world! This is a toast message.
                        </div>
                    </div>
                    </div>               
            </div> 
          
            {/*
            <div className="content"> 
                <Card title={this.langConfig('match-all')} bordered={false} tabBarExtraContent= {<QuestionCircleFilled />}> 
                    <div style={{
                            display: 'inline-block',
                            position: 'absolute',
                            right: 15,
                            top: 14,
                            textAlign: 'right'
                        }}>
                            <Dropdown
                                customToggle={() => renderCurrentLanguage(this.state.locale)}
                                contentData={lang_menus_data}
                                renderItems={(item, index) => renderLanguageItem(item, index)}
                            ></Dropdown>
                    </div>
                    <div style={{display: 'flex'}}>
                        
                        <div style={{width:'100%'}}>
                            <TextArea onChange={(e) => this.textAreaChange(e)} allowClear placeholder={this.langConfig('wordlist-tips')} 
                                    rows={4}/>
                            
                            
                        </div>
                        
                    </div>
                    <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', paddingTop:10, height:35}}>
                        <div/>
                        <Space>
                        <span className="fa fa-filter"></span>
                        <Select value={this.getResultFilterString(this.state.mainTableFilter)} onChange={this.handMainTableFilterChange} style={{ width: 190 }}>
                            {tableFilters}
                        </Select>
                        <Button type="primary" shape="round" icon={<SearchOutlined/>}
                            onClick={() => this.search()}>{this.langConfig('wordlist-search')}</Button>
                        </Space>
                    </div>
                    <br/>
                    <Spin spinning={this.state.isLoadingMain}>
                    <Table locale={localeAllMatch} rowKey={(item) => item.id} dataSource={list} columns={this.getTableColumns()}
                           rowClassName='das-account-name' showHeader={false} pagination={getPagination(list)} />
                    </Spin>
                    <CSVLink
                        data={getDownloadJsonList(list)}
                        filename={"Better_bit_accounts(download from das.la).csv"}
                        className="btn btn-primary"
                        target="_blank"
                        >
                        {list.length === -1 ? 'Download':''}
                    </CSVLink>
                    <div className="suggest-list-wrapper">
                        
                        <div className="suggest-list-btn" >
                            <Button type="primary" size={'normal'} shape="round" onClick={this.loadSysAccount_Year}>🚀{this.langConfig('load-account-year')}</Button>
                        </div>
                        <div className="suggest-list-btn" >
                            <Button type="primary" size={'normal'} shape="round" onClick={this.loadSysAccount_Date}>📅{this.langConfig('load-account-date')}</Button>
                        </div>
                        <div className="suggest-list-btn" >
                            <Button type="primary" size={'normal'} shape="round" onClick={this.loadSysAccount_Time}>⏰{this.langConfig('load-account-time')}</Button>
                        </div>
                        <div className="suggest-list-btn" >
                            <Button type="primary" size={'normal'} shape="round" onClick={this.loadSysAccount_0x99}>💯{this.langConfig('load-account-0x99')}</Button>
                        </div>
                        <div className="suggest-list-btn" >
                            <Button type="primary" size={'normal'} shape="round" onClick={this.loadSysAccount_0x999}>🔥{this.langConfig('load-account-0x999')}</Button>
                        </div>
                        <div className="suggest-list-btn" >
                            <Button type="primary" size={'normal'} shape="round" onClick={this.loadSysAccount_4number}>🔥🔥9999</Button>
                        </div>
                        <div className="suggest-list-btn" >
                            <Button type="primary" size={'normal'} shape="round" onClick={this.loadSysAccount_00012}>🔢00012</Button>
                        </div>
                        <div className="suggest-list-btn" >
                            <Button type="primary" size={'normal'} shape="round" onClick={this.loadSysAccount_12000}>🔢12000</Button>
                        </div>
                        <div className="suggest-list-btn" >
                            <Button type="primary" size={'normal'} shape="round" onClick={this.loadSysAccount_10002}>🔢10002</Button>
                        </div>
                        <div className="suggest-list-btn" >
                            <Button type="primary" size={'normal'} shape="round" onClick={this.loadSysAccount_Birthday}>🎂{this.langConfig('load-account-birthday')}</Button>
                        </div>
    
                        <div className="suggest-list-btn" >
                            {loadFavListBtnDom}
                        </div>
                    </div>
                    <EnsMarketKeeper langConfig={this.langConfig} openLink={this.openLink} availableChecker={this.isAvailable}/>
                </Card>
                <br/>
                <HotAccounts langConfig={this.langConfig} getAvatar={this.getImg} canRegister={this.canRegister} goDASRegister={this.goDASRegister} goDeNameRegister={this.goDeNameRegister} dasData={das}/>
                <br/>
    
                <Card title={this.langConfig('keyword-title')} bordered={false}>
                    
                    <div style={{position: 'relative', paddingRight: 0}}>
                        <Input ref={(input) => { this.kewordInput = input; }} onBlur={(e) => this.keywordChanged(e)} placeholder="defi" defaultValue={this.state.keyword} allowClear maxLength={10}
                               rows={1} style={{textAlign: 'right'}}/>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', paddingTop:10, height:35}}>
                            <div/>
                             
                            <div style={{verticalAlign: 'middle', height:'100%', display:'flex'}} >
                                <div className='group-radio' >
                                    <Radio.Group name="radiogroup" onChange={this.onFixGroupChange} defaultValue={this.state.fix}>
                                        <Radio value={FIXMETHODS.ASPREFIX}>{this.langConfig('keyword-as-prefix')}</Radio>
                                        <Radio value={FIXMETHODS.ASSUFFIX}>{this.langConfig('keyword-as-subfix')}</Radio>
                                    </Radio.Group> 
                                </div>
    
                                <div style={{marginLeft:10}}>
                                    <Button type="primary" shape="round" icon={<SearchOutlined/>}
                                        onClick={() => this.keywordSearch()}>{this.langConfig('keyword-search')}</Button>
                                </div>
                                
                            </div>
                            
                        </div>
                    </div>
                    <br/>
                    <Table locale={localeKeywordMatch} rowKey={(item) => item.id} dataSource={keywordList} columns={columns}
                           rowClassName='das-account-name noselect' showHeader={false}/>
                    <br/>
                    <div className='statistic-das-count-title'>
                        {this.langConfig('account-word-cloud-title')}
                    </div>
                </Card>
                <br/>
                
                
                <Card id="SuggestedList" title={this.langConfig('recommend-title')} bordered={false}
                      extra={<Button type="primary" shape="round" danger 
                                     onClick={() => this.refreshRecommendList()}>{this.langConfig('recommend-change-list')}</Button>}>
                    
                    <Table locale={localeRecommend} rowKey={(item) => item.id} dataSource={recommendList} columns={columns}
                           rowClassName='das-account-name noselect' showHeader={false}/>
                </Card>
            </div>
            
         */}</div>
        </div>
        )
}

export default SeekTool


