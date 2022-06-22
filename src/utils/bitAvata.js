import * as spritejs from 'spritejs';   // 头像用到
import md5 from 'blueimp-md5';
import AVATAR_MASK from '../assets/images/avatar-mask.png';

let avatarMap = new Map();

export  const POSITIONS = [
    [0, 0],
    [20, 0],
    [40, 0],
    [0, 20],
    [20, 20],
    [40, 20],
    [0, 40],
    [20, 40],
    [40, 40]
]

export const FIGURE_PATHS = [
    // square
    'M0 0h20v20H0z',
    // triangle
    'M0 0h20L0 20z',
    'M0 0l20 20H0z',
    'M20 0v20H0z',
    'M0 0h20v20z',
    // arc-shaped
    'M20 0v20H0C0 8.954 8.954 0 20 0z',
    'M0 0c11.046 0 20 8.954 20 20H0V0z',
    'M0 0h20v20C8.954 20 0 11.046 0 0z',
    'M0 0h20c0 11.046-8.954 20-20 20V0z',
    // half-angle
    'M10 0c5.523 0 10 4.477 10 10v10H0V10C0 4.477 4.477 0 10 0z',
    'M10 0h10v20H10C4.477 20 0 15.523 0 10S4.477 0 10 0z',
    'M10 0h10v20H10C4.477 20 0 15.523 0 10S4.477 0 10 0z',
    'M0 0h20v10c0 5.523-4.477 10-10 10S0 15.523 0 10V0z',
    // Other
    'M10 0h10v10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0z',
    'M0 0h10c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10V0z',
    'M10 0c5.523 0 10 4.477 10 10v10H10C4.477 20 0 15.523 0 10S4.477 0 10 0z',
    'M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10H0V10C0 4.477 4.477 0 10 0z'
]

export const COLORS = [
    '#338CFF',
    '#FFDA23',
    '#C123FF',
    '#FFC12D',
    '#8221FF',
    '#D49742',
    '#FB23FF',
    '#009CFF',
    '#FF5423',
    '#07BF8B',
    '#2336FF',
    '#DE2E8F',
    '#FF2323',
    '#00C8BB',
    '#6500FF',
    '#DE2E62'
]

export function getPositions(domainMd5) {
    const _positionArray = []
    const _positionObject = {}
    for (let i = 0; i <= 8; i++) {
        _positionArray.push(domainMd5.substr(i * 3, 3))
    }
    _positionArray.sort()
    _positionArray.forEach((position, index) => {
        _positionObject[position] = POSITIONS[index]
    })
    return _positionObject
}

export function getColors(domainMd5) {
    const _strArray = []
    let _colorArray = []
    for (let i = 0; i <= 9; i++) {
        _strArray.push(domainMd5.substr(i * 2, 2))
    }
    _colorArray = _strArray.map((str) => {
        return (str.charCodeAt(0) + str.charCodeAt(1)) % 16
    })
    return _colorArray
}

export function getFigurePaths(domainMd5) {
    const _strArray = []
    let _figurePathArray = []
    for (let i = 0; i <= 8; i++) {
        _strArray.push(domainMd5.substr(i * 2, 2))
    }
    _figurePathArray = _strArray.map((str) => {
        return (str.charCodeAt(0) + str.charCodeAt(1)) % 17
    })
    return _figurePathArray
}


export function getAvatar(id, name) {
        
    let container = document.getElementById(id)
    if (!container) {
        console.log('container is null');
        return;
    }
    // 用缓存
    if (avatarMap.has(name)) {
        let child = container.lastElementChild;
        while (child) { 
            container.removeChild(child); 
            child = container.lastElementChild; 
        } 
        
        container.appendChild(avatarMap.get(name));

        return;
    }

    const {Scene, Sprite, Rect, Ring, Path} = spritejs;
    const nameMd5 = md5(name)
    const _colors = getColors(nameMd5)
    const _positions = getPositions(nameMd5)
    const _figurePaths = getFigurePaths(nameMd5)
    const _size = 60
    const _center = 30

    const scene = new Scene({
        container,
        width: _size,
        height: _size,
        displayRatio: 2,
    })

    const layer = scene.layer()

    // background
    const rect = new Rect({
        normalize: true,
        pos: [_center, _center],
        size: [_size, _size],
        fillColor: COLORS[_colors[8]]
    })
    layer.append(rect)
    // figure
    for (let i = 0; i <= 8; i++) {
        const p = new Path()
        const pos = _positions[nameMd5.substr(i * 3, 3)]
        const d = FIGURE_PATHS[_figurePaths[i]]
        const fillColor = COLORS[_colors[i + 1]]
        p.attr({
            pos,
            d,
            fillColor
        })
        layer.appendChild(p)
    }
    // logo
    const logoSprite = new Sprite(AVATAR_MASK);

    logoSprite.attr({
        pos: [0, 0],
        size: [_size, _size]
    })
    layer.appendChild(logoSprite)
    // ring background
    const ringBg = new Ring({
        pos: [_center, _center],
        innerRadius: 29,
        outerRadius: 45,
        fillColor: '#FFFFFF'
    })
    layer.append(ringBg)
    //
    // ring
    const ring = new Ring({
        pos: [_center, _center],
        innerRadius: 29,
        outerRadius: _center,
        fillColor: COLORS[_colors[0]],
        opacity: 0.2
    })
    layer.append(ring)

    // 先用cavas画出来，然后把canvas的东西转成base64的imgdata，删除canva标签，
    // 用这个imgdata添加一个img标签。
    const snapshotCanvas = scene.snapshot()
    const imgBuffer = snapshotCanvas.toDataURL('image/jpeg');
    
    let child = container.lastElementChild;
    while (child) { 
        container.removeChild(child); 
        child = container.lastElementChild; 
    } 
    
    let imgElement = document.createElement('img');
    imgElement.src = imgBuffer;
    //imgElement.width = imgElement.height = 32;
    imgElement.style = 'height: 32px; width: 32px; border-radius: 32px;';
    container.appendChild(imgElement);

    avatarMap.set(name, imgElement);
}