import React from 'react'

import {Card, Space, Input, Button, Table, Radio, Select, Spin} from 'antd';
import {SearchOutlined, QuestionCircleFilled} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { CSVLink } from "react-csv";
import Dropdown from '../components/dropdown/Dropdown';

import localeMgr from '../utils/localeSwitcher'

const SeekTool = () => {
    return (
        <div>
        <div> SeekDIDs，{localeMgr.setLanguage('hahha')}
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


