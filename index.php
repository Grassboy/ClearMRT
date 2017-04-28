<?
    include('config/config.inc.php')
?>
<!DOCTYPE HTML>
<html>
<head>
    <link rel="manifest" href="manifest.json?v=2">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=1">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-url" content="clickmrt">
	<meta name="description" content="<?=$_description?>" />
	<meta property="og:title" content="<?=$_title?>" />
	<meta property="og:url" content="<?=$_url?>" />
	<meta property="og:image" content="<?=$_thumb?>" />
	<meta property="og:site_name" content="<?=$_title?>" />
	<meta property="og:description" content="<?=$_description?>" />
    <meta property="fb:admins" content="<?=$_fb_admin_id?>" />
	<link rel="shortcut icon" href="images/favicon.png" />
    <!-- metro by Dominique Vicent from the Noun Project -->
    <!-- for dev
	<link href="http://grassboy.tw:24680/stylesheets/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />
	<script src="http://grassboy.tw:35729/livereload.js" type="text/javascript"></script>
    -->
	<link href="stylesheets/screen.css?v=2" media="screen, projection" rel="stylesheet" type="text/css" />
	<link href="fonts/style.css" media="screen, projection" rel="stylesheet" type="text/css" />
	<script src="javascript/jquery.js" type="text/javascript"></script>
	<script src="javascript/jquery.history.js" type="text/javascript"></script>
	<title><?=$_title?></title>
</head>
<body>
<div class="container initializing">
    <div class="page" id="page-main">
        <header class="header">
            <div class="btn-icon btn-setting btn-easycard"></div>
            <h1 class="header-text"><em>ClickMRT</em><span class="search-text"></span></h1>
            <div class="btn-icon btn-speech"></div>
            <div class="btn-icon btn-search"></div>
            <form role="search" action="index.php" action="get">
                <div class="query-input">
                    <input type="text" name="station-from" class="station station-from" placeholder="出發站" readonly="readonly"><div
                    class="btn-icon btn-exchange"><label>對調</label>
                    </div><input type="text" name="station-to" class="station station-to" placeholder="其他各站" readonly="readonly">
                </div>
                <input type="submit" id="btn-query-submit" />
            </form>
        </header>
        <aside class="aside-suggest">
            <ul class="suggest-stations">
                <li class="line1 line2">
                    <label>大安</label>
                </li>
                <li class="line1 line3">
                    <label>南京復興</label>
                </li>
                <li class="line1 line5">
                    <label>忠孝復興</label>
                </li>
                <li class="line3 line2">
                    <label>中正紀念堂</label>
                </li>
                <li class="line4 line2">
                    <label>民權西路</label>
                </li>
                <li class="line5 line2">
                    <label>台北車站</label>
                </li>
                <li class="line3 line4">
                    <label>松江南京</label>
                </li>
                <li class="line3 line5">
                    <label>西門</label>
                </li>
                <li class="line4 line5">
                    <label>忠孝新生</label>
                </li>
            </ul>
        </aside>
        <aside class="station-select-map">
            <img src="http://web.metro.taipei/img/all/routemap2017.jpg" />
        </aside>
        <article class="init-tips">
            <section class="tips1">
                更改票種
            </section>
            <section class="tips2">
                開始查詢
            </section>
            <section class="tips3">
                點選捷運地圖，選擇附近的捷運站<br />
            </section>
        </article>
        <article class="query-result">
            <section class="station-countdown">
                <h3 class="result-title"><em class="line1"><label>台北車站</label></em> 列車進站時間</h3>
                <ul class="countdown-lines">
                    <li class="countdown-br"></li>
                    <li class="countdown-r"></li>
                    <li class="countdown-g"></li>
                    <li class="countdown-o"></li>
                    <li class="countdown-bl"></li>
                </ul>
            </section>
            <section class="station-info">
                <h3 class="result-title"><em class="line1"><label>台北車站</label></em> 首末班車資訊</h3>
                <img src="" />
            </section>
            <section class="time-and-price-result">
                <div class="route-between-result">
                    <h3 class="result-title"><em class="line1"><label>台北車站</label></em> 到 <em class="line1"><label>南港展覽館</label></em></h3>
                    <div class="time"><label>乘車時間</label><em>25</em></div>
                    <div class="price"><label>悠遊卡票價</label><em>25</em></div>
                    <div class="routing-tips">
                        <label>建議乘車路線</label>
                        <p>木柵站搭乘1號文湖線（往南港展覽館）=> 中山國中站</p>
                    </div>
                </div>
                <div class="route-all-result">
                    <h3 class="result-title"><em class="line1"><label>台北車站</label></em> 到其他各站相關資訊</h3>
                    <ul class="route-pages-tab">
                        <li data-line="all" class="route-all"><label>全線</label></li>
                        <li data-line="line1" class="route-line1"><label>文湖線</label></li>
                        <li data-line="line2" class="route-line2"><label>淡水線</label></li>
                        <li data-line="line3" class="route-line3"><label>松山線</label></li>
                        <li data-line="line4" class="route-line4"><label>中和線</label></li>
                        <li data-line="line5" class="route-line5"><label>板南線</label></li>
                    </ul>
                    <div id="route-page-all" class="route-page collapsed">
                        <div class="mrt-route-map">
                            <img src="http://web.metro.taipei/img/all/routemap2017.jpg" />
                        </div>
                        <div class="near-suggest">
                            <ul class="near-stations"></ul>
                        </div>
                    </div>
                    <div id="route-page-line1" class="route-page collapsed"></div>
                    <div id="route-page-line2" class="route-page collapsed"></div>
                    <div id="route-page-line3" class="route-page collapsed"></div>
                    <div id="route-page-line4" class="route-page collapsed"></div>
                    <div id="route-page-line5" class="route-page collapsed"></div>
                </div>
            </section>
        </article>
        <aside class="social-link">
            <div class="fb-like" style="width: 100%; overflow: hidden; display: block;" data-href="<?=$_url?>" data-width="300" data-layout="standard" data-action="like" data-show-faces="false" data-share="false"></div>
            <div class="g-plusone" data-href="<?=$_url?>" data-size="standard" data-annotation="inline" data-width="300"></div>
            <div class="plurk-pu" data-href="<?=$_url?>" data-img="<?=$_plurk_img?>" data-title="<?=$_title?>" data-status="<?=$_plurk_status?>" data-width="300"></div>
        </aside>
        <footer>
            <p>【<?=$_title?>】<?=$_description?> by Grassboy</p>
            <p>
                本網頁製作僅供學術交流，無任何營利用途，頁面中所取用到的捷運路線圖、捷運站資訊、各站行駛時間、捷運票價，版權所屬皆屬
                <a href="http://www.trtc.com.tw" target="_blank">台北捷運公司</a>
                所有，因此嚴禁將此網頁用於商業用途，除此之外，程式碼部份基於 MIT License，歡迎各位自由複製、修改、散佈
            </p>
        </footer>
    </div>
    <div id="fb-root"></div>
    <script>
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.9";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    </script>
    <script>(function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://grassboy.github.io/plurkTool/push_button/main.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'grassboy-plurk-pu'));</script>

	<script type="text/javascript">
	  window.___gcfg = {lang: 'zh-TW'};

	  (function() {
	    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	    po.src = 'https://apis.google.com/js/plusone.js';
	    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
	  })();
	</script>
</div>
<script src="javascript/controller.js" type="text/javascript"></script>
<script src="javascript/app.js" type="text/javascript"></script>
</body>
</html>

