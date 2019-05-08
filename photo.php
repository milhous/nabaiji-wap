<?php
	header('Content-type: text/html; charset=UTF-8');
	
	include_once 'interface/common.php';

	session_start();

	if(!empty($_GET) && isset($_GET['openid'])){
		$wxinfo = $_GET;
		$_SESSION['nabaiji_wx'] = $wxinfo;

		saveInfo($wxinfo);
	}else if($_SESSION['nabaiji_wx']){
		$wxinfo = $_SESSION['nabaiji_wx'];

		saveInfo($wxinfo);
	}else{
		header("Location:"."http://kipsta.yuncii.com/worldcup/wechat_author.php?scope=snsapi_base&redirect_uri=http://nabaiji.yuncoupons.com/index.php");
		exit();
	}

	$str = "jsapi_ticket=kgt8ON7yVITDhtdwci0qeY9owq9VMNTb8r3pze3zvtGKUnUW3HiTXMSjpQ3q9Bzm5WqkzzSa9a_9b5uHQLkD1w&noncestr=kc8gilNUArkV0FhF1cwh1DvltnPhnIo8&timestamp=1557028353&url=http://nabaiji.yuncoupons.com/index.php";

	function saveInfo($info){
		$pdo = getPDO();

		$sql = "SELECT id FROM user_info WHERE openid = :openid";
		$stmt = $pdo->prepare($sql);
		$stmt->bindParam(":openid", $info['openid']);
		$stmt->execute();
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

		if(empty($row)){
			$sql = "INSERT INTO user_info 
						(`openid`, `nickname`, `sex`, `city`, `province`, `country`, `language`, `headimgurl`, `insert_time`, `last_time`) 
					VALUES 
						(:openid, :nickname, :sex, :city, :province, :country, :language, :headimgurl, :now, :now)";
			$stmt = $pdo->prepare($sql);
			$stmt->bindParam(":openid", $info['openid']);
			$stmt->bindParam(":nickname", $info['nickname']);
			$stmt->bindParam(":sex", $info['sex']);
			$stmt->bindParam(":city", $info['city']);
			$stmt->bindParam(":province", $info['province']);
			$stmt->bindParam(":country", $info['country']);
			$stmt->bindParam(":language", $info['language']);
			$stmt->bindParam(":headimgurl", $info['headimgurl']);
			$stmt->bindParam(":now", $now);
			$now = date('Y-m-d H:i:s');
			$stmt->execute();
		}else{
			$sql = "UPDATE user_info SET nickname = :nickname, sex = :sex, city = :city, province = :province, country = :country, language = :language, 
						headimgurl = :headimgurl, last_time = :now WHERE openid = :openid";
			$stmt = $pdo->prepare($sql);
			$stmt->bindParam(":openid", $info['openid']);
			$stmt->bindParam(":nickname", $info['nickname']);
			$stmt->bindParam(":sex", $info['sex']);
			$stmt->bindParam(":city", $info['city']);
			$stmt->bindParam(":province", $info['province']);
			$stmt->bindParam(":country", $info['country']);
			$stmt->bindParam(":language", $info['language']);
			$stmt->bindParam(":headimgurl", $info['headimgurl']);
			$stmt->bindParam(":now", $now);
			$now = date('Y-m-d H:i:s');
			$stmt->execute();
		}

		$stmt = null;
		$pdo = null;
	}
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8' />
    <title>晒出最美泳姿 赢迪卡侬大奖</title>
    <meta name='viewport' content='width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no' />
    <meta name='apple-mobile-web-app-capable' content='yes' />
    <meta name='full-screen' content='true' />
    <meta name='screen-orientation' content='portrait' />
    <meta name='x5-fullscreen' content='true' />
    <meta name='360-fullscreen' content='true' />
    <meta http-equiv='expires' content='0' />
    <link rel="stylesheet" href="css/libs/normalize.css" />
    <link rel="stylesheet" href="css/plugins/swiper.min.css" />
    <link rel="stylesheet" href="css/public/common.css" />
    <link rel="stylesheet" href="css/views/index.css" />
    <script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
    <script src="js/libs/zepto.min.js"></script>
    <script src="js/plugins/flexible.js"></script>
    <script src="js/plugins/swiper.min.js"></script>
    <script src="js/plugins/EventEmitter.min.js"></script>
    <script src="js/plugins/polyfill.min.js"></script>
    <script src="js/plugins/alloy_paper.js"></script>
    <script src="js/plugins/alloy_finger.js"></script>
    <script src="js/plugins/exif.js"></script>
</head>

<body>
    <div class="wrap">
        <div class="scene-flipper">
            <div class="scene-flipper_front">
                <section class="stage stage-landing flex flex-direction_column flex-justify_between flex-align_center">
                    <a class="btns btn-photoWall" href="javascript:;">照片墙</a>
                    <h2 class="words word-landing_title">晒出最美泳姿 赢迪卡侬大奖</h2>
                    <ul class="flex flex-justify_center flex-align_center">
                        <li><a class="btns btn-start" href="javascript:;">晒照赢奖</a></li>
                        <li><a class="btns btn-buy" href="javascript:;">购买泳衣</a></li>
                    </ul>
                    <a class="btns btn-rule translate_centerX" href="javascript:;">活动规则</a>
                </section>
            </div>
            <div class="scene-flipper_back">
                <!-- js create element -->
            </div>
        </div>
    </div>
    <ul class="stage-list">
        <li>
            <section class="stage stage-landing flex flex-direction_column flex-justify_between flex-align_center">
                <a class="btns btn-photoWall" href="javascript:;">照片墙</a>
                <h2 class="words word-landing_title">晒出最美泳姿 赢迪卡侬大奖</h2>
                <ul class="flex flex-justify_center flex-align_center">
                    <li><a class="btns btn-start" href="javascript:;">晒照赢奖</a></li>
                    <li><a class="btns btn-buy" href="javascript:;">购买泳衣</a></li>
                </ul>
                <a class="btns btn-rule translate_centerX" href="javascript:;">活动规则</a>
            </section>
        </li>
        <li>
            <section class="stage stage-theme flex flex-direction_column flex-justify_between flex-align_center">
                <h2 class="words word-theme_title">选择一个你最想去的场景</h2>
                <div class="theme-swiper">
                    <ul class="theme-list">
                        <li class="theme-sandbeach theme-ani">
                            <div>
                                <img src="images/theme-sandbeach1_pic.jpg" />
                            </div>
                        </li>
                        <li class="theme-sandbeach">
                            <div>
                                <img src="images/theme-sandbeach2_pic.jpg" />
                            </div>
                        </li>
                        <li class="theme-pool">
                            <div>
                                <img src="images/theme-pool1_pic.jpg" />
                            </div>
                        </li>
                        <li class="theme-pool">
                            <div>
                                <img src="images/theme-pool2_pic.jpg" />
                            </div>
                        </li>
                        <li class="theme-underwater">
                            <div>
                                <img src="images/theme-underwater1_pic.jpg" />
                            </div>
                        </li>
                        <li class="theme-underwater">
                            <div>
                                <img src="images/theme-underwater2_pic.jpg" />
                            </div>
                        </li>
                    </ul>
                    <ul class="theme-dot flex flex-justify_center flex-align_center">
                        <li class="theme-ani"></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <div class="theme-panel">
                    <div class="swiper-container">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide"></div>
                            <div class="swiper-slide"></div>
                            <div class="swiper-slide"></div>
                            <div class="swiper-slide"></div>
                            <div class="swiper-slide"></div>
                            <div class="swiper-slide"></div>
                        </div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                    </div>
                </div>
                <a class="theme-btn btn-confirm" href="javascript:;">
                    <span class="words word-theme_sandbeach theme-ani"></span>
                    <span class="words word-theme_sandbeach"></span>
                    <span class="words word-theme_pool"></span>
                    <span class="words word-theme_pool"></span>
                    <span class="words word-theme_underwater"></span>
                    <span class="words word-theme_underwater"></span>
                </a>
            </section>
        </li>
        <li>
            <section class="stage stage-photo flex flex-direction_column flex-justify_center flex-align_center">
                <div class="photo-container">
                    <div class="photo-canvas"><!-- js create elem --></div>
                    <div class="photo-template"><!-- js create elem --></div>
                </div>
                <ul class="photo-btn flex flex-justify_center flex-align_center">
                    <li><div class="btns btn-submit">上传泳照<input id="photograph" type="file" accept="image/*"></div></li>
                    <li><a class="btns btn-create" href="javascript:;">生成海报</a></li>
                </ul>
            </section>
        </li>
        <li>
            <section class="stage stage-save flex flex-direction_column flex-justify_center flex-align_center">
                <a class="btns btn-photoWall" href="javascript:;">照片墙</a>
                <a class="btns btn-restart" href="javascript:;">再玩一次</a>
                <div>
                    <img src="">
                </div>
                <span class="words word-save_title translate_centerX">长按保存图片 晒出你的美</span>
            </section>
        </li>
        <li>
            <section class="stage stage-wall">
                <span class="words word-wall_title">照片墙个人海报</span>
                <a class="btns btn-home" href="javascript:;">首页</a>
                <div class="wall-list flex flex-wrap_wrap flex-justify_center"><!-- js create elem --></div>
            </section>
        </li>
        <li>
            <section class="stage stage-playbill flex flex-direction_column flex-justify_center flex-align_center">
                <a class="btns btn-photoWall" href="javascript:;">照片墙</a>
                <div class="swiper-container">
                    <div class="swiper-wrapper"><!-- js create elem --></div>
                </div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
                <span class="words word-playbill_title translate_centerX">7月15日将开启投票通道点赞前六名可获得迪卡侬大奖</span>
            </section>
        </li>
    </ul>
    <img id="say" src="" />
    <img id="avatar" src="" />
    <div class="pop">
        <section class="pop-buy">
            <div class="pop-buy_box flex flex-direction_column flex-justify_center flex-align_center">
                <div></div>
                <ul class="flex flex-justify_center flex-align_center">
                    <li><a class="btns btn-decathlon" href="javascript:;">迪卡侬官网</a></li>
                    <li><a class="btns btn-tmall" href="javascript:;">天猫商城</a></li>
                </ul>
            </div>
            <a class="btns btn-close btn-pop_close" href="javascript:;" title="关闭" data-close=".pop-buy">关闭</a>
        </section>
        <section class="pop-tmall">
            <div class="pop-tmall_box flex flex-direction_column flex-justify_center flex-align_center">
                <div></div>
                <div>
                    <h3 class="words word-tmall_title">复制淘口令，打开天猫</h3>
                    <p>復|制这段描述￥o5VaY0wrOCD￥后到☞淘♂寳♀☜</p>
                </div>
            </div>
            <a class="btns btn-close btn-pop_close" href="javascript:;" title="关闭" data-close=".pop-tmall">关闭</a>
        </section>
        <section class="pop-rule">
            <div class="pop-rule_box">
                <h2>活动规则</h2>
                <h3 class="flex flex-justify_center flex-align_center"><i class="icons icon-time"></i><span>活动时间</span></h3>
                <p>5月10日—7月31日期间，活动分为2个阶段。</p>
                <h3 class="flex flex-justify_center flex-align_center"><i class="icons icon-time"></i><span>参与方式</span></h3>
                <dl>
                    <dt>第一阶段（5.10-7.14）【晒照互动】：</dt>
                    <dd>1.上传穿着迪卡侬暗夜精灵泳衣的照片，选择心仪模板，可生成个性泳装海报，保存海报即可晒出。</dd>
                    <dd><span>（*特别说明：穿着其他服装也可参与晒图互动，但不具备后期领奖资格）</span></dd>
                </dl>
                <dl>
                    <dt>第二阶段（7.15-7.31）【投票开启】：</dt>
                    <dd>1.点击首页“照片墙”，进入个人海报页并分享该页面链接，即可邀请好友点赞投票。</dd>
                    <dd>2.截至北京时间2019年7月31日24时止，点赞排名前6位的用户，可获得迪卡侬送出的相应奖品。</dd>
                    <dd><span>（*每个微信ID仅可中奖1次，本次活动仅限中国大陆地区消</span></dd>
                </dl>
                <p>
                    <input type="checkbox" id="agreement" name="agreement" />
                    <label class="flex flex-justify_center flex-align_center" for="agreement"><i class="icons"></i><span>同意迪卡侬使用上传照片用于商业宣传 (如同意请勾选)</span></label>
                </p>
                <h3 class="flex flex-justify_center flex-align_center"><i class="icons icon-prize"></i><span>活动奖品设置</span></h3>
                <p>一等奖：第1名</p>
                <p>价值5000元SEAISEE水下魅力写真拍摄一组</p>
                <div class="rule-banner">
                    <img class="active" src="images/pic-prize1_banner2.jpg" alt="一等奖：价值5000元SEAISEE水下魅力写真拍摄一组" />
                    <img src="images/pic-prize1_banner1.jpg" alt="一等奖：价值5000元SEAISEE水下魅力写真拍摄一组" />
                    <ul class="flex flex-justify_center flex-align_center">
                        <li class="active"></li>
                        <li></li>
                    </ul>
                </div>
                <input type="checkbox" id="rule-more1" name="rule-more1">
                <div class="prize-notice flex flex-direction_column flex-justify_center flex-align_center">
                    <label for="rule-more1">点击了解更多</label>
                    <h4>水下写真拍摄须知：</h4>
                    <p>1.<strong>拍摄地点：</strong>SEAISEE潜水中心（上海店）</p>
                    <p>2.<strong>使用时间：</strong>截止2019年8月15日止, 具体拍摄时间由获奖用户与迪卡侬官方协商决定。</p>
                    <p>3.获奖者为上海地区居民，选择迪卡侬指定交通方式, 则个人往返费用由迪卡侬承担。若获奖者为上海地区外居民, 选择迪卡侬指定交通及住宿方式，则个人往返费用及住宿费用（一晚）由迪卡侬承担。</p>
                    <p>4.拍摄时须潜入水中, 获奖者需熟悉水性, 并确认无影响安全的身心疾病, 拍摄前请在家自行练习水中睁眼能力。</p>
                    <p>5.拍摄共计三套服装，包含一件暗夜精灵系列泳衣及两套可选择的拍摄现场服装道具,  自备服装可提前</p>
                </div>
                <p>二等奖：第2-3名</p>
                <p>价值2000 元专业游泳教程一套，共计两名。</p>
                <div class="rule-pic"><img src="images/pic-prize2.jpg" alt="二等奖：价值2000 元专业游泳教程一套，共计两名。" /></div>
                <input type="checkbox" id="rule-more2" name="rule-more2">
                <div class="prize-notice flex flex-direction_column flex-justify_center flex-align_center">
                    <label for="rule-more2">点击了解更多</label>
                    <h4>游泳教程须知：</h4>
                    <p>1.获奖者自行报名游泳课程后联系迪卡侬官方出示由泳教机构开立的报课证明或游泳装备购买证明, 迪卡侬根据证明赞助总计2000元的学习费用。</p>
                    <p>2.兑换期限截止2019年11月30日, 逾期作废。</p>
                </div>
                <p>三等奖：第4-6名</p>
                <p>价值 1000元迪卡侬清凉一夏礼品卡一张，共计三名。</p>
                <div class="rule-pic"><img src="images/pic-prize3.jpg" alt="价值 1000元迪卡侬清凉一夏礼品卡一张，共计三名。" /></div>
                <h3 class="flex flex-justify_center flex-align_center"><i class="icons icon-notice"></i><span>获奖须知</span></h3>
                <ul>
                    <li>1、中奖中户需如实填写信息，如信息填写错误或在3个工作日内未填写，则视为自动放弃。</li>
                    <li>2、第1-3名中奖用户，迪卡侬将在收到信息后的10个工作日内与您联系领奖。</li>
                    <li>3、第4-6名中奖用户，迪卡侬将在收到正确收货信息后的10个工作日内为您寄出礼品。</li>
                </ul>
            </div>
            <a class="btns btn-close btn-pop_close" href="javascript:;" title="关闭" data-close=".pop-rule">关闭</a>
        </section>
    </div>
    <script src="js/public/common.js"></script>
    <script src="js/views/index.js"></script>

</html>

</html>