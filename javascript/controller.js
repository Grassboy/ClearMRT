$(function(){
    screen.orientation.lock('portrait');
    $('body').bind('touchstart', function(e){
        e = e.originalEvent;
        if(e.touches.length > 3){
            if(document.webkitIsFullScreen) {
                try{
                    document.webkitExitFullscreen();
                } catch(e) {
                    alert(e);
                }
            } else {
                this.webkitRequestFullscreen();
            }
        }
    });
    History.Adapter.bind(window,'statechange',function(){
        var State = History.getState();
        document.title = State.title || 'ClickMRT';
        $station_from.val(State.data.from || '');
        $station_to.val(State.data.to || '');
        searchHandler(true);
    });
    var LocalStorage = function(key, value){
        try {
            if(value === undefined) {
                return localStorage['ClickMRT.'+key];
            } else {
                return localStorage['ClickMRT.'+key] = value;
            }
        } catch(e) {
            for(var key in localStorage){
                delete localStorage[key];
            }
        }
    };
    var getJSONCache = function(key, url, compress, callback){
        var cache_value = LocalStorage(key);
        if(cache_value) {
            $.getJSON(url, function(r){
                var result = compress(r);
                if(result) {
                    LocalStorage(key, JSON.stringify(result));
                }
            });
            callback(JSON.parse(cache_value));
        } else {
            $.getJSON(url, function(r){
                var result = compress(r);
                if(result) {
                    LocalStorage(key, JSON.stringify(result));
                    callback(result);
                }
            });
        }
    };

    //Global Value;
    var mrt_stations = null;
    var mrt_to_stations = null;
    var price_type;
    var fix_name_regexp = /(BL|BR|R|G|O)[0-9]{2}[\-A]?\ ?/g;
    var to_price = function(price){
        switch(price_type){
        case 'easycard':
            return price;
        case 'heart':
            return price/2;
        case 'cash':
            return price/4*5;
        }
    };
    var line_color = {
        'line1': 'CC9900',
        'line2': 'FD5B56',
        'line3': '009900',
        'line4': 'FFCC66',
        'line5': '398AFC',
        'CC9900': 'line1',
        'FD5B56': 'line2',
        '009900': 'line3',
        'FFCC66': 'line4',
        '398AFC': 'line5'
    }
    //DOM
    var $document = $(document),
        $container = $('.container'),
        $page_main = $('#page-main'),
        $header = $('.header'),
        $header_text = $('.header-text em'),
        $search_text = $('.search-text'),
        $btn_setting = $('.btn-setting'),
        $station_from = $('.station-from'),
        $station_to = $('.station-to'),
        $suggest_stations = $('.suggest-stations'),
        $near_suggest = $('.near-suggest'),
        $station_select_img = $('.station-select-map img'),
        $query_result = $('.query-result'),
        $time_and_price_result = $('.time-and-price-result'),
        $station_info_img = $('.station-info img'),
        $route_between_result = $('.route-between-result'),
        $result_from_em = $('.station-countdown .result-title em ,.station-info .result-title em, .route-between-result .result-title em:first, .route-all-result .result-title em'),
        $result_from_label = $('.result-title em label, .route-between-result .result-title em label:first'),
        $result_to_em = $('.route-between-result .result-title em:last'),
        $result_to_label = $('.route-between-result .result-title em label:last'),
        $time_em = $('.route-between-result .time em'),
        $price_em = $('.route-between-result .price em'),
        $price_label = $('.route-between-result .price label'),
        $route_tips_p = $('.routing-tips p'),
        $route_pages_tab = $('.route-pages-tab'),
        $route_pages = {
            all: $('#route-page-all'),
            line1: $('#route-page-line1'),
            line2: $('#route-page-line2'),
            line3: $('#route-page-line3'),
            line4: $('#route-page-line4'),
            line5: $('#route-page-line5')
        },
        $countdown_ul = $('.station-countdown');
        $route_all_result = $('.route-all-result');

    var renderAllOtherStations = function(station){
        var results, reg, data;
        var line_html = {
            line1: [],
            line2: [],
            line3: [],
            line4: [],
            line5: []
        };
        mrt_to_stations = mrt_to_stations || {};
        if(mrt_to_stations[station.name] !== null) { //need reset
            mrt_to_stations = {};
            mrt_to_stations[station.name] = {name: station.name};
            getJSONCache("from_station"+station.id, "https://query.yahooapis.com/v1/public/yql?q=select%20style%2C%20font.content%20from%20html%20where%20url%3D%22http%3A%2F%2Fweb.metro.taipei%2Fc%2FTicketALLresult.asp%3Fs2elect%3DSTATION-"+station.id+"%22%20and%20xpath%3D'%2F%2Ftable%5B%40id%3D%22table3%22%5D%2Ftbody%2Ftr%2Ftd'&format=json&diagnostics=true&callback=", 
                function(r){
                    if(!(r && r.query && r.query.results && (results = r.query.results.td)) && (results.length % 7 == 0)) {
                        alert(station.name+' 到各站資料載入失敗 (北捷改資料格式啦XD)');
                        return;
                    }
                    var cache = [];
                    for(var i = 0, n = results.length; i < n; i+=7){
                        var data = {
                            name: results[i+2].font.replace('/',''),
                            price: results[i+4].font,
                            time: results[i+6].font
                        };
                        if(results[i+2].style && (reg = results[i+2].style.match(/#([0-9a-f]+);$/i)) && reg[1]){
                            data.line = line_color[reg[1].toUpperCase()];
                        }
                        cache.push(data);
                    }
                    return cache;
                },
                function(results){
                    for(var i = 0, n = results.length; i < n; ++i){
                        var data = results[i];
                        var name = data.name = data.name.replace(fix_name_regexp, '');
                        mrt_to_stations[name] = mrt_to_stations[name] || data; 
                        var html_array = line_html[data.line];
                        html_array.push([
                            '<li class="route-item tr">',
                                '<div class="result-name td"><label class="',mrt_stations[name].line.join(' '),'">',name,'</label></div>',
                                '<div class="result-time td">',data.time,'</div>',
                                '<div class="result-price td">',to_price(data.price),'</div>',
                            '</li>'
                        ].join(''));
                    }
                    for(var key in line_html){
                        line_html[key].splice(0,0,'<ul class="route-stations table">');
                        line_html[key].push('</ul>');
                        $route_pages[key].addClass('collapsed').html(line_html[key].join(''));
                    }
                    $route_pages.all.removeClass('collapsed');
                    $route_pages_tab.children().removeClass('active');
                    $route_pages_tab.children(':first').addClass('active');
                    $near_suggest.html('');
                }
            );
        }
        var countdown_url = "https://query.yahooapis.com/v1/public/yql?q=use 'http%3A%2F%2Fgrassboy.tw%2FClickMRT%2Fdata%2Fyql.xml' as soap_table%3B%0Aselect * from soap_table where %0Aurl %3D 'http%3A%2F%2Fws.metro.taipei%2Ftrtcappweb%2Ftraintime.asmx' and %0Acontenttype %3D \"application%2Fsoap%2Bxml%3B charset%3Dutf-8\" and%0Apostdata%3D '<%3Fxml version%3D\"1.0\" encoding%3D\"utf-8\"%3F><soap12%3AEnvelope xmlns%3Axsi%3D\"http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance\" xmlns%3Axsd%3D\"http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema\" xmlns%3Asoap12%3D\"http%3A%2F%2Fwww.w3.org%2F2003%2F05%2Fsoap-envelope\"> <soap12%3ABody> <GetNextTrain2 xmlns%3D\"http%3A%2F%2Ftempuri.org%2F\"> <stnid>"+station.id+"<%2Fstnid> <%2FGetNextTrain2> <%2Fsoap12%3ABody><%2Fsoap12%3AEnvelope>' and%0Axpath %3D \"%2F%2Fdetail\"&format=json";
        $.get(countdown_url, function(r){
            var renderCountdown = function(d) {
                var line_id = d.stnid.replace(/[\d]/g, '').toLowerCase();
                switch(line_id) {
                case "b":
                    line_id = 'br';
                    break;
                default:
                    break;
                }
                var $line_item = $countdown_ul.find('.countdown-'+line_id);
                if($line_item.length == 0) {
                    alert('line item error'+ '.countdown-'+line_id);
                }
                $line_item.append($('<span class="countdown-item">'+d.destination+'<em>'+$.trim(d.countdown)+'</em></span>'));
            };
            if(r && r.query && r.query.results && r.query.results.postresult && r.query.results.postresult.detail) {
                $countdown_ul.find('.countdown-item').remove();
                if(!r.query.results.postresult.detail.forEach) {
                    var d = (r.query.results.postresult.detail);
                    renderCountdown(d);
                } else {
                    r.query.results.postresult.detail.forEach(function(d, i){
                        renderCountdown(d);
                    });
                }
            } else {
                console.dir(r);
                alert('列車倒數格式錯誤：'+JSON.stringify(r));
            }
        });
        return;
    };
    var searchHandler = function(ignore_pushstate){
        $document.scrollTop(0);
        $page_main.removeClass('searching');
        $header.removeClass('assign-to').removeClass('assign-from');
        var from_val = $station_from.val();
        var to_val = $station_to.val();
        var from = mrt_stations[from_val];
        var to = mrt_stations[to_val];
        $header_text.hide();
        if(from_val && !from) {
            //TODO: Station name fix
        }
        if(to_val && !to) {
            //TODO: Station name fix
        }
        if(from && to && from.name == to.name) {
            $station_to.val();
            to_val = '';
            to = undefined;
        }
        $container.removeClass('initializing');
        if(from && to) {
            if(!ignore_pushstate) History.pushState({from: from.name, to: to.name}, [from.name,' 到 ',to.name, ' - ClickMRT'].join(''), '/ClickMRT/'+from.name+'-'+to.name);
            $time_and_price_result.detach().prependTo($query_result);
            $station_info_img.attr('src', 'http://web.metro.taipei/img/ALL/TTPDF/JPG/'+from.id.split('-').pop()+'.JPG');
            $search_text.text([from.name,' 到 ',to.name].join(''));
            $result_from_label.text(from.name);
            $result_from_em.attr('class', from.line.join(' '));
            $result_to_label.text(to.name);
            $result_to_em.attr('class', to.line.join(' '));
            $time_em.text('--');
            $price_em.text('--');
            $route_tips_p.text('...');
            $route_between_result.removeClass('collapsed');
            $route_all_result.addClass('collapsed');
            $near_suggest.html('');
            getJSONCache(['from_station',from.id,'to',to.id].join(''), "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fweb.metro.taipei%2Fc%2F2stainfo.asp%3Faction%3Dquery%26s1elect%3DSTATION-"+from.id+"%26s2elect%3DSTATION-"+to.id+"%22%20and%20xpath%3D'%2F%2F*%2Ftd%2Fdiv%2Ffont'&format=json&diagnostics=true&callback=",
                function(r){
                    var result;
                    if(r.query && r.query.results && r.query.results.font.length == 11){
                        var tds = r.query.results.font;
                        result = {
                            time: tds[8].content.match(/\d+/),
                            price: tds[4].content.match(/\d+/),
                            tips: tds[9].content
                        };
                        result.time = result.time && result.time[0];
                        result.price = result.price && result.price[0];
                    } else {
                        alert('格式不符');
                        //console.dir(r);
                    }
                    return result;
                },
                function(data){
                    $time_em.text(data.time || '??');
                    $price_em.text(data.price && to_price(data.price) || '??');
                    $route_tips_p.text(data.tips);
                }
            );
            if(ignore_pushstate) renderAllOtherStations(from);
        } else {
            $time_and_price_result.detach().appendTo($query_result);
            $route_all_result.removeClass('collapsed');
            $route_between_result.addClass('collapsed');
            if (from) {
                if(!ignore_pushstate) History.pushState({from: from.name}, [from.name,' 到其他各站 - ClickMRT'].join(''), '/ClickMRT/'+from.name);
                $station_info_img.attr('src', 'http://web.metro.taipei/img/ALL/TTPDF/JPG/'+from.id.split('-').pop()+'.JPG');
                $search_text.text([from.name,' 到其他各站'].join(''));
                $result_from_label.text(from.name);
                $result_from_em.attr('class', from.line.join(' '));
                if(ignore_pushstate) renderAllOtherStations(from);
            } else if (to) {
                if(!ignore_pushstate) History.pushState({from: to.name}, [to.name,' 到其他各站 - ClickMRT'].join(''), '/ClickMRT/'+to.name);
                $station_from.val(to_val);
                $station_to.val('');
                $station_info_img.attr('src', 'http://web.metro.taipei/img/ALL/TTPDF/JPG/'+to.id.split('-').pop()+'.JPG');
                $search_text.text([to.name,' 到其他各站'].join(''));
                $result_from_label.text(to.name);
                $result_from_em.attr('class', from.line.join(' '));
                if(ignore_pushstate) renderAllOtherStations(to);
            } else {
                if(!ignore_pushstate) History.pushState({}, 'ClickMRT', '/ClickMRT/');
                $header_text.attr('style', null);
                $search_text.text('');
                $container.addClass('initializing');
                return;
            }
        }
    };
    $('.btn-search').bind('click', function(e){
        e.preventDefault();
        if($page_main.is('.searching')){
            searchHandler();
        } else {
            $page_main.addClass('searching');
            $header.addClass('assign-from');
        }
    });
    $station_from.bind('focus', function(){
        $header.removeClass('assign-to').addClass('assign-from');
    }).bind('click', function(){
        $station_from.val('');
    });
    $station_to.bind('focus', function(){
        $header.removeClass('assign-from').addClass('assign-to');
    }).bind('click', function(){
        $station_to.val('');
    });
    $suggest_stations.on('click', 'li', function(){
        if($header.is('.assign-to')) {
            $station_to.val($(this).find('label').text());
            $header.removeClass('assign-to').addClass('assign-from');
        } else if($header.is('.assign-from')){
            $station_from.val($(this).find('label').text());
            $header.removeClass('assign-from').addClass('assign-to');
        }
    });
    $('.btn-exchange').bind('click', function(e){
        var tmp = $station_to.val();
        $station_to.val($station_from.val());
        $station_from.val(tmp);
    });
    var map_click_handler = function(e){
        var $this = $(this);
        var offset = $this.offset();
        var width = $this.width();
        var height = $this.height();
        var real_width = $this[0].naturalWidth;
        var real_height = $this[0].naturalHeight;
        var x = e.offsetX/width*real_width;
        var y = e.offsetY/height*real_height;
        if(mrt_stations){
            var candidate = [], threshhold = 25;
            for(var name in mrt_stations){
                var station = mrt_stations[name];
                var x_diff, y_diff, distance;
                if(x >= station.x1 && x <= station.x2){
                    x_diff = 0;
                } else if(x < station.x1) {
                    x_diff = station.x1 - x;
                } else {
                    x_diff = x - station.x2;
                }
                if(y >= station.y1 && y <= station.y2){
                    y_diff = 0;
                } else if(y < station.y1) {
                    y_diff = station.y1 - y;
                } else {
                    y_diff = y - station.y2;
                }
                distance = (x_diff*x_diff) + (y_diff*y_diff);
                if(distance < (threshhold/width*real_width)*(threshhold/width*real_width)){
                    candidate.push({
                        name: name,
                        distance: distance
                    });
                }
            }
            candidate.sort(function(a, b){
                return a.distance > b.distance?1:0;
            });
            $this.trigger('stationselected', [candidate]);
        }
    };
    $station_select_img.bind('click', map_click_handler);
    $route_pages.all.find('img').bind('click', map_click_handler);
    $station_select_img.bind('stationselected', function(e, candidate){
        if(candidate.length <= 0) return;
        if($header.is('.assign-to')) {
            $station_to.val(candidate[0].name);
        } else if($header.is('.assign-from')){
            $station_from.val(candidate[0].name);
        }
        $suggest_stations.html('');
        var html = [];
        for(var i = 0, n = candidate.length; i < n; ++i){
            var c = candidate[i], station = mrt_stations[c.name];
            if(!station) {
                alert(c.name + ' 不存在');
            }
            html.push('<li class="',station.line.join(' '),'"><label>',c.name,'</label></li>');
        }
        $suggest_stations.html(html.join('')).scrollLeft(0);
    });
    $route_pages.all.find('img').bind('stationselected', function(e, candidate){
        var near_html = [];
        for(var i = 0, n = candidate.length; i < n; ++i){
            var data = mrt_to_stations[candidate[i].name];
            if(data.price && data.time) {
                near_html.push(
                    '<li class="near-item">',
                        '<label class="',mrt_stations[data.name].line.join(' '),'">',data.name,'</label>',
                        '<span class="result-time">',data.time,'</span>',
                        '<span class="result-price">',to_price(data.price),'</span>',
                    '</li>'
                );
            }
        }
        if(near_html.length){
            near_html.splice(0, 0, '<ul class="near-stations">');
            near_html.push('</ul>');
        }
        $near_suggest.html(near_html.join(''));
    });
    $route_all_result.bind('click', function(){
        $route_all_result.removeClass('collapsed');
    });
    $route_pages_tab.on('click', 'li', function(){
        var $this = $(this), line = $this.data('line');
        $near_suggest.html('');
        if($this.toggleClass('active').hasClass('active')) {
            for(var key in $route_pages){
                if(key != line){
                    $route_pages[key].addClass('collapsed');
                    $route_pages_tab.find('.route-'+key).removeClass('active');
                } else {
                    $route_pages[key].removeClass('collapsed');
                    $route_pages_tab.find('.route-'+key).addClass('active');
                }
            }
        } else {
            $route_pages[line].addClass('collapsed');
        }
    });
    $('.route-page').on('click', 'label', function(e){
        $station_to.val($(this).text());
        searchHandler();
    });
    $('.btn-reverse').bind('click', function(){
        var tmp = $station_from.val();
        $station_from.val($station_to.val());
        $station_to.val(tmp);
    });
    $btn_setting.bind('click', function(){
        if($btn_setting.is('.btn-easycard')){
            price_type = 'cash';
            $price_label.text('現金票價');
            $btn_setting.removeClass('btn-easycard').addClass('btn-cash');
        } else if ($btn_setting.is('.btn-cash')){
            price_type = 'heart';
            $price_label.text('敬老/愛心票價');
            $btn_setting.removeClass('btn-cash').addClass('btn-heart');
        } else if ($btn_setting.is('.btn-heart')){
            price_type = 'easycard';
            $price_label.text('悠遊卡票價');
            $btn_setting.removeClass('btn-heart').addClass('btn-easycard');
        }
        LocalStorage('price_type', price_type);
        searchHandler();
    });
    
    //init Setting -------------------------------------------------
    price_type = LocalStorage('price_type') || 'easycard';
    $btn_setting.removeClass('btn-heart').removeClass('btn-easycard').removeClass('btn-cash').addClass('btn-'+price_type);
    switch(price_type){
    case "easycard":
        $price_label.text('悠遊卡票價');
        break;
    case "cash":
        $price_label.text('現金票價');
        break;
    case "heart":
        $price_label.text('敬老/愛心票價');
        break;
    }
    getJSONCache('total_stations', "https://query.yahooapis.com/v1/public/yql?q=select%20alt%2C%20coords%2C%20href%2C%20content%2C%20style%20from%20html%20where%20url%3D%22http%3A%2F%2Fweb.metro.taipei%2Fc%2FTBselectstation2010.asp%22%20and%0A%20%20%20%20%20%20(xpath%3D'%2F%2F*%2Fmap%2Farea'%20or%20xpath%3D'%2F%2F*%2Foption')&format=json&diagnostics=true&callback=",
        function(r){
            var mrt_stations = {};
            if (r && r.query && r.query.count > 0) {
                var stations = r.query.results.area;
                var stations2 = r.query.results.option;
                for (var i = 0, n = stations.length; i < n; ++i) {
                    var name = stations[i].alt.replace('/','').replace(fix_name_regexp, '');
                    var bound = stations[i].coords.split(',');
                    var max_y_p = 1, min_y_p = 1, bn = bound.length;
                    if(bn > 4){ //poligon to rect
                        for(var p = 1; p < bn; p+=2){
                            bound[p] = bound[p]^0;
                            bound[p-1] = bound[p-1]^0;
                            if(bound[p] > bound[max_y_p]) {
                                max_y_p = p;
                            }
                            if(bound[p] < bound[min_y_p]) {
                                min_y_p = p;
                            }
                        }
                        bound = [
                            bound[max_y_p-1]>bound[min_y_p-1]?bound[min_y_p-1]:bound[max_y_p-1],
                            bound[min_y_p],
                            bound[max_y_p-1]>bound[min_y_p-1]?bound[max_y_p-1]:bound[min_y_p-1],
                            bound[max_y_p]
                        ];
                    }
                    mrt_stations[name] = {
                        id: stations[i].href.replace(/^.*-([^=]+)$/, "$1"),
                        name: name,
                        x1: bound[0] ^ 0,
                        y1: bound[1] ^ 0,
                        x2: bound[2] ^ 0,
                        y2: bound[3] ^ 0,
                        line: []
                    };
                }
                for (var i = 0, n = stations2.length; i < n; ++i){
                    var name = stations2[i].content.replace('/','').replace(fix_name_regexp, '');
                    if(!mrt_stations[name]){
                        alert(name + ' 不存在!!');
                        continue;
                    }
                    var current_line_color = stations2[i].style.replace(/^background-color: #([a-fA-F0-9]+);$/, '$1');
                    switch(stations2[i].style.replace(/^background-color: #([a-fA-F0-9]+);$/, '$1')){
                    case line_color.line1:
                        mrt_stations[name].line.push('line1');
                        break;
                    case line_color.line2:
                        mrt_stations[name].line.push('line2');
                        break;
                    case line_color.line3:
                        mrt_stations[name].line.push('line3');
                        break;
                    case line_color.line4:
                        mrt_stations[name].line.push('line4');
                        break;
                    case line_color.line5:
                        mrt_stations[name].line.push('line5');
                        break;
                    default:
                        alert('不認識的線：'+current_line_color);
                        break;
                    }
                }
    //            console.dir(mrt_stations);
    //            alert('捷運站資料載入完畢');
            } else {
    //            console.dir(r);
                alert('捷運站資料載入失敗 (北捷改資料格式啦XD)');
                alert(JSON.stringify(r));
            }
            return mrt_stations;
        },
        function(r){
            mrt_stations = r;
            var matches = location.pathname.match(/^\/ClickMRT\/([^\-\.\/]+)(\-([^\-\.\/]+))?$/);
            if(matches){
                try {
                    var from = decodeURIComponent(matches[1]),
                        to = decodeURIComponent(matches[3]);
                    if(from !== '台北車站') from = from.replace(/站$/, '');
                    if(to !== '台北車站') to = to.replace(/站$/, '');
                    if(mrt_stations[from] && mrt_stations[to]){
                        $station_from.val(from);
                        $station_to.val(to);
                        searchHandler(true);
                    } else if (mrt_stations[from]) {
                        $station_from.val(from);
                        $station_to.val('');
                        searchHandler(true);
                    }
                } catch(e){
                    //no-op
                }
            }
        }
    );
});
