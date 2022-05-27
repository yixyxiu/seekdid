export class localeSwitcher {
    globalVal = 1;
    lang = 'zh'
    constructor(){
        console.log("--- localeSwitcher constructor ---")
    }


    setLanguage = (language) => {
        this.lang = language;
        console.log(this.lang);
    }

    getLanguage = () => {
        return this.lang;
    }
}

let localeMgr =  new localeSwitcher();

export default localeMgr;