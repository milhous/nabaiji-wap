(function() {
    var _json = {
        "frames": [

            {
                "filename": "btn-again.png",
                "frame": { "x": 10, "y": 576, "w": 316, "h": 74 },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0, "w": 316, "h": 74 },
                "sourceSize": { "w": 316, "h": 74 }
            },
            {
                "filename": "btn-back.png",
                "frame": { "x": 10, "y": 10, "w": 21, "h": 38 },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0, "w": 21, "h": 38 },
                "sourceSize": { "w": 21, "h": 38 }
            },
            {
                "filename": "btn-choose.png",
                "frame": { "x": 10, "y": 492, "w": 315, "h": 74 },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0, "w": 315, "h": 74 },
                "sourceSize": { "w": 315, "h": 74 }
            },
            {
                "filename": "btn-close.png",
                "frame": { "x": 41, "y": 10, "w": 38, "h": 38 },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0, "w": 38, "h": 38 },
                "sourceSize": { "w": 38, "h": 38 }
            },
            {
                "filename": "btn-confirm.png",
                "frame": { "x": 10, "y": 408, "w": 315, "h": 74 },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0, "w": 315, "h": 74 },
                "sourceSize": { "w": 315, "h": 74 }
            },
            {
                "filename": "btn-next.png",
                "frame": { "x": 10, "y": 324, "w": 315, "h": 74 },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0, "w": 315, "h": 74 },
                "sourceSize": { "w": 315, "h": 74 }
            },
            {
                "filename": "btn-rephotograph.png",
                "frame": { "x": 89, "y": 10, "w": 265, "h": 63 },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0, "w": 265, "h": 63 },
                "sourceSize": { "w": 265, "h": 63 }
            },
            {
                "filename": "btn-start.png",
                "frame": { "x": 10, "y": 156, "w": 315, "h": 74 },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0, "w": 315, "h": 74 },
                "sourceSize": { "w": 315, "h": 74 }
            },
            {
                "filename": "btn-submit.png",
                "frame": { "x": 10, "y": 240, "w": 315, "h": 74 },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0, "w": 315, "h": 74 },
                "sourceSize": { "w": 315, "h": 74 }
            },
            {
                "filename": "btn-upload.png",
                "frame": { "x": 10, "y": 83, "w": 265, "h": 63 },
                "rotated": false,
                "trimmed": false,
                "spriteSourceSize": { "x": 0, "y": 0, "w": 265, "h": 63 },
                "sourceSize": { "w": 265, "h": 63 }
            }
        ],
        "meta": {
            "app": "https://www.codeandweb.com/texturepacker",
            "version": "1.0",
            "image": "btns.png",
            "format": "RGBA8888",
            "size": { "w": 512, "h": 1024 },
            "scale": "1",
            "smartupdate": "$TexturePacker:SmartUpdate:b378bd520b4e760bec88e5bb446e55b4:1e5966b4cd0204a4a53674801b4c5733:de2a4fe67d2451b637ba1527a5f89bc3$"
        }
    };

    let _arr = [];
    const _ratio = 100;

    _arr.push(`.${_json.meta.image.split('.')[0]}{background-size: ${_json.meta.size.w / _ratio}rem ${_json.meta.size.h / _ratio}rem;}`);

    _json.frames.map((obj, index) => {
        const data = obj.frame;
        let left = data.x > 0 ? -data.x / _ratio + 'rem' : 0;
        let top = data.y > 0 ? -data.y / _ratio + 'rem' : 0;
        let width = data.w;
        let height = data.h;
        let classname = obj.filename.split('/');

        classname = classname[classname.length - 1].split('.');
        classname = classname[0];

        if (width % 2) {
            width = width + 1;
        }

        width = width / _ratio + 'rem';

        if (height % 2) {
            height = height + 1;
        }

        height = height / _ratio + 'rem';

        let str = `.${classname}{width: ${width}; height: ${height}; background-position: ${left} ${top};}`;

        _arr.push(str);
    });

    console.log(_arr.join('\n'));
})();