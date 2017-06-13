var station_id = '042';
var soapMessage = `<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">\n  <soap12:Body>\n    <GetNextTrain2 xmlns=\"http://tempuri.org/\">\n        <stnid>${station_id}</stnid>\n    </GetNextTrain2>\n  </soap12:Body>\n</soap12:Envelope>`;
var soapMessage = '<?xml version="1.0" encoding="utf-8"?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">  <soap12:Body>    <GetNextTrain2 xmlns="http://tempuri.org/">        <stnid>042</stnid>    </GetNextTrain2>  </soap12:Body></soap12:Envelope>';
  jQuery.ajax({
          url: 'http://ws.metro.taipei/trtcappweb/traintime.asmx',
          type: "POST",
          dataType: "xml",
          data: soapMessage,
          contentType: "application/soap+xml; charset=utf-8",

          success: function( response ){ 
              console.log('成功');
              gClipboard(new XMLSerializer().serializeToString(response));
          },

          error: function(XMLHttpRequest,textStatus, errorThrown){
              document.body.innerHTML = document.body.innerHTML + '\n' + 'error : ' + textStatus + '\n';
              alert("error : " + textStatus);
          }

  });

-------------------------------------------------

use 'http://grassboy.tw/ClickMRT/data/yql.xml' as soap_table;
select * from soap_table where 
url = 'http://ws.metro.taipei/trtcappweb/traintime.asmx' and 
contenttype = "application/soap+xml; charset=utf-8" and 
postdata= '<?xml version="1.0" encoding="utf-8"?><soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">  <soap12:Body>    <GetNextTrain2 xmlns="http://tempuri.org/">        <stnid>042</stnid>    </GetNextTrain2>  </soap12:Body></soap12:Envelope>' and 
xpath = "Detail"

-------------------------------------------------
<?xml version="1.0" encoding="UTF-8"?>

<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<soap:Body>
<GetNextTrain2Response xmlns="http://tempuri.org/">
<GetNextTrain2Result>
<root station="042" stationname="中正紀念堂站" noservice="YES       " ErrStatement="" xmlns="">
<Detail flag="1  " priority="200" platform="NR1A" stnid="R11" destination="淡水站" countdown="00:00     " updatetime="2017-04-28 16:45:57 " nowtime="2017-04-28 16:46:22 " diffsec="25"/>
<Detail flag="1  " priority="220" platform="NR1A" stnid="R11" destination="北投站" countdown="03:47     " updatetime="2017-04-28 16:46:17 " nowtime="2017-04-28 16:46:22 " diffsec="5"/>
<Detail flag="1  " priority="290" platform="NR1A" stnid="R11" destination="象山站" countdown="03:31     " updatetime="2017-04-28 16:46:17 " nowtime="2017-04-28 16:46:22 " diffsec="5"/>
<Detail flag="1  " priority="295" platform="NR1A" stnid="R11" destination="大安站" countdown="06:42     " updatetime="2017-04-28 16:46:18 " nowtime="2017-04-28 16:46:22 " diffsec="4"/>
<Detail flag="1  " priority="310" platform="GR1" stnid="G11" destination="松山站" countdown="02:14     " updatetime="2017-04-28 16:46:10 " nowtime="2017-04-28 16:46:22 " diffsec="12"/>
<Detail flag="1  " priority="345" platform="GR1" stnid="G11" destination="新店站" countdown="08:09     " updatetime="2017-04-28 16:46:10 " nowtime="2017-04-28 16:46:22 " diffsec="12"/>
<Detail flag="1  " priority="350" platform="GR1" stnid="G11" destination="台電大樓站" countdown="03:41     " updatetime="2017-04-28 16:46:10 " nowtime="2017-04-28 16:46:22 " diffsec="12"/>
</root>
</GetNextTrain2Result>
</GetNextTrain2Response>
</soap:Body>
</soap:Envelope>


