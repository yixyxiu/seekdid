

// 检测是否可以注册,text 为不加.bit 后缀的字符串
export const canRegister = (text) => {
    
    if (text.length < 4)
        return false;

    // 虽然 > 10 < 47 位都可以注册，但考虑到太长的账号没意义，在此只用15个字符以内的
    if (text.length > 9 && text.length < 20)
        return true;

    // 4-9 位的，算法决定
    text += '.bit';
    var hash = blake2b(32, null, null, Buffer.from('2021-07-22 12:00'));
    hash = hash.update(Buffer.from(text));
    var output = new Uint8Array(32)
    var out = hash.digest(output);

    let arr = out.slice(0,4);
    let uintValue = this.toBeUint32(arr);

    let localTime = new Date()
    // console.log('old: ' + uintValue);
    if (uintValue <= this.getCanRegistValue(localTime)) {
    //    console.log(text, arr, uintValue);
        return true;
    }

    return false
}
        