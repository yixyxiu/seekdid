import { ToastContainer, toast } from "react-toastify";

export class localeCacheInstance {
     state = {
         favoriteList:[],
         localConfig:{}
     }

    constructor(){
        console.log("--- localeCache constructor ---")
        this.init();
    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new localeCacheInstance();
        }
        return this.instance;
    }

    init = () => {
        this.loadFavoriteList();
        this.loadLocalConfig();
    }

    loadFavoriteList = () => {
        let favoriteList = localStorage.getItem('favoriteList');
        if (!favoriteList) {
            favoriteList = '[]';
        }
           
        this.state.favoriteList = JSON.parse(favoriteList);
    }

    addToFavorite = (account) => {
        if (!this.state.favoriteList.includes(account)) {
            
            this.state.favoriteList.push(account);

            this.saveFavoriteList(this.state.favoriteList);

            // 没有提示过，则提醒用户，本地收藏是安全的
            if (!this.state.localConfig['newbie-add-favorite-tip-showed']) {
                this.openNotification(
                    'success',
                    this.langConfig('add-to-favorite'), 
                    this.langConfig('first-add-fav-tip'),
                    0)

                this.state.localConfig['newbie-add-favorite-tip-showed'] = true;
                this.saveLocalConfig(this.state.localConfig);
            }
        }
    }

    removeFromArray = (arr, value) => { 
    
        return arr.filter(function(ele){ 
            return ele != value; 
        });
    }

    removeFromFavorite = (account) => {
        this.state.favoriteList = this.removeFromArray(this.state.favoriteList, account);
        this.saveFavoriteList(this.state.favoriteList);

        // 没有提示过，则提醒用户，本地收藏是安全的
        if (!this.state.localConfig['newbie-remove-favorite-tip-showed']) {
            this.openNotification(
                'warning',
                this.langConfig('remove-from-favorite'), 
                this.langConfig('remove-from-favorite-tip'),
                0)

            this.state.localConfig['newbie-remove-favorite-tip-showed'] = true;
            this.saveLocalConfig(this.state.localConfig);
        }
    }

    clearFavorite = () => {
        this.setState({favoriteList: []});
        this.saveFavoriteList([]);
    }

    saveFavoriteList = (favoriteList) => {
        if (favoriteList) {
            localStorage.setItem('favoriteList', JSON.stringify(favoriteList));
        }

        this.setState({favoriteList: favoriteList});
    }

    getUnFavoriteTip = (account) => {
        let format = this.langConfig('unfavorite-item-tip');
        return format;
    }

    loadLocalConfig = () => {
        let config = localStorage.getItem('localConfig');
        if (!config) {
            config = '{}';
        }
           
        return JSON.parse(config);
    }

    saveLocalConfig = (config) => {
        if (config) {
            localStorage.setItem('localConfig', JSON.stringify(config));
        }
    }


    isFavorite = (account) => {
        if (this.state.favoriteList.includes(account)) {
            return true;
        }

        return false;
    }

    setLanguage = (language) => {
        this.lang = language;
        console.log(this.lang);
    }

    getLanguage = () => {
        return this.lang;
    }

    render = () => {
        return <ToastContainer />
    }
}

let localCache =  localeCacheInstance.getInstance();

export default localCache;