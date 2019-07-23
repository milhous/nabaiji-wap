(function() {
    // 人形抠像
    var REQUEST_SEGMENT = 'http://nabaiji.yuncoupons.com/interface/get_body_seq.php';
    // 保存图片
    var REQUEST_SAVE = 'http://nabaiji.yuncoupons.com/interface/save_img.php';
    // 获取参数
    var REQUEST_WX = 'http://nabaiji.yuncoupons.com/interface/get_wx_tickets.php';
    // 获取照片
    var REQUEST_PHOTO = 'http://nabaiji.yuncoupons.com/interface/get_my_photos.php';
    // 获取所有照片
    var REQUEST_ALL = 'http://nabaiji.yuncoupons.com/interface/get_all_photos.php';
    // 获取分页照片
    var REQUEST_PAGE = 'http://nabaiji.yuncoupons.com/interface/get_page_photos.php';
    // 设置协议状态
    var REQUEST_SET_AGREE = 'http://nabaiji.yuncoupons.com/interface/set_agree_status.php';
    // 获取协议状态
    var REQUEST_GET_AGREE = 'http://nabaiji.yuncoupons.com/interface/get_agree_status.php';
    // 投票
    var REQUEST_LOVE = 'http://nabaiji.yuncoupons.com/interface/love_pic.php';
    // 记录信息
    var REQUEST_INFO = 'http://nabaiji.yuncoupons.com/interface/save_info.php';

    // 计时器
    var timer = null;

    // cdn
    var cdn = 'http://cdn.nabaiji.yuncoupons.com/';

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

    // swiper
    var swiper = null;
    // 头像
    var bodyImg = {
        width: 0,
        height: 0,
        url: null
    };
    // 是否引导过
    var isGuide = false;

    // 场景名称与索引值映射关系
    var SCENE = {
        LANDING: 0,
        THEME: 1,
        PHOTO: 2,
        SAVE: 3,
        WALL: 4,
        PLAYBILL: 5
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
        photo: null,
        // 口号类型
        sloganType: 0
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

    // 合成图片文字阴影
    var shadow = {
        width: 0,
        height: 0
    };

    // 主题文案
    var themeSay = {
        '0': '单身不是缺憾\n单调才是',
        '1': '单身不是缺憾\n单调才是',
        '2': '美丽的皮囊千篇一律\n有趣的灵魂万里挑一',
        '3': '美丽的皮囊千篇一律\n有趣的灵魂万里挑一',
        '4': '不一定要瘦\n但一定要享受',
        '5': '不一定要瘦\n但一定要享受'
    };

    var slogaData = {
        '0': {
            word: '单身不是缺憾\n单调才是',
            class: 'sandbeach1'
        },
        '1': {
            word: '美丽的皮囊千篇一律\n有趣的灵魂万里挑一',
            class: 'pool1'
        },
        '2': {
            word: '不一定要瘦\n但一定要享受',
            class: 'underwater1'
        }
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
            width: 165,
            height: 110,
            x: 452,
            y: 795
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
            width: 81,
            height: 81,
            x: 494,
            y: 742
        },
        sayShadow: {
            file: 'theme-shadow.png',
            width: 432,
            height: 197,
            x: 0,
            y: 663
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
            width: 400,
            height: 80,
            x: 50,
            y: 735
        }
    };

    // 省份
    var provinceList = [
        '请选择', '宁夏', '陕西', '重庆', '云南', '四川', '贵州', '湖南', '湖北', '海南', '广西', '江西',
        '福建', '广东', '江苏', '安徽', '浙江', '山东', '山西', '内蒙古', '新疆', '黑龙江', '天津', '河南',
        '河北', '吉林', '辽宁', '北京', '上海'
    ];
    // 城市
    var cityList = {
        '请选择': ['请选择'],
        '宁夏': ['银川'],
        '陕西': ['汉中', '西安'],
        '重庆': ['重庆'],
        '云南': ['昆明'],
        '四川': ['绵阳', '泸州', '宜宾', '成都'],
        '贵州': ['贵阳'],
        '湖南': ['常德', '株洲', '湘潭', '长沙', '衡阳'],
        '湖北': ['武汉', '黄石', '襄阳'],
        '海南': ['海口'],
        '广西': ['桂林', '南宁', '柳州', '北海'],
        '江西': ['九江', '上饶', '南昌', '萍乡'],
        '福建': ['漳州', '福州', '厦门', '莆田'],
        '广东': ['阳江', '珠海', '湛江', '中山', '江门', '佛山', '深圳', '东莞', '河源', '广州', '梅州'],
        '江苏': ['苏州', '南通', '昆山', '泰州', '徐州', '淮安', '南京', '扬州', '盐城', '镇江', '常州', '江阴', '无锡', '张家港'],
        '安徽': ['蚌埠', '芜湖', '合肥', '马鞍山'],
        '浙江': ['宁波', '杭州', '嘉兴', '绍兴', '温州'],
        '山东': ['青岛', '淄博', '菏泽', '潍坊', '东营', '威海', '济南', '烟台'],
        '山西': ['晋中', '大同', '临汾'],
        '内蒙古': ['乌海', '包头'],
        '新疆': ['乌鲁木齐'],
        '黑龙江': ['哈尔滨', '大庆'],
        '天津': ['天津'],
        '河南': ['许昌', '平顶山', '洛阳', '郑州'],
        '河北': ['邯郸', '三河', '唐山', '廊坊', '石家庄'],
        '吉林': ['长春', '吉林', '四平', '松原'],
        '辽宁': ['抚顺', '沈阳', '营口', '盘锦', '鞍山', '大连'],
        '北京': ['北京'],
        '上海': ['上海']
    };

    // 门店地址
    var storeAddress = {
        province: '',
        city: ''
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
            img.src = cdn + assets.path + assets.file[i];
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

    // 初始化海报swiper
    var initPlaybillSwiper = function(list) {
        var arr = [];
        var len = list.length;

        if (list.length === 0) {
            return;
        }

        if (list.length > 1) {
            $('.wrap .swiper-button-next').css('display', 'block');
            $('.wrap .swiper-button-prev').css('display', 'block');
        }

        $('.wrap .swiper-container').css('opacity', 1);

        for (var i = 0; i < len; i++) {
            var item = list[i];

            arr.push('<div class="swiper-slide" data-pid="' + item.id + '" data-uid="' + item.uid + '"><img src="' + cdn + item.image + '" /></div>');
        }

        $('.wrap .swiper-container').find('.swiper-wrapper').html(arr.join(''));

        swiper = new Swiper('.wrap .swiper-container', {
            speed: 600,
            loop: true,
            on: {
                init: function() {},
                slideChange: function() {
                    updatePlaybillInfo(list[this.realIndex]);
                }
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            }
        });
    };

    // 更新文案
    var updatePlaybillInfo = function(data) {
        $('.wrap .playbill-votes').html(data.tickets + ' 票');
        $('.wrap .playbill-rank').html('当前排名 ' + data.rank);

        initShare(data.id, data.nickname);
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
            info.sloganType = index % 3;
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
        // arr.push('<span class="words word-photo_tips"></span>');
        arr.push('<span class="photo-item photo-item_shadow"></span>');
        arr.push('<span class="photo-item photo-item_cursor animation-flash ' + info.theme + '"></span>');
        arr.push('<textarea class="photo-item photo-item_word" rows="2" cols="20" wrap="hard" maxlength="20">' + info.word + '</textarea>');
        arr.push('<span class="photo-item btns btn-slogan_prev"></span>');
        arr.push('<span class="photo-item btns btn-slogan_next"></span>');

        $('.photo-template').html(arr.join('')).css('display', 'block');
    };

    // 显示引导
    var createGuide = function() {
        var src = cdn + 'images/theme-' + info.theme + '_guide.png';

        $('.pop-guide_photo').find('img').attr('src', src);

        if (!$('.pop-guide_slogan').hasClass('hide')) {
            $('.pop-guide_slogan').addClass('hide');
        }

        if ($('.pop-guide_photo').hasClass('hide')) {
            $('.pop-guide_photo').removeClass('hide');
        }

        ee.trigger(cmd.SHOW_POP, ['.pop-guide']);
    };

    /*
     * 获取人形抠图数据
     * @param (function) callback 回调函数
     */
    var getPhtotData = function(file, callback) {
        var formData = new FormData();

        if (file.size / 1024 > 2050) { //大于1M，进行压缩上传

            photoCompress(file, {
                width: 2048
            }, function(base64Codes) {
                var blob = convertBase64UrlToBlob(base64Codes);
                formData.append('file', blob, 'file_' + Date.parse(new Date()) + '.jpg');

                getSegmentData(formData, callback);
            });
        } else { //小于等于1M 原图上传
            formData.append("file", file);

            getSegmentData(formData, callback);
        }
    };

    /*
     * 获取人形抠图
     * @param {object} formData 表单数据
     * @param (function) callback 回调函数
     */
    var getSegmentData = function(formData, callback) {
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

                        if (base64 === null) {
                            showError();

                            return;
                        }

                        $('#avatar').attr('src', base64);

                        if (!$('.wrap .btn-submit').hasClass('btn-reset')) {
                            $('.wrap .btn-submit').addClass('btn-reset')
                        }

                        typeof callback === 'function' && callback(data.url);
                    };
                    img.src = data.url;
                } else {
                    showError();
                }
            },
            error: function(data) {
                showError();
            }
        });
    }

    /*
     * 压缩图片
     * @param {object} file 文件(类型是图片格式)，
     * @param {number} opts 配置选项
     * @param {function} callback 回调函数
     */
    var photoCompress = function(file, opts, callback) {
        var ready = new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        ready.readAsDataURL(file);

        ready.onload = function() {
            var result = this.result;

            var img = new Image();
            img.onload = function() {
                // 默认按比例压缩
                var w = img.width;
                var h = img.height;
                var scale = w / h;

                w = opts.width || w;
                h = opts.height || (w / scale);

                var quality = 0.8; // 默认图片质量为0.7

                // 图像质量
                if (opts.quality && opts.quality <= 1 && opts.quality > 0) {
                    quality = opts.quality;
                }

                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute('width');
                anw.nodeValue = w;
                var anh = document.createAttribute('height');
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(img, 0, 0, w, h);

                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', quality);

                // 回调函数返回base64的值
                typeof callback === 'function' && callback(base64);
            };

            img.src = result;
        }
    }

    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *            用url方式表示的base64图片数据
     */
    var convertBase64UrlToBlob = function(urlData) {
        var arr = urlData.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    // 报错提示
    var showError = function() {
        ee.trigger(cmd.SHOW_POP, ['.pop-error']);

        timer = setTimeout(function() {
            ee.trigger(cmd.CLOSE_POP, ['.pop-error']);

            // goToScene(SCENE.THEME, initSwiper);
        }, 2000);
    };

    // 生成图片
    var createPhoto = function() {
        var canvas = document.getElementById('template');

        if (canvas === null) {
            // 显示弹层
            ee.trigger(cmd.SHOW_POP, ['.pop-tips']);

            setTimeout(function() {
                ee.trigger(cmd.CLOSE_POP, ['.pop-tips']);
            }, 2000);

            return;
        }

        ee.trigger(cmd.SHOW_POP, ['.pop-create']);

        var dataURL = canvas.toDataURL('image/jpeg');

        $.ajax({
            url: REQUEST_SAVE,
            type: 'post',
            cache: false,
            data: { 'base64': dataURL },
            dataType: 'json',
            success: function(data) {
                ee.trigger(cmd.CLOSE_POP, ['.pop-create']);

                if (data.error_code == 0) {
                    goToNextScene(function() {
                        $('.wrap .stage-save').find('img').attr('src', data.url);
                    });
                } else {
                    alert(data.error_msg);
                }
            },
            error: function(data) {
                ee.trigger(cmd.CLOSE_POP, ['.pop-create']);

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

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.width);
        var nums = 0;

        for (var i = 0, len = imageData.data.length; i < len; i++) {
            nums += imageData.data[i];
        }

        if (nums > 0) {
            data = canvas.toDataURL('image/png');
        }

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

        ee.trigger(cmd.SHOW_POP, ['.pop-loading']);

        getPhtotData(file, function(url) {
            compoundPhoto();

            ee.trigger(cmd.CLOSE_POP, ['.pop-loading']);

            $('.btn-change').addClass('hide');
            $('.btn-create').removeClass('hide');
        });
    };

    // 合成图片
    var compoundPhoto = function() {
        createSayPhoto();

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
        var rectSayShadow = [0, 0, themeAssets.sayShadow.width, themeAssets.sayShadow.height, 0, 0, shadow.width, themeAssets.sayShadow.height];
        var rectPanel = [0, 0, themeAssets.panel.width, themeAssets.panel.height, 0, 0, themeAssets.panel.width, themeAssets.panel.height];
        var rectAvatar = [0, 0, bodyImg.width, bodyImg.height, 0, 0, bodyImg.width, bodyImg.height];
        var rectSay = [0, 0, themeAssets.say.width, themeAssets.say.height, 0, 0, themeAssets.say.width, themeAssets.say.height];

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
            id: 'sayShadow',
            src: themeAssets.path + themeAssets.sayShadow.file
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
            var sayShadow = new Bitmap(ld.get('sayShadow'), rectSayShadow);
            var say = new Bitmap($('#say')[0], rectSay);
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

            sayShadow.originX = 0.5;
            sayShadow.originY = 0.5;
            sayShadow.x = themeAssets.sayShadow.x + themeAssets.sayShadow.width / 2;
            sayShadow.y = themeAssets.sayShadow.y + themeAssets.sayShadow.height / 2;
            stage.add(sayShadow);

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

            say.originX = 0.5;
            say.originY = 0.5;
            say.x = themeAssets.say.x + themeAssets.say.width / 2;
            say.y = themeAssets.say.y + themeAssets.say.height / 2;
            stage.add(say);

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
        var text = $('.photo-item_word').val();
        var arr = text.split('\n');

        ctx.font = 'bold 30px SourceHanSansCN';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        var txt1 = arr[0];
        var txt2 = typeof arr[1] === 'string' ? arr[1] : '';

        if (txt1.length > 10) {
            txt2 = txt1.substring(10) + txt2;
            txt1 = txt1.substring(0, 10);
        }

        shadow.width = 40 * txt1.length + 132;

        if (txt2.length > 10) {
            txt2 = txt2.substring(0, 10);
        }

        if (txt1.length < txt2.length) {
            shadow.width = 40 * txt2.length + 132;
        }

        if (txt1.length) {
            var x = 0;

            for (var i = 0, len = txt1.length; i < len; i++) {
                ctx.fillText(txt1[i], x, 0, themeAssets.say.width);

                x += 40;
            }
        }

        if (txt2.length) {
            var x = 0;

            for (var i = 0, len = txt2.length; i < len; i++) {
                ctx.fillText(txt2[i], x, 40, themeAssets.say.width);

                x += 40;
            }
        }

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
                        jsApiList: [
                            'updateAppMessageShareData',
                            'updateTimelineShareData',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage'
                        ] // 必填，需要使用的JS接口列表
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

    // 获取所有人海报照片
    var getAllImgs = function() {
        $.ajax({
            url: REQUEST_PAGE,
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {
                    var arr = [];
                    var len = data.photos.length;

                    for (var i = 0; i < len; i++) {
                        var item = data.photos[i];
                        var imgArr = item.image.split('.');
                        var str = '<div class="wall-item" data-index="' + i + '" data-pid="' + item.id + '" data-uid="' + item.uid + '">';
                        str += '<div><img src="' + imgArr[0] + '_thumb.' + imgArr[1] + '" /></div>';
                        str += '<dl><dt><img src="' + item.headimg + '" /><span>' + item.nickname + '</span></dt>';

                        if (item.already_love) {
                            str += '<dd><a href="javascript:;"><i class="icons icon-love"></i>';
                        } else {
                            str += '<dd><a class="btn-vote_wall" href="javascript:;" data-index="' + i + '" data-pid="' + item.id + '"><i class="icons icon-unlove"></i>';
                        }

                        str += '<span class="wall-item_tickets">' + item.tickets + '</span>票</a></dd></dl></div>';

                        arr.push(str);
                    }

                    if (len % 2 === 1) {
                        arr.push('<div class="wall-item_empty"></div>');
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

    // 获取个人海报照片
    var getMyImgs = function() {
        $.ajax({
            url: REQUEST_PHOTO,
            type: 'post',
            cache: false,
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {
                    initPlaybillSwiper(data.photos);
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
                    $('#agreement').prop('checked', data.is_agree);
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
    var initShare = function(pid, nickname) {
        var title = '暗夜精灵泳衣, 带你C位出道';
        var link = 'http://nabaiji.yuncoupons.com';
        var desc = '1秒拍最美泳装照, Show出魅力姿态, 赢迪卡侬大奖';
        var imgUrl = 'http://nabaiji.yuncoupons.com/share.png';

        if (!!pid) {
            title = nickname + '的最美泳姿照已上线，快投票助她C位出道！';
            link = 'http://nabaiji.yuncoupons.com/vote.php?pid=' + pid + '&nickname=' + nickname;
        }

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
            });

            // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃），兼容老版本微信
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function() {
                    // 设置成功
                    console.log('自定义“分享到朋友圈”按钮的分享内容设置成功');
                }
            });

            // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃），兼容老版本微信
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    // 设置成功
                    console.log('自定义“分享给朋友”按钮的分享内容设置成功');
                }
            });
        });
    };

    // 播放轮播
    var playBanner = function() {
        var index = 0;

        timer = setInterval(function() {
            index++;

            index = index % 2;

            $('.rule-banner img').removeClass('active').eq(index).addClass('active');
            $('.rule-banner li').removeClass('active').eq(index).addClass('active');
        }, 2000);
    };

    // 停止轮播
    var stopBanner = function() {
        clearInterval(timer);
    };

    // 复制
    var copy = function() {
        if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) { //区分iPhone设备  
            var input = document.createElement('input');
            input.setAttribute('readonly', 'readonly');
            input.setAttribute('value', '￥HEEtYda3F15￥');
            document.body.appendChild(input);
            input.setSelectionRange(0, 9999);

            if (document.execCommand('copy')) {
                document.execCommand('copy');

                // 显示弹层
                ee.trigger(cmd.SHOW_POP, ['.pop-copy']);

                timer = setTimeout(function() {
                    ee.trigger(cmd.CLOSE_POP, ['.pop-copy']);
                }, 2000);

                console.log('复制成功');
            }

            document.body.removeChild(input);
        } else {
            var save = function(e) {
                e.clipboardData.setData('text/plain', '￥vkcQYgDKHQD￥');
                e.preventDefault();

                // 显示弹层
                ee.trigger(cmd.SHOW_POP, ['.pop-copy']);

                timer = setTimeout(function() {
                    ee.trigger(cmd.CLOSE_POP, ['.pop-copy']);
                }, 2000);

                console.log('复制成功');
            }

            document.addEventListener('copy', save);
            document.execCommand('copy');
            document.removeEventListener('copy', save);
        }
    };

    // 投票
    var votePhoto = function(pid, index) {
        if (pid === null) {
            alert("投票失败,请刷新重试!");

            return;
        }

        $.ajax({
            url: REQUEST_LOVE,
            type: 'post',
            cache: false,
            data: {
                id: pid
            },
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {
                    var elem = $('.wall-item').eq(index);

                    elem.find('.btn-vote_wall').removeClass('btn-vote_wall');
                    elem.find('.icon-unlove').removeClass('icon-unlove').addClass('icon-love');
                    elem.find('.wall-item_tickets').html(data.tickets);

                    console.log(data);
                } else {
                    alert(data.error_msg);
                }
            },
            error: function(data) {
                alert("投票失败,请刷新重试!");
            }
        });
    };

    // 保存记录
    var saveInfo = function() {
        var pid = $('.stage-playbill .swiper-slide-active').attr('data-pid');
        var username = $('#username').val();
        var mobile = $('#mobile').val();
        var address = $('#address').val();
        var channel = $('input[name="channel"]:checked').val();

        username = username.replace(/\s/g, '');

        if (username === '') {
            alert('请输入姓名');

            return;
        }

        mobile = mobile.replace(/\s/g, '');

        if (mobile === '') {
            alert('请输入手机号码');

            return;
        }

        address = address.replace(/\s/g, '');

        if (address === '') {
            alert('请输入地址');

            return;
        }

        if (channel === '门店') {
            channel += '-' + storeAddress.province + '-' + storeAddress.city + '-' + $('#storename').val();
        }

        $.ajax({
            url: REQUEST_INFO,
            type: 'post',
            cache: false,
            data: {
                id: pid,
                name: username,
                phone: mobile,
                address: address,
                channel: channel
            },
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {
                    alert('提交成功');

                    console.log(data);
                } else {
                    alert(data.error_msg);
                }
            },
            error: function(data) {
                alert('提交失败，请刷新重试!');
            },
            complete: function() {
                ee.trigger(cmd.CLOSE_POP, ['.pop-form']);
            }
        });

        console.log(username, mobile, address, channel);
    };

    // 初始化省份下拉
    var initProvinceSelect = function() {
        var str = '';
        
        for (var i = 0, len = provinceList.length; i < len; i++) {
            str += '<option value="' + provinceList[i] + '">' + provinceList[i] + '</option>';
        }

        $('#province').find('select').html(str).find('option').eq(0).prop('selected', true);

        $('#province').find('span').html(provinceList[0]);

        storeAddress.province = provinceList[0];
    };

    // 初始化城市下拉
    var initCitySelect = function() {
        var province = provinceList[0];
        var arr = cityList[province];
        var str = '';
        
        for (var i = 0, len = arr.length; i < len; i++) {
            str += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
        }

        $('#city').find('select').html(str).find('option').eq(0).prop('selected', true);

        $('#city').find('span').html(arr[0]);

        storeAddress.city = arr[0];
    };

    // 初始化事件
    var initEvent = function() {
        // 弹层 - 协议状态
        $(document).on('change', '#agreement', function(evt) {
            var isChecked = $(this).prop('checked');

            setAgreeStatus(isChecked);
        });

        // 关闭协议
        $(document).on('click', '.pop-rule .btn-pop_close', function(evt) {
            stopBanner();
        });

        // 关闭报错
        $(document).on('click', '.pop-error', function(evt) {
            clearTimeout(timer);

            goToScene(SCENE.THEME, initSwiper);
        });

        // 输入框
        $(document).on('focus', '.photo-item_word', function(evt) {
            $('.photo-item_cursor').hide();
        })

        // 场景 - 首页
        $(document).on('click', '.btn-start', function() {
            // 是否初次
            var isNewer = localStorage.getItem('isNewer');

            if (isNewer === null || isNewer !== '0') {
                localStorage.setItem('isNewer', 0);

                // 显示弹层
                ee.trigger(cmd.SHOW_POP, ['.pop-rule']);

                playBanner();
            } else {
                goToNextScene(initSwiper);
            }
        });

        $(document).on('click', '.btn-pop_start', function() {
            // 隐藏弹层
            ee.trigger(cmd.CLOSE_POP, ['.pop-rule']);

            goToScene(SCENE.THEME, initSwiper);
        });

        // 购买泳装
        $(document).on('click', '.btn-buy', function(evt) {
            evt.preventDefault();

            // 显示弹层
            // ee.trigger(cmd.SHOW_POP, ['.pop-buy']);

            ee.trigger(cmd.SHOW_POP, ['.pop-tmall']);
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

            playBanner();
        });

        // 照片墙
        $(document).on('click', 'a.btn-photoWall, a.btn-photoWall_disable', function() {
            initShare();

            goToScene(SCENE.WALL, getAllImgs);
        });

        // 个人海报
        $(document).on('click', 'a.btn-playbill, a.btn-playbill_disable', function() {
            goToScene(SCENE.PLAYBILL, getMyImgs);
        });

        // 再玩一次
        $(document).on('click', '.btn-restart, .btn-change', function() {
            goToScene(SCENE.THEME, initSwiper);
        });

        // 首页
        $(document).on('click', '.btn-home', function() {
            initShare();

            goToScene(SCENE.LANDING);
        });

        // 海报
        $(document).on('click', '.wall-item', function() {
            var index = $(this).attr('data-index');
        });

        // 场景 - 确定场景
        $(document).on('click', '.btn-confirm, .theme-item', function(evt) {
            evt.preventDefault();

            updateThemeAssets();

            goToNextScene(function() {
                createTemplate();

                createGuide();
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

        // 按钮 - 一键复制
        $(document).on('click', '.btn-pop_copy', function() {
            copy();
        });

        if (document.execCommand('copy')) {
            $('.btn-pop_copy').addClass('hide');
        }

        // 按钮 - 上一个口号
        $(document).on('click', '.btn-slogan_prev', function() {
            var index = info.sloganType;

            index--;

            if (index < 0) {
                index = 2;
            }

            var str = slogaData[index].word;
            $('.photo-item_word').val(str);

            $('.photo-item_cursor').removeClass('sandbeach1')
                .removeClass('sandbeach2')
                .removeClass('pool1')
                .removeClass('pool2')
                .removeClass('underwater1')
                .removeClass('underwater2')
                .addClass(slogaData[index].class);

            info.sloganType = index;
            info.word = str;

            console.log(info);
        });

        // 按钮 - 下一个口号
        $(document).on('click', '.btn-slogan_next', function() {
            var index = info.sloganType;

            index++;

            if (index > 2) {
                index = 0;
            }

            var str = slogaData[index].word;
            $('.photo-item_word').val(str);

            $('.photo-item_cursor').removeClass('sandbeach1')
                .removeClass('sandbeach2')
                .removeClass('pool1')
                .removeClass('pool2')
                .removeClass('underwater1')
                .removeClass('underwater2')
                .addClass(slogaData[index].class);

            info.sloganType = index;
            info.word = str;

            console.log(info);
        });

        // 按钮 - 知道了
        $(document).on('click', '.btn-pass', function(evt) {
            var index = $(this).attr('data-index');

            console.log(index, typeof index);

            if (index === '0') {
                if (!isGuide) {
                    isGuide = true;

                    $('.pop-guide_photo').addClass('hide');
                    $('.pop-guide_slogan').removeClass('hide');
                } else {
                    ee.trigger(cmd.CLOSE_POP, ['.pop-guide']);
                }
            } else if (index === '1') {
                ee.trigger(cmd.CLOSE_POP, ['.pop-guide']);
            }
        });

        // 投票
        $(document).on('click', '.btn-vote_wall', function(evt) {
            var pid = $(this).attr('data-pid');
            var index = Number($(this).attr('data-index'));

            votePhoto(pid, index);
        });

        // 领取大奖
        $(document).on('click', '.btn-get', function(evt) {
            ee.trigger(cmd.SHOW_POP, ['.pop-form']);
        });

        // 选择渠道
        $(document).on('change', 'input[name="channel"]:checked', function(evt) {
            if($(this).val() !== '门店') {
                $('.store-detail').addClass('hide');
            } else {
                $('.store-detail').removeClass('hide');
            }
        });

        // 省份
        $(document).on('change', '#province select', function(evt) {
            var province = $(this).val();

            $('#province').find('span').html(province);

            storeAddress.province = province;

            var str = '';
            var arr = cityList[province];
        
            for (var i = 0, len = arr.length; i < len; i++) {
                str += '<option value="' + arr[i] + '">' + arr[i] + '</option>';
            }

            $('#city').find('select').html(str).find('option').eq(0).prop('selected', true);

            $('#city').find('span').html(arr[0]);

            storeAddress.city = arr[0];

            $('#storename').val('');
        });

        // 城市
        $(document).on('change', '#city select', function(evt) {
            var city = $(this).val();

            $('#city').find('span').html(city);

            storeAddress.city = city;

            $('#storename').val('');
        });

        // 提交信息
        $(document).on('click', '.btn-pop_confirm', function(evt) {
            saveInfo();
        });
    };

    // 初始化
    var init = function() {
        initEvent();

        initProvinceSelect();

        initCitySelect();

        getShareInfo();

        getAgreeStatus();

        // 预加载资源图片
        $(document).ready(preloadAssets);
    };

    init();
})();