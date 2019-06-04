(function() {
    // 获取照片信息
    var REQUEST_PHOTO = 'http://nabaiji.yuncoupons.com/interface/get_photo.php';
    // 投票
    var REQUEST_LOVE = 'http://nabaiji.yuncoupons.com/interface/love_pic.php';

    // cdn
    var cdn = 'http://cdn.nabaiji.yuncoupons.com/';

    // 元素
    var $elem = {
        wrap: $('.wrap')
    };

    // 合成图片文字阴影
    var shadow = {
        width: 0,
        height: 0
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

    //预加载
    var preloadAssets = function() {
        // 预加载图片资源
        var assets = {
            'path': 'images/',
            'file': [
                'bg-vote.jpg'
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

                getPhoto();
            }
        };

        for (var i = 0; i < len; i++) {
            var img = new Image();
            img.onload = loadAssets;
            img.onerror = loadAssets;
            img.src = assets.path + assets.file[i];
        }
    };

    /*
     * 获取url参数值
     * @param {string} name 参数名称
     */ 
    var getQueryString = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);

        if (r != null) {
            return unescape(r[2]);
        };

        return null;
    };

    // 获取个人海报照片
    var getPhoto = function() {
        var pid = getQueryString('pid');

        if (pid === null) {
            alert("获取失败,请刷新重试!");

            return;
        }

        $.ajax({
            url: REQUEST_PHOTO,
            type: 'post',
            cache: false,
            data: {
                photo_id: pid
            },
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {
                    update(data.photo);

                    console.log(data);
                } else {
                    alert(data.error_msg);
                }
            },
            error: function(data) {
                alert("获取失败,请刷新重试!");
            }
        });
    };

    // 投票
    var votePhoto = function() {
        var pid = getQueryString('pid');

        if (pid === null) {
            alert("投票失败,请刷新重试!");

            return;
        }

        $.ajax({
            url: REQUEST_LOVE,
            type: 'post',
            cache: false,
            data: {
                photo_id: 'aadada'
            },
            dataType: 'json',
            success: function(data) {
                if (data.error_code == 0) {
                    update(data.photo);

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

    // 更新
    var update = function(data) {
        $('.vote-candidate_avatar').html('<img src="' + data.headimg + '" alt="' + data.nickname + '" />');
        $('.vote-candidate_name').html(data.nickname);
        $('.vote-playbill').html('<img src="' + cdn + data.image + '" alt="' + data.nickname + '" />');

        $('.vote-btn').html('<span class="words word-vote_tips">为她投上一票吧！</span><a class="btns btn-vote" href="javascript:;" title="为她投上一票吧！">为她投上一票吧！</a>' + data.tickets + ' 票');
        $('.vote-rank').html('当前排名 ' + data.rank);
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
        // 投票
        $(document).on('click', '.btn-vote', function(evt) {
            votePhoto();
        });

        // 发现
        $(document).on('click', '.btn-find', function(evt) {
            location.href = 'http://nabaiji.yuncoupons.com';
        });
    };

    // 初始化
    var init = function() {
        initEvent();

        // 预加载资源图片
        $(document).ready(preloadAssets);
    };

    init();
})();