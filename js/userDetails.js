
function sentimentStats() {
  const splitLink = window.location.pathname.split('/');  
  jQuery.ajax({
      type: 'GET',
      url: '/updateSentStats',
      data: {
        userID: splitLink[splitLink.length - 1]
      },
      success: function(response) {
          if (response.code == 200) {
            let resultedInfo = document.getElementById("resultedInfo");
            resultedInfo.innerHTML = `
            <h1>Average Sentiment Score: ${response.sentScore}</h1>
            <h1>Average Magnitude Score: ${response.sentMagnitude}</h1>
            `;
          } 
          else if (response.code == 500) {
            console.log(response.errorText);
            alert("[Error]: " + response.errorText);
          }
          else {
            console.log("[Error]: There has been an error receiving the response from /updateSentStats")
            alert("[Error]: Internal server error");
          }
        },
        error: function() {
          console.log("[Error]: There was an error receiving the response from /updateSentStats in sentimentStats()")
          alert('[Error]: Internal server error');
        }
    });
}











window.addEventListener('load', function handleWindowLoad() {
  sentimentStats();

  setTimeout(() => {
    window.removeEventListener('load', handleWindowLoad);
  }, 100);
});

