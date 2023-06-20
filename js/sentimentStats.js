
function selChart(selectedChart) {

    const selectionBox = document.getElementById("selectChart");
    const chartBox = document.getElementById("selectChartBox");
    const userBox = document.getElementById("selectUserBox");
    const tagBox = document.getElementById("selectTagBox");

    if (selectedChart == "selectUserBox") {
        chartBox.style.display = "none";
        userBox.style.display = "flex";
        tagBox.style.display = "none";

        document.getElementById("userChartButton").style.backgroundColor = "#113f8a";
        document.getElementById("tagChartButton").style.backgroundColor = "#336ac2";
    }
    else if (selectedChart == "selectTagBox") {
        chartBox.style.display = "none";
        userBox.style.display = "none";
        tagBox.style.display = "flex";

        document.getElementById("userChartButton").style.backgroundColor = "#336ac2";
        document.getElementById("tagChartButton").style.backgroundColor = "#113f8a";
    }
} 



function getUsers() {
    let userButtons = "";
    jQuery.ajax({
        type: 'GET',
        url: '/getListUsers',
        success: function(response) {
            if (response.code == 200) {
                users = response.users;
                if (typeof users !== 'undefined') {
                    users.forEach((user) => {
                        let userElement = `\n<button id="ddUser_${user.userID}" data-name="${user.displayName}" onclick="checkUT(this)"> ${user.username} </button>`;
                        userButtons += userElement;
                    });
                }
            } 
            else if (response.code == 500) {
                console.log(response.errorText);
                alert("[Error]: " + response.errorText);
                reject("[Error]: " + response.errorText);
            }
            else {
            console.log("[Error]: There has been an error receiving the response from /getListUsers")
                alert("[Error]: Internal server error");
                reject("[Error]: Internal server error");
            }
            document.getElementById("usersContainer").innerHTML = userButtons;
        },
        error: function() {
            console.log("[Error]: There was an error receiving the response from /votePost in voteFunction()")
            alert('[Error]: Internal server error');
        }
    });
}


function getTags() {
    let tagButtons = "";
    jQuery.ajax({
        type: 'GET',
        url: '/getListTags',
        success: function(response) {
            if (response.code == 200) {
                tags = response.tags;
                if (typeof tags !== 'undefined') {
                    tags.forEach((tag) => {
                        let tagElement = `\n<button id="ddTag_${tag.id}" onclick="checkUT(this)"> ${tag.title} </button>`;
                        tagButtons += tagElement;
                    });
                }
            } 
            else if (response.code == 500) {
                console.log(response.errorText);
                alert("[Error]: " + response.errorText);
            }
            else {
                console.log("[Error]: There has been an error receiving the response from /getListTags")
                alert("[Error]: Internal server error");
            }
            document.getElementById("tagsContainerC").innerHTML = tagButtons; 
        },
        error: function() {
            console.log("[Error]: There was an error receiving the response from /votePost in voteFunction()")
            alert('[Error]: Internal server error');
        }
    });
}



function handleUTDropdown(event, dropdown, list) {
    if (!list.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = "none";
        document.removeEventListener('click', handleUTDropdown);
    }
} 

function uTDropdown(event, dropdownFor) {
    let dropdown, list;
    if (dropdownFor == "users") {
        dropdown = document.getElementById('dropdownUsers');
        list =  document.getElementById('usersList');
    }
    else if (dropdownFor == "tags") {
        dropdown = document.getElementById('dropdownTagsC');
        list =  document.getElementById('tagsList');
    }
    if (dropdown.style.display == "flex") {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "flex";
        document.addEventListener('click', function(event) {
            handleUTDropdown(event, dropdown, list);
        });
    }
}



function checkUT(element) {
    if (element.classList.contains("checkedButton")) {
        element.classList.remove("checkedButton");
    }
    else {
        element.classList.add("checkedButton");
    }
}

function clearUT(clearFor) {
    let buttons;
    if (clearFor == "users") {
        const usersContainer = document.getElementById("usersContainer");
        buttons = usersContainer.querySelectorAll("button");
    }
    else if (clearFor == "tags") {
        const tagsContainerC = document.getElementById("tagsContainerC");
        buttons = tagsContainerC.querySelectorAll("button");
    }
    buttons.forEach(button => {
        button.classList.remove('checkedButton');
    });
}
 


function filterUsers() {
    const buttons = document.getElementById("usersContainer").getElementsByTagName("button");
    const filter = document.getElementById("searchUser").value.toLowerCase()
    let button, i;

    for (i = 0; i < buttons.length; i++) {
        button = buttons[i];
        if (button.dataset.name.toLowerCase().indexOf(filter) > -1 || button.innerHTML.toLowerCase().indexOf(filter) > -1) {
        button.style.display = "";
        } else {
        button.style.display = "none";
        }
    }
}

function filterTags() {
    const buttons = document.getElementById("tagsContainerC").getElementsByTagName("button");
    const filter = document.getElementById("searchTag").value.toLowerCase()
    let button, i;

    for (i = 0; i < buttons.length; i++) {
        button = buttons[i];
        if (button.innerHTML.toLowerCase().indexOf(filter) > -1) {
        button.style.display = "";
        } else {
        button.style.display = "none";
        }
    }
}



function checkInvNr(intFor) {
    const intervalNr = document.getElementById(`intervalNumber${intFor}`);
    if (intervalNr.value < 1) {
        intervalNr.style.backgroundColor = "#f08b8b";
    }
    else {
        intervalNr.style.backgroundColor = "";
    }

}






function displayChart(selType) {

    const startDate = document.getElementById(`startDatetime${selType}`);
    const endDate = document.getElementById(`endDatetime${selType}`);
    const intervalNr = document.getElementById(`intervalNumber${selType}`);
    const intervalType = document.getElementById(`intervalType${selType}`);
    let buttonElems = [], i=0;

    const alertBox = document.getElementById("alertBox");
    if (selType == "User") {
        alertBox.innerHTML = "Please select at least one user";
        const usersContainer = document.getElementById("usersContainer");
        const buttons = usersContainer.querySelectorAll("button");
        buttons.forEach(button => {
            if (button.classList.contains("checkedButton")) {
                buttonElems[i] = button.id;
                i++;
            }
        });
    }
    else if (selType == "Tag") {
        alertBox.innerHTML = "Please select at least one tag";
        const tagsContainerC = document.getElementById("tagsContainerC");
        const buttons = tagsContainerC.querySelectorAll("button");
        buttons.forEach(button => {
            if (button.classList.contains("checkedButton")) {
                buttonElems[i] = button.id;
                i++;
            }
        });
    }

    buttonElems.forEach((elem, index) => {
        let value = elem.split('_').slice(1).join('_');
        buttonElems[index] = value;
      });
      


    if (buttonElems.length == 0 || intervalNr.value < 1) {
        if (intervalNr < 1) {
            alertBox.innerHTML = "Please enter a interval larger than 0";
        }
        const alertPopup = document.getElementById("alertPopup");
        alertPopup.style.display = "block";
        setTimeout(function() {
            alertPopup.style.display = "none"; 
        }, 2000);
    }
    else {
        if (selType == "User") {
            jQuery.ajax({
                type: 'GET',
                url: '/getPostsDated',
                data: {
                    startDate: startDate.value,
                    endDate: endDate.value,
                    userIDs: buttonElems
                },
                success: function(response) {
                    if (response.code == 200) {
                        createChart(startDate.value,endDate.value,true,response.posts,buttonElems);
                    } 
                    else if (response.code == 500) {
                        console.log(response.errorText);
                        alert("[Error]: " + response.errorText);
                        reject("[Error]: " + response.errorText);
                      }
                      else {
                        console.log("[Error]: There has been an error receiving the response from /getPostsDated")
                        alert("[Error]: Internal server error");
                        reject("[Error]: Internal server error");
                      }
                },
                error: function() {
                    console.log("[Error]: There was an error receiving the response from /getPostsDated in displayChart()")
                    alert('[Error]: Internal server error');
                }
            });
        }
        else if (selType == "Tag") {
            jQuery.ajax({
                type: 'GET',
                url: '/getPostsTaggedDated',
                data: {
                    startDate: startDate.value,
                    endDate: endDate.value,
                    tagIDs: buttonElems
                },
                success: function(response) {
                    if (response.code == 200) {
                        createChart(startDate.value,endDate.value,false,response.posts,buttonElems);
                    } 
                    else if (response.code == 500) {
                        console.log(response.errorText);
                        alert("[Error]: " + response.errorText);
                        reject("[Error]: " + response.errorText);
                      }
                      else {
                        console.log("[Error]: There has been an error receiving the response from /getPostsTaggedDated")
                        alert("[Error]: Internal server error");
                        reject("[Error]: Internal server error");
                      }
                },
                error: function() {
                    console.log("[Error]: There was an error receiving the response from /getPostsTaggedDated in displayChart()")
                    alert('[Error]: Internal server error');
                }
            });
        }

    }
}




function hsvToRgb(h, s, v) {
    let r, g, b;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
  
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
  
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}


let nrChart = 0;
function createChart(startDate, endDate, chartType, posts, elemIDs) { 

    let parentDiv = document.getElementById("generatedCharts");
    let containerDiv = document.createElement("div");
    containerDiv.className = "containerCanvas";
    containerDiv.id = `containerNr_${nrChart}`;
    containerDiv.innerHTML = `
      <canvas id="chartNr${nrChart}"></canvas>
      <button class="removeCanvas" onclick="removeChart(${nrChart})"></button>
    `;
    parentDiv.appendChild(containerDiv);
  

    let postDates = [], chartData = { labels: [], datasets: [],};
    let hue = 0, saturation = 60, value = 100;
    
    for (i = 0; i < posts.length; i++) {
        const postsSet = posts[i];
        let elemSet;  

        if (chartType == true) {
            let userSet = document.getElementById(`ddUser_${elemIDs[i]}`);
            if (userSet.dataset.name == "null") {
                elemSet = userSet.innerText;
            } else {
                elemSet = userSet.dataset.name;
            }
        }
        else if (chartType == false) {
            elemSet =  document.getElementById(`ddTag_${elemIDs[i]}`).innerText;
        }
  
        if (postsSet.length > 1) {
            const datasetPoints = [], datasetColors = [], datasetAdditionalData = [];
            let postSetDates = [], formattedDate;
            
            for (j = 0; j < postsSet.length; j++) {
                formattedDate = new Date(postsSet[j].creationDate).toLocaleDateString('en-GB');
                postDates.push(formattedDate);
                postSetDates.push(formattedDate);
            }
    
            const datesSetPosts = postSetDates.map((date) => new Date(date.split("/").reverse().join("-")));
            datesSetPosts.sort((a, b) => a - b);
            const sortedSetDates = datesSetPosts.map((date) => date.toLocaleDateString("en-GB"));
    
            for (j = 0; j < sortedSetDates.length; j++) {
                const post = postsSet[j];
                const point = {
                    x: sortedSetDates[j],
                    y: post.sentimentMagnitude,
                    additionalData: {
                    "Post ID": post.id,
                    "Sentiment Score": post.sentimentScore,
                    "Sentiment Magnitude": post.sentimentMagnitude,
                    },
                };
                datasetPoints.push(point);
                datasetAdditionalData.push(point.additionalData);
            }
    
            if (hue == 340 && saturation == 100 && value <= 55) {
                datasetColors.push('rgb(0, 0, 0)');
            } 
            else {
                const rgbColor = hsvToRgb(hue / 360, saturation / 100, value / 100);
                datasetColors.push(rgbColor);
        
                hue += 45;
                if (hue == 360) {
                    hue = 0;
                    saturation += 10;
                    if (saturation > 100) {
                    saturation = 60;
                    value -= 15;
                    }
                }
            }
    
            const dataset = {
                label: elemSet,
                data: datasetPoints,
                borderColor: datasetColors[i % datasetColors.length],
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                additionalData: datasetAdditionalData,
            };
    
            chartData.datasets.push(dataset);
        } 

        else if (postsSet.length == 1) {
            const post = postsSet[0];
            const formattedDate = new Date(post.creationDate).toLocaleDateString('en-GB');
            postDates.push(formattedDate);
        
            const point = {
                x: formattedDate,
                y: post.sentimentMagnitude,
                additionalData: {
                    "Post ID": post.id,
                    "Sentiment Score": post.sentimentScore,
                    "Sentiment Magnitude": post.sentimentMagnitude,
                },
            };
        
            const dataset = {
                label: elemSet,
                data: [point],
                borderColor: 'rgb(156, 156, 156)',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
            };
        
            chartData.datasets.push(dataset);
        }
        
        else {
            const dataset = {
                label: elemSet,
                data: [],
                borderColor: 'rgb(82, 82, 82)',
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
            };
  
        chartData.datasets.push(dataset);
      }
    }

    postDates.push(new Date(startDate).toLocaleDateString('en-GB'));
    postDates.push(new Date(endDate).toLocaleDateString('en-GB'));
  
    const datesPosts = postDates.map((date) => new Date(date.split("/").reverse().join("-")));
    datesPosts.sort((a, b) => a - b);
    const sortedFDates = datesPosts.map((date) => date.toLocaleDateString("en-GB"));


    chartData.labels = Array.from(new Set(sortedFDates));
  
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Generated post history',
          font: {
            size: '24px',
          },
        },
        tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y || 0;
                const additionalData = context.dataset.additionalData || [];
                let additionalDataString = '';
                if (additionalData.length > 0) {
                  const data = additionalData[context.dataIndex] || {};
                  additionalDataString = Object.entries(data)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(' | ');
                }
                return `${label}: ${value} | ${additionalDataString}`;
              },
            },
          },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  

    let ctx = document.getElementById(`chartNr${nrChart}`).getContext('2d');
    nrChart++;

    const generatedChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });
  
    const pointCustomization = {
      id: 'customPointStyle',
      afterDatasetsDraw: function (chart) {
        const ctx = chart.ctx;
        chart.data.datasets.forEach(function (dataset, datasetIndex) {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (!meta.hidden) {
            meta.data.forEach(function (element, index) {
              let x = element.x, y = element.y, radius = 5;
              ctx.fillStyle = 'rgb(0, 0, 0)';
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, 2 * Math.PI);
              ctx.closePath();
              ctx.fill();
            });
          }
        });
      },
      
    };
  
    Chart.register(pointCustomization);
}



function removeChart(chartNumber) {
    let chartContainer = document.getElementById(`chartNr${chartNumber}`);
    if (chartContainer) {
      chartContainer.parentNode.remove();
    }
}






function checkUserAccess() {
    jQuery.ajax({
        type: 'GET',
        url: '/checkUserAccess',
        success: function(response) {
            if (response.code == 200) {
                if (response.answer == "false") {
                    alert("You do not have the proper clearance to use these statistics");
                    window.location.href="/";
                }
            } 
            else if (response.code == 500) {
                console.log(response.errorText);
                alert("[Error]: " + response.errorText);
                reject("[Error]: " + response.errorText);
            }
            else {
            console.log("[Error]: There has been an error receiving the response from /checkUserAccess")
                alert("[Error]: Internal server error");
                reject("[Error]: Internal server error");
            }
        },
        error: function() {
            console.log("[Error]: There was an error receiving the response from /checkUserAccess in checkUserAccess()")
            alert('[Error]: Internal server error');
        }
    });
}








window.addEventListener('load', function handleWindowLoad() {
    checkUserAccess();
    getUsers();
    getTags();

    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 3);
    document.getElementById("endDatetimeUser").value = currentTime.toISOString().slice(0, 16);
    document.getElementById("endDatetimeTag").value = currentTime.toISOString().slice(0, 16);

  setTimeout(() => {
    window.removeEventListener('load', handleWindowLoad);
  }, 100);
});