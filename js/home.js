const createPostBack = document.getElementById('createPostBackground');
const createPostPopTop = document.getElementById('createPostPopupTop');
const createPostPop = document.getElementById('createPostPopup');

const sPB = document.getElementById("sortPostsButton");
const sPBT = document.getElementById("sortPostsButtonText");
const sPBI = document.getElementById("sortPostsButtonImage");
const SPD = document.getElementById("sortPostsDropdown");

const fPB = document.getElementById("filterPostsButton");
const fPBT = document.getElementById("filterPostsButtonText");
const fPBI = document.getElementById("filterPostsButtonImage");
const fPD = document.getElementById("filterPostsDropdown");

const hNS = document.getElementById("homeNavSection");


if (createPostBack !== null) {
    createPostBack.addEventListener('click', () => {
        createPostBack.style.display = 'none';
        createPostPopTop.style.display = 'none';
        createPostPop.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

function removeCreatePostPopup() {
    createPostBack.style.display = 'none';
    createPostPopTop.style.display = 'none';
    createPostPop.style.display = 'none';
}

function createPostPopup() {
    createPostBack.style.display = 'block';
    createPostPopTop.style.display = 'block';
    createPostPop.style.display = 'block';
    document.body.style.overflow = 'hidden';
    sPBT.style.display = "flex";
    sPB.style.backgroundColor = "#553278";
    sPBI.style.display = "none";
    SPD.style.display = "none";
    fPBT.style.display = "flex";
    fPB.style.backgroundColor = "#553278";
    fPBI.style.display = "none";
    fPD.style.display = "none";
}


function createAndSet() {
	var tagId = 0;
    const newTagField = document.createElement("input");
    tagId = tagId + 1;
    newTagField.setAttribute("id", "tag-" + tagId);
    newTagField.setAttribute("type", "text");
    newTagField.setAttribute("name", "newTag");
    newTagField.setAttribute("value", '');
    
    const postForm = document.getElementById("createPostForm");
    const submitButton = postForm.querySelector("input[type='submit']");
    postForm.insertBefore(newTagField, submitButton);

    var buttonSpace = document.createElement("br");
    postForm.insertBefore(buttonSpace, submitButton);

    const disableField = document.getElementById("tag-" + (tagId-1));
    if (tagId > 1) {
      disableField.setAttribute("readonly", "readonly");
    }
  }


  function toggleSort() {
  
    if (sPBI.style.display == "none") {
      if (fPBI.style.display != "none") {
        fPBT.style.display = "flex";
        fPB.style.backgroundColor = "#553278";
        fPBI.style.display = "none";
        fPD.style.display = "none";
      }
      hNS.style.display = "none";
      sPBT.style.display = "none";
      sPB.style.backgroundColor = "white";
      sPBI.style.display = "flex";
      SPD.style.display = "block";
    } 
    else {
      hNS.style.display = "flex";
      sPBT.style.display = "flex";
      sPB.style.backgroundColor = "#553278";
      sPBI.style.display = "none";
      SPD.style.display = "none";
    }
  }
  
  function toggleFilter() {


    if (fPBI.style.display == "none") {
      if (sPBI.style.display != "none") {
        sPBT.style.display = "flex";
        sPB.style.backgroundColor = "#553278";
        sPBI.style.display = "none";
        SPD.style.display = "none";    
      }
      hNS.style.display = "none";
      fPBT.style.display = "none";
      fPB.style.backgroundColor = "white";
      fPBI.style.display = "flex";
      fPD.style.display = "block";
      getFilters();
    } 
    else {
      hNS.style.display = "flex";
      fPBT.style.display = "flex";
      fPB.style.backgroundColor = "#553278";
      fPBI.style.display = "none";
      fPD.style.display = "none";
    }
  }






  function getVotes(accountID) {
    return new Promise(function(resolve, reject) {
      jQuery.ajax({
        type: 'GET',
        url: `/getVotes`,
        data: accountID,
        success: function(response) {
            if (response.code == 200) {
              resolve ([response.likedPostsIDs,response.dislikedPostsIDs]);
            } 
            else if (response.code == 500) {
              reject(new Error('Internal server error'));
            } 
            else {
              reject(new Error('Unknown error occurred'));
            }
          },
        error: function() {
          console.log("[Error]: There was an error receiving the response from /changePass")
          reject('[Error]: Internal server error');
        }
      });
    });
  }

  function getPosts(accountID) {
    return new Promise(function(resolve, reject) {
      jQuery.ajax({
        type: 'GET',
        url: `/sortPosts`,
        data: {
          "sortMethod": localStorage.getItem("postSorting"),
          "filters": JSON.parse(localStorage.getItem(JSON.stringify("postFilters")))
        },
        success: function(response) {
          if (response.code == 200) {
            resolve(response.posts);
          } else if (response.code == 500) {
            reject(new Error('Internal server error'));
          } else {
            reject(new Error('Unknown error occurred'));
          }
        },
        error: function() {
          console.log("[Error]: There was an error receiving the response from /changePass");
          reject(new Error('Internal server error'));
        }
      });
    });
  }



  function sortPosts(sortingMethod, displayMethod) {
    if (sortingMethod != '') {
      localStorage.setItem("postSorting", sortingMethod);
    }
    if (displayMethod != '') {
      localStorage.setItem("postDisplay", displayMethod);
    }
  
    Promise.all([
      new Promise((resolve, reject) => {
        if (document.cookie != "") {
          const cookies = document.cookie.split(";");
          getVotes(cookies[0].split("=")[1])
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
        } else {
          resolve([[], []]);
        }
      }),
      getPosts()
    ])
    .then(([votes, posts]) => {
      const likedPosts = votes[0];
      const dislikedPosts = votes[1];
  
      if (typeof posts !== 'undefined') {
        let container = document.getElementById('resultedPosts');
        container.innerHTML = '';
  
        const displayMe = localStorage.getItem("postDisplay");
  
        posts.forEach((post) => {
          let postElement = document.createElement('div');
          let likedPost = '';
          let dislikedPost = '';
  
          if (likedPosts.indexOf(post.id) != -1) {
            likedPost = 'style="color: blue"';
          } else if (dislikedPosts.indexOf(post.id) != -1) {
            dislikedPost = 'style="color: red"';
          }
          if (displayMe == 'compact') {
            postElement.innerHTML = ` <h2>${post.title}</h2>
            <p><a href="/posts/${post.id}">${post.content}</a></p>
            <button id="${post.id}_LikeButton" type="button" onclick="voteFunction(${post.id},1)" ${likedPost}>Like</button>
            <button id="${post.id}_DislikeButton" type="button" onclick="voteFunction(${post.id},-1)"  ${dislikedPost}>Dislike</button>`;
          } else if (displayMe == 'card') {
            postElement.innerHTML = ` <h2>${post.title}</h2>
            <p><a href="/posts/${post.id}">${post.content}</a></p>
            <button id="${post.id}_LikeButton" type="button" onclick="voteFunction(${post.id},1)" ${likedPost}>Like</button>
            <button id="${post.id}_DislikeButton" type="button" onclick="voteFunction(${post.id},-1)"  ${dislikedPost}>Dislike</button>
            <br><br><br><br>`;
          } else {
            postElement.innerHTML = `<h2>${displayMe} is not a valid display method</h2>`;
          }
          container.appendChild(postElement);
        });
      }
    })
    .catch((error) => {
      console.log('[Error]: Failed to get votes or posts', error);
    });
  }



const cFB = document.getElementById("clearFiltersButton");

function checkFilters() {
  const inputs = document.getElementById("postTags").querySelectorAll("input[type='checkbox'][name='filters']");
  let filters = {};
  
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      filters[`filter${i+1}`] = inputs[i].value;
    }
  }

  if (Object.keys(filters).length > 0) {
    cFB.style.display = "flex";
  }
  else if (Object.keys(filters).length == 0) {
    cFB.style.display = "none";
  }

  localStorage.setItem(JSON.stringify("postFilters"), JSON.stringify(filters));
  sortPosts(localStorage.getItem("postSorting"),localStorage.getItem("postDisplay"));
}


function clearFilters() {
  cFB.style.display = "none";
  localStorage.setItem(JSON.stringify("postFilters"), JSON.stringify(""));
  sortPosts(localStorage.getItem("postSorting"),localStorage.getItem("postDisplay"));
}


function displayPosts() {
  const displayCompact = document.getElementById("displayPostsButtonImageCompact");
  const displayCard = document.getElementById("displayPostsButtonImageCard");
  if (displayCompact.style.display == 'flex') {
    displayCompact.style.display = 'none';
    displayCard.style.display = 'flex';
    sortPosts('','card');
  }
  else if (displayCompact.style.display == 'none') {
    displayCard.style.display = 'none';
    displayCompact.style.display = 'flex';
    sortPosts('','compact');
  }
}



/*

const searchTagBar = document.getElementById("searchTag");

searchTagBar.addEventListener("input", function() {
  const labels = document.getElementById("postTags").getElementsByTagName("label");
  const searchText = searchTagBar.value.toLowerCase();

  for (i = 0; i < labels.length; i++) {
    const labelText = labels[i].textContent.toLowerCase();
    if (labelText.includes(searchText)) {
      labels[i].style.display = "block";
    } else {
      labels[i].style.display = "none";
    }
  }
});*/


function gpsPos(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  const acc = position.coords.accuracy;
  setInterval(() => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/location');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ lat, long, acc }));
  }, 3000000);
}








function updateCookies(voteVal) {

  let cookiesArr = document.cookie.split(";");
  const accountIDVal = cookiesArr[0].split("=")[1];

  jQuery.ajax({
    type: 'GET',
    url: '/voteJson',
    data: {
      "accountID": accountIDVal,
      "vote": voteVal
    },
    success: function(response) {
        if (response.code == 200) {
          console.log('yay');
        } 
      },
    error: function() {
      console.log("[Error]: There was an error receiving the response from /voteJson in updateCookies()")
      alert('[Error]: Internal server error');
    }
  });
}




function voteFunction(postIDVal,voteVal) {
  jQuery.ajax({
    type: 'POST',
    url: '/votePost',
    data: {
      "postID": postIDVal,
      "vote": voteVal
    },
    success: function(response) {
        if (response.code == 200) {
          let x = document.getElementById(`${postIDVal}_LikeButton`);
          let y = document.getElementById(`${postIDVal}_DislikeButton`);

          if (voteVal == 1) {
            if (x.style.color == '') {
              x.style.color = 'blue';
              y.style.color = '';
            }
            else {
              x.style.color = '';
            }
          }
          else if (voteVal == -1) {
            if (y.style.color == '') {
              y.style.color = 'red';
              x.style.color = '';
            }
            else {
              y.style.color = '';
            }
          }


          updateCookies(voteVal);
        } 
        else if (response.code == 401) {
          alert('You need to be signed in to like a post');
        } 
      },
    error: function() {
      console.log("[Error]: There was an error receiving the response from /votePost in voteFunction()")
      alert('[Error]: Internal server error');
    }
  });
}


window.onload = function() {
  localStorage.setItem(JSON.stringify("postFilters"), JSON.stringify(""));
  localStorage.setItem("postSorting", 'recommendedPosts');
  localStorage.setItem("postDisplay", 'compact');
  sortPosts(localStorage.getItem("postSorting"),localStorage.getItem("postDisplay"));


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(gpsPos);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
};
