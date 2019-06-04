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
    <link rel="stylesheet" href="http://cdn.nabaiji.yuncoupons.com/css/libs/normalize.css" />
    <link rel="stylesheet" href="http://cdn.nabaiji.yuncoupons.com/css/plugins/swiper.min.css" />
    <link rel="stylesheet" href="css/public/common.css?v=1.0.0" />
    <link rel="stylesheet" href="css/views/vote.css" />
    <script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js"></script>
    <script src="http://cdn.nabaiji.yuncoupons.com/js/libs/zepto.min.js"></script>
    <script src="http://cdn.nabaiji.yuncoupons.com/js/plugins/flexible.js"></script>
    <script src="http://cdn.nabaiji.yuncoupons.com/js/plugins/EventEmitter.min.js"></script>
    <script src="http://cdn.nabaiji.yuncoupons.com/js/plugins/polyfill.min.js"></script>
</head>

<body>
    <div class="wrap">
        <section class="stage stage-vote flex flex-direction_column flex-justify_center flex-align_center">
            <dl class="vote-candidate flex flex-align_center">
                <dt class="vote-candidate_avatar"><!-- js create element --></dt>
                <dd class="vote-candidate_name"><!-- js create element --></dd>
            </dl>
            <div class="vote-playbill"><!-- js create element --></div>
            <ul class="vote-info flex flex-justify_center flex-align_center">
                <li class="vote-btn"><!-- js create element --></li>
                <li class="vote-rank"><!-- js create element --></li>
            </ul>
            <a class="btns btn-find" href="javascript:;" title="发现你的美">发现你的美</a>
        </section>
    </div>
    <script src="js/public/common.js"></script>
    <script src="js/views/vote.js?v=1.0.0"></script>
</body>

</html>