(function() {
    // 人形抠像
    var REQUEST_SEGMENT = 'http://nabaiji.yuncoupons.com/interface/get_body_seq.php';
    // 保存图片
    var REQUEST_SAVE = 'http://nabaiji.yuncoupons.com/interface/save_img.php';
    // 获取参数
    var REQUEST_WX = 'http://nabaiji.yuncoupons.com/interface/get_wx_tickets.php';
    // 获取照片
    var REQUEST_PHOTO = 'http://nabaiji.yuncoupons.com/interface/get_my_photos.php';
    // 设置协议状态
    var REQUEST_SET_AGREE = 'http://nabaiji.yuncoupons.com/interface/set_agree_status.php';
    // 获取协议状态
    var REQUEST_GET_AGREE = 'http://nabaiji.yuncoupons.com/interface/get_agree_status.php';

    // 模板人脸数据
    var templateFaceData = null;
    // 默认人脸base64
    var templateImageData = null;

    // 元素
    var $elem = {
        wrap: $('.wrap'),
        stageList: $('.stage-list .stage'),
        sceneFlipperFront: $('.scene-flipper_front'),
        sceneFlipperBack: $('.scene-flipper_back'),
        themeList: $('.theme-list li'),
        preview: $('#preview')
    };

    // 场景索引值
    var sceneIndex = 0;
    // 场景数量
    var sceneNums = $elem.stageList.length;
    // 是否初次
    var isNewer = true; 

    // swiper
    var swiper = null;
    // 头像
    var bodyImg = {
        width: 0,
        height: 0,
        url: null
    };

    // 场景名称与索引值映射关系
    var SCENE = {
        LANDING: 0,
        THEME: 1,
        PHOTO: 2,
        SAVE: 3,
        WALL: 4
    };

    // 用户信息
    var info = {
        // 姓名
        name: null,
        // 手机号码
        mobile: null,
        // 性别
        gender: null,
        // 文案
        word: null,
        // 主题
        theme: null,
        // 照片
        photo: null
    };

    // 主题信息
    var theme = {
        '0': 'sandbeach1',
        '1': 'sandbeach2',
        '2': 'pool1',
        '3': 'pool2',
        '4': 'underwater1',
        '5': 'underwater2'
    };

    // 主题文案
    var themeSay = {
        '0': '单身不是缺憾单调才是',
        '1': '单身不是缺憾单调才是',
        '2': '美丽的皮囊千篇一律\n有趣的灵魂万里挑一',
        '3': '美丽的皮囊千篇一律\n有趣的灵魂万里挑一',
        '4': '不一定要瘦\n但一定要享受',
        '5': '不一定要瘦\n但一定要享受'
    };

    // 主题资源
    var themeAssets = {
        width: 617,
        height: 906,
        path: 'images/theme/',
        pic: {
            file: null,
            width: 617,
            height: 906,
            x: 0,
            y: 0
        },
        border: {
            file: 'theme-border.png',
            width: 45,
            height: 85,
            x: 30,
            y: 740
        },
        tag: {
            file: 'theme-tag.png',
            width: 100,
            height: 57,
            x: 484,
            y: 822
        },
        slogan: {
            file: 'theme-slogan.png',
            width: 140,
            height: 230,
            x: 430,
            y: 50
        },
        QRcode: {
            file: 'theme-QRcode.png',
            width: 78,
            height: 80,
            x: 495,
            y: 740
        },
        panel: {
            file: 'theme-panel.png',
            width: 617,
            height: 906,
            x: 0,
            y: 0
        },
        say: {
            file: null,
            width: 560,
            height: 860,
            x: 0,
            y: 0
        }
    };

    // 验证工具
    var tool = {
        trim: function(value) {
            return value.replace(/(^\s*)|(\s*$)/g, '');
        },
        isMobile: function(value) {
            return (/^[1][3-8]\d{9}$/).test(value);
        },
        isEmail: function(value) {
            return (/^[-_A-Za-z0-9\.]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,4}$/).test(value);
        },
        isPhone: function(value) {
            return (/^[1-9]{1}[0-9]{5,8}$/).test(value) || (/^[0][1-9]{2,3}-[0-9]{5,10}$/).test(value);
        },
        isNull: function(value) {
            if (value == '') {
                return true;
            }
            return (/^[ ]+$/).test(value);
        },
        isIP: function(value) {
            if (isNull(value)) {
                return false;
            }

            if ((/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g).test(value)) {
                if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) return true;
            }
            return false;
        },
        /*是否为整个数字*/
        isInteger: function(value) {
            return (/^[-]{0,1}[0-9]{1,}$/).test(value);
        },
        /*是否只由数字，字母，下划线组成*/
        isNumberOrLetter: function(value) {
            return (/^[0-9a-zA-Z\_]+$/).test(value);
        },
        /*是否为url格式*/
        isUrl: function(value) {
            return (/^http|https|ftp:\/\/[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/).test(value);
        }
    };

    /*
     * 截取字符串，支持中文
     * @param (string) str 截取的字符串
     * @param (number) len 截取的字符串长度
     * @param (number) fixed 截取后修正字符数量
     */
    var formatData = function(str, len, correction) {
        var cut_len = len || 8;
        var cor_len = correction || 0;
        var _str = '' + str;
        var str_len = 0;
        var str_cut = '';

        for (var i = 0, _len = _str.length; i < _len; i++) {
            var a = _str.charAt(i);

            str_len++;

            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4
                str_len++;
            }

            if (str_len <= cut_len) {
                str_cut = str_cut.concat(a);
            }
        }

        //如果给定字符串小于指定长度，则返回原字符串
        if (str_len > cut_len) {
            str_cut = str_cut.substring(0, str_cut.length - cor_len);
            str_cut = str_cut.concat('...');
        }

        return str_cut;
    };

    /**
     * 格式化昵称，支持中文
     * @param (string) str 截取的字符串
     * @param (string) len 截取的字符串长度 默认中文最多4个，英文8个
     **/
    var formatSensitiveData = function(str, len) {
        var cut_len = len || 8;
        var _str = '' + str;
        var str_len = 0;

        for (var i = 0, _len = _str.length; i < _len; i++) {
            var a = _str.charAt(i);

            str_len++;

            if (escape(a).length > 4) {
                //中文字符的长度经编码之后大于4
                str_len++;
            }
        }

        //如果给定字符串小于指定长度，则返回原字符串
        if (str_len > cut_len) {
            _str = _str.substr(0, 3) + '***' + _str.substr(_str.length - 3, _str.length);
        }

        return _str;
    };

    //预加载
    var preloadAssets = function() {
        // 预加载图片资源
        var assets = {
            'path': 'images/',
            'file': [
                'bg-landing.jpg', 'bg-pop_buy.png', 'btn-close.png',
                'btn-buy.png', 'btn-decathlon.png', 'btn-photoWall.png', 'btn-rule.png',
                'btn-start.png', 'btn-tmall.png', 'word-landing_title.png', 'word-tmall_title.png'
            ]
        };

        var len = assets.file.length;
        var counter = len;
        var percent = 0;

        var loadAssets = function() {
            counter--;

            percent = ((len - counter) * 100 / len).toFixed(0);

            console.log('loading:', percent + '%');

            if (counter === 0) {
                console.log('loading: complete');

                setSceneName();
            }
        };

        for (var i = 0; i < len; i++) {
            var img = new Image();
            img.onload = loadAssets;
            img.onerror = loadAssets;
            img.src = assets.path + assets.file[i];
        }
    };

    // 初始化swiper
    var initSwiper = function() {
        swiper = new Swiper('.wrap .swiper-container', {
            speed: 600,
            loop: true,
            on: {
                init: function() {},
                slideChange: function() {
                    changeTheme(this.realIndex);

                    recordThemeInfo(this.realIndex);
                }
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    };

    /*
     * 进入下一个场景
     * @param (function) callback 回调函数
     */
    var goToNextScene = function(callback) {
        if (sceneIndex + 1 >= sceneNums) {
            return;
        }

        sceneIndex++;

        // 加载场景
        loadScene();

        if (typeof callback === 'function') {
            callback();
        }
    };

    /*
     * 进入下一个场景
     * @param (function) index 场景索引值
     * @param (function) callback 回调函数
     */
    var goToScene = function(index, callback) {
        if (index >= sceneNums || index < 0) {
            return;
        }

        sceneIndex = index;

        $elem.wrap.addClass('flipper-disabled');

        // 加载场景
        loadScene();

        setTimeout(function() {
            $elem.wrap.removeClass('flipper-disabled');
        }, 100);

        if (typeof callback === 'function') {
            callback();
        }
    };

    // 加载场景
    var loadScene = function() {
        // 设置场景舞台
        setSceneStage();

        // 设置场景类名
        setSceneName();
    };

    // 设置场景舞台
    var setSceneStage = function() {
        var $stage = $elem.stageList.eq(sceneIndex);
        var html = $stage.parent().html();

        if (sceneIndex % 2 === 0) {
            $elem.sceneFlipperFront.html(html);
        } else {
            $elem.sceneFlipperBack.html(html);
        }
    };

    // 设置场景类名
    var setSceneName = function() {
        var classNameArr = $elem.wrap.attr('class').split(' ');

        for (var i = 0, len = classNameArr.length; i < len; i++) {
            var className = classNameArr[i];

            if (className.indexOf('scene') > -1) {
                $elem.wrap.removeClass(className);

                break;
            }
        }

        $elem.wrap.addClass('scene-' + sceneIndex);
    };

    // 记录用户信息
    var recordBaseInfo = function() {
        var username = tool.trim($('#username').val());

        if (!username.length) {
            alert('请选择您的姓名');

            return false;
        }

        var mobile = tool.trim($("#mobile").val());

        if (!mobile.length) {
            alert('请选择您的手机号码');

            return false;
        } else if (!tool.isMobile(mobile)) {
            alert("请选择正确的手机号码");

            return false;
        }

        info.name = formatData(username);
        info.mobile = mobile;
        info.gender = $('input[name="gender"]:checked').val();

        console.log('base', info);

        return true;
    };

    // 记录用户主题
    var recordThemeInfo = function(index) {
        if (typeof theme[index] !== 'undefined') {
            info.theme = theme[index];
            info.word = themeSay[index];

        }

        console.log('theme', info);
    };

    /*
     * 切换主题
     * @param (number) index 主题索引值
     */
    var changeTheme = function(index) {
        $('.theme-list li').removeClass('theme-ani');
        $('.theme-dot li').removeClass('theme-ani');
        $('.theme-btn span').removeClass('theme-ani');

        if (typeof index === 'number' && index > -1) {
            $('.theme-list li').eq(index).addClass('theme-ani');
            $('.theme-dot li').eq(index).addClass('theme-ani');
            $('.theme-btn span').eq(index).addClass('theme-ani');
        }
    };

    // 更新主题资源
    var updateThemeAssets = function() {
        themeAssets.pic.file = 'theme-' + info.theme + '_pic.jpg';

        console.log('theme assets', themeAssets);
    };

    // 创建模板
    var createTemplate = function() {
        var arr = [];

        arr.push('<span class="photo-item photo-' + info.theme + '_pic"></span>');
        arr.push('<span class="photo-item photo-' + info.theme + '_mask"></span>');
        arr.push('<span class="photo-item photo-item_slogan"></span>');
        arr.push('<span class="photo-item photo-item_border"></span>');
        arr.push('<span class="photo-item photo-item_QRcode"></span>');
        arr.push('<span class="photo-item photo-item_tag"></span>');
        arr.push('<span class="words word-photo_tips"></span>');

        $('.photo-template').html(arr.join('')).css('display', 'block');
    };

    /*
     * 获取人形抠图数据
     * @param (function) callback 回调函数
     */
    var getSegmentData = function(file, callback) {
        var formData = new FormData();

        formData.append('file', file);

        $.ajax({
            url: REQUEST_SEGMENT,
            type: 'post',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(data) {
                if (data.error_code === 0) {
                    var img = new Image();
                    img.setAttribute("crossOrigin", 'Anonymous');
                    img.onload = function() {
                        bodyImg.width = img.width;
                        bodyImg.height = img.height;
                        bodyImg.url = data.url;

                        var base64 = getImageBaset64(img);

                        $('#avatar').attr('src', base64);

                        if (!$('.wrap .btn-submit').hasClass('btn-reset')) {
                            $('.wrap .btn-submit').addClass('btn-reset')
                        }

                        typeof callback === 'function' && callback(data.url);
                    };
                    img.src = data.url;
                } else {
                    alert('抠图失败,请刷新重试!');
                }
            },
            error: function(data) {
                alert("抠图失败,请刷新重试!");
            }
        });
    };

    // 生成图片
    var createPhoto = function() {
        var canvas = document.getElementById('template');

        if (canvas === null) {
            alert('请上传泳照');

            return;
        }

        var dataURL = canvas.toDataURL('image/jpeg');

        $.ajax({
            url: REQUEST_SAVE,
            type: 'post',
            cache: false,
            data: { 'base64': dataURL },
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {
                    goToNextScene(function() {
                        $('.wrap .stage-save').find('img').attr('src', data.url);
                    });
                } else {
                    alert(data.error_msg);
                }
            },
            error: function(data) {
                alert("生成失败,请刷新重试!");
            }
        });
    };

    /*
     * 获取图片base64
     * @param (object) img image对象
     */
    var getImageBaset64 = function(img) {
        var data = null;
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

        data = canvas.toDataURL('image/png');

        return data;
    };

    /*
     * 拍照预览
     * @param (object) file 图片
     * @param (function) callback 回调函数
     */
    var previewPhoto = function(file, callback) {
        if (!/image\/\w+/.test(file.type)) {
            alert('请确保文件为图像类型！');

            return;
        }

        getSegmentData(file, function(url) {
            compoundPhoto();
        });
    };

    // 合成图片
    var compoundPhoto = function() {
        // 清空模板
        $('.wrap .photo-template').css('display', 'none');
        $('.wrap .photo-canvas canvas').remove();

        // 合成图片
        var html = '<canvas id="template"></canvas>';
        $('.wrap .photo-canvas').append(html);

        var template = document.getElementById('template');
        template.width = themeAssets.width;
        template.height = themeAssets.height;

        var Stage = AlloyPaper.Stage,
            Bitmap = AlloyPaper.Bitmap,
            Loader = AlloyPaper.Loader;
        var rectPic = [0, 0, themeAssets.pic.width, themeAssets.pic.height, 0, 0, themeAssets.pic.width, themeAssets.pic.height];
        var rectSlogan = [0, 0, themeAssets.slogan.width, themeAssets.slogan.height, 0, 0, themeAssets.slogan.width, themeAssets.slogan.height];
        var rectBorder = [0, 0, themeAssets.border.width, themeAssets.border.height, 0, 0, themeAssets.border.width, themeAssets.border.height];
        var rectQRcode = [0, 0, themeAssets.QRcode.width, themeAssets.QRcode.height, 0, 0, themeAssets.QRcode.width, themeAssets.QRcode.height];
        var rectTag = [0, 0, themeAssets.tag.width, themeAssets.tag.height, 0, 0, themeAssets.tag.width, themeAssets.tag.height];
        var rectPanel = [0, 0, themeAssets.panel.width, themeAssets.panel.height, 0, 0, themeAssets.panel.width, themeAssets.panel.height];
        var rectAvatar = [0, 0, bodyImg.width, bodyImg.height, 0, 0, bodyImg.width, bodyImg.height];

        var stage = new Stage('#template');
        stage.autoUpdate = false;
        stage.style = stage._getStyle();

        var ld = new Loader();

        ld.loadRes([{
            id: 'pic',
            src: themeAssets.path + themeAssets.pic.file
        }, {
            id: 'slogan',
            src: themeAssets.path + themeAssets.slogan.file
        }, {
            id: 'border',
            src: themeAssets.path + themeAssets.border.file
        }, {
            id: 'QRcode',
            src: themeAssets.path + themeAssets.QRcode.file
        }, {
            id: 'tag',
            src: themeAssets.path + themeAssets.tag.file
        }, {
            id: 'panel',
            src: themeAssets.path + themeAssets.panel.file
        }]);

        ld.complete(function() {
            var pic = new Bitmap(ld.get('pic'), rectPic);
            var slogan = new Bitmap(ld.get('slogan'), rectSlogan);
            var border = new Bitmap(ld.get('border'), rectBorder);
            var QRcode = new Bitmap(ld.get('QRcode'), rectQRcode);
            var tag = new Bitmap(ld.get('tag'), rectTag);
            var panel = new Bitmap(ld.get('panel'), rectPanel);

            pic.originX = 0.5;
            pic.originY = 0.5;
            pic.x = themeAssets.pic.x + themeAssets.pic.width / 2;
            pic.y = themeAssets.pic.y + themeAssets.pic.height / 2;
            stage.add(pic);

            var avatar = new Bitmap($('#avatar')[0], rectAvatar);
            avatar.originX = 0.5;
            avatar.originY = 0.5;
            avatar.x = themeAssets.pic.width / 2;
            avatar.y = themeAssets.pic.height / 2;
            stage.add(avatar);

            slogan.originX = 0.5;
            slogan.originY = 0.5;
            slogan.x = themeAssets.slogan.x + themeAssets.slogan.width / 2;
            slogan.y = themeAssets.slogan.y + themeAssets.slogan.height / 2;
            stage.add(slogan);

            border.originX = 0.5;
            border.originY = 0.5;
            border.x = themeAssets.border.x + themeAssets.border.width / 2;
            border.y = themeAssets.border.y + themeAssets.border.height / 2;
            stage.add(border);

            QRcode.originX = 0.5;
            QRcode.originY = 0.5;
            QRcode.x = themeAssets.QRcode.x + themeAssets.QRcode.width / 2;
            QRcode.y = themeAssets.QRcode.y + themeAssets.QRcode.height / 2;
            stage.add(QRcode);

            tag.originX = 0.5;
            tag.originY = 0.5;
            tag.x = themeAssets.tag.x + themeAssets.tag.width / 2;
            tag.y = themeAssets.tag.y + themeAssets.tag.height / 2;
            stage.add(tag);

            panel.originX = 0.5;
            panel.originY = 0.5;
            panel.x = themeAssets.panel.width / 2;
            panel.y = themeAssets.panel.height / 2;
            stage.add(panel);

            stage.update();

            var initScale = 1;

            new AlloyFinger(panel, {
                multipointStart: function() {
                    initScale = avatar.scaleX;
                },
                rotate: function(evt) {
                    evt.preventDefault();

                    avatar.rotation += evt.angle;

                    stage.update();
                },
                pinch: function(evt) {
                    evt.preventDefault();

                    avatar.scaleX = avatar.scaleY = initScale * evt.zoom;

                    stage.update();
                },
                pressMove: function(evt) {
                    evt.preventDefault();

                    avatar.x += evt.deltaX;
                    avatar.y += evt.deltaY;

                    stage.update();
                }
            });
        });

        $('#template').css('transform', 'scale(' + $('.photo-canvas').width() / themeAssets.width + ')');
    };

    // 生成模板图片
    var createSayPhoto = function() {
        var canvas = document.createElement('canvas');
        canvas.width = themeAssets.say.width;
        canvas.height = themeAssets.say.height;
        var ctx = canvas.getContext("2d");

        ctx.font = '30px VerlagBook, FZZhunYuan';
        ctx.fillStyle = '#767676';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(info.name + '：' + info.belief, 280, 780, themeAssets.say.width);

        var data = canvas.toDataURL('image/png');

        $('#say').attr({
            src: data,
            width: themeAssets.say.width,
            height: themeAssets.say.height
        });
    };

    // 获取分享信息
    var getShareInfo = function() {
        var link = location.href.split('#')[0];

        $.ajax({
            url: REQUEST_WX,
            type: 'post',
            cache: false,
            data: {
                link: link
            },
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appid, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonceStr, // 必填，生成签名的随机串
                        signature: data.signature, // 必填，签名
                        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'] // 必填，需要使用的JS接口列表
                    });

                    initShare();
                } else {
                    alert(data.error_msg);
                }
            },
            error: function(data) {
                alert("获取失败,请刷新重试!");
            }
        });
    };

    // 获取照片
    var getMyImgs = function() {
        $.ajax({
            url: REQUEST_PHOTO,
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {
                    var arr = [];

                    for (var i = 0, len = data.photos.length; i < len; i++) {
                        var item = data.photos[i];
                        var str = '<div class="wall-item">';
                        str += '<div><img src="' + item.image + '" /></div>';
                        str += '<dl><dt><img src="' + item.headimg + '" /><span>' + item.nickname + '</span></dt>';
                        str += '<dd><span>' + item.tickets + '</span>票</dd></dl></div>';

                        arr.push(str);
                    }

                    $('.wrap .wall-list').html(arr.join(''));
                } else {
                    alert(data.error_msg);
                }
            },
            error: function(data) {
                alert("获取失败,请刷新重试!");
            }
        });
    };

    // 获取协议状态
    var getAgreeStatus = function() {
        $.ajax({
            url: REQUEST_GET_AGREE,
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {
                    $('#agreement').prop('checked', true);
                } else {
                    alert(data.error_msg);
                }
            },
            error: function(data) {
                alert("获取失败,请刷新重试!");
            }
        });
    };

    // 设置协议状态
    var setAgreeStatus = function(agreement) {
        $.ajax({
            url: REQUEST_SET_AGREE,
            type: 'post',
            cache: false,
            data: {
                agree_rule: agreement
            },
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {

                } else {
                    alert(data.error_msg);
                }
            },
            error: function(data) {
                alert("设置失败,请刷新重试!");
            }
        });
    };

    // 定义分享
    var initShare = function() {
        var title = '晒出最美泳姿 赢迪卡侬大奖';
        var link = 'http://nabaiji.yuncoupons.com';
        var desc = '暗夜精灵泳衣，SHOW出你的美';
        var imgUrl = 'http://nabaiji.yuncoupons.com/share.png';

        wx.ready(function() {
            // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
            wx.updateAppMessageShareData({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function() {
                    // 设置成功
                    console.log('自定义“分享给朋友”及“分享到QQ”按钮的分享内容设置成功');
                }
            });

            // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
            wx.updateTimelineShareData({
                title: title, // 分享标题
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function() {
                    // 设置成功
                    console.log('自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容设置成功');
                }
            })
        });
    };

    // 初始化事件
    var initEvent = function() {
        // 弹层 - 协议状态
        $(document).on('change', '#agreement', function(evt) {
            var isChecked = $(this).prop('checked');

            setAgreeStatus(isChecked);
        });

        // 场景 - 首页
        $(document).on('click', '.btn-start', function() {
            if (isNewer) {
                isNewer = false;

                // 显示弹层
                ee.trigger(cmd.SHOW_POP, ['.pop-rule']);
            }

            goToNextScene(initSwiper);
        });

        // 购买泳装
        $(document).on('click', '.btn-buy', function(evt) {
            evt.preventDefault();

            // 显示弹层
            ee.trigger(cmd.SHOW_POP, ['.pop-buy']);
        });

        // 天猫
        $(document).on('click', '.btn-tmall', function(evt) {
            evt.preventDefault();

            // 显示弹层
            ee.trigger(cmd.SHOW_POP, ['.pop-tmall']);
        });

        // 活动规则
        $(document).on('click', '.btn-rule', function(evt) {
            evt.preventDefault();

            // 显示弹层
            ee.trigger(cmd.SHOW_POP, ['.pop-rule']);
        });

        // 照片墙
        $(document).on('click', '.btn-photoWall', function() {
            goToScene(SCENE.WALL, getMyImgs);
        });

        // 场景 - 确定场景
        $(document).on('click', '.btn-confirm', function(evt) {
            evt.preventDefault();

            updateThemeAssets();

            goToNextScene(function() {
                createTemplate();
            });
        });

        // 场景 - 提交照片
        $(document).on('change', '.btn-submit input[type="file"]', function(evt) {
            previewPhoto(this.files[0]);
        });

        // 场景 - 生成海报
        $(document).on('click', '.btn-create', function() {
            createPhoto();
        });
    };

    // 初始化
    var init = function() {
        initEvent();

        getShareInfo();

        getAgreeStatus();

        // 预加载资源图片
        $(document).ready(preloadAssets);
    };

    init();
})();