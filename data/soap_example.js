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


