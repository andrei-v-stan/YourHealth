
function searchChange(searchType) {
  const options = searchType.options;
  if (options[0].value == "option0") {
      searchType.style.fontSize = "18px";
  }

  const searchInput = document.getElementById('searchBoxInput');
  const searchSorting = document.getElementById('sortMethod');
  const searchTags = document.getElementById('postsTags');
  switch (options[searchType.selectedIndex].value) {
    case 'postTitle':
      searchInput.placeholder = "Search for titles...";
      searchSorting.style.display = "flex";
      searchTags.style.display = "flex";
      break;
    case 'postContent':
      searchInput.placeholder = "Search for content...";
      searchSorting.style.display = "flex";
      searchTags.style.display = "flex";
      break;
    case 'users':
      clearTags();
      searchInput.placeholder = "Search for users...";
      searchSorting.style.display = "none";
      searchTags.style.display = "none";
      break;
    default:
      searchInput.placeholder = "Search for something...";
      searchSorting.style.display = "none";
      searchTags.style.display = "none";
  }
}


function filterTags() {
  const searchInput = document.getElementById('searchTag').value.toLowerCase();
  const tagOptions = document.getElementById('tagsContainer').querySelectorAll('label');

  for (i = 0; i < tagOptions.length; i++) {
    const optionText = tagOptions[i].textContent.toLowerCase();

    if (optionText.indexOf(searchInput) > -1) {
      tagOptions[i].style.display = 'flex';
    } else {
      tagOptions[i].style.display = 'none';
    }
  }
}

  
function handleDropDownTags(event, dropdown) {
  const dropdownButton = document.getElementById('postsTags');
  if (!dropdownButton.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.display = "none";
    document.removeEventListener('click', handleDropDownTags);
  }
}

function showTags(event) {
  let dropdown = document.getElementById('dropdownTags');
  if (dropdown.style.display === "flex") {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "flex";
    document.addEventListener('click', function(event) {
      handleDropDownTags(event, dropdown);
    });
  }
}


function toggleBoxSplit(action) {
  const tagsContainer = document.getElementById('chosenTags');
  const boxSplit = document.getElementById('tagBoxSplit');
  const clearBox = `<div id="tagBox_Clear" class="tagBox" onclick="clearTags()">Clear Tags</div>`;
  if (tagsContainer.innerHTML.trim() == "" && action == "add") {
      boxSplit.style.display = "flex";
      tagsContainer.innerHTML += clearBox;
  }
  else if ((tagsContainer.innerHTML.trim() === clearBox || tagsContainer.innerHTML.trim() === "") && action === "remove") {
      boxSplit.style.display = "none";
      tagsContainer.innerHTML = "";
  }
}


function checkLabel(labelID) {
  const label = document.getElementById(labelID);
  const input = label.querySelector('input');
  if (label.classList.contains('checkedLabel')) {
      label.classList.remove('checkedLabel');
      document.getElementById(("tagBox_" + input.id.split("_").slice(1).join(''))).remove();
      toggleBoxSplit("remove");
  }
  else {
      toggleBoxSplit("add");
      label.classList.add('checkedLabel');
      document.getElementById('chosenTags').innerHTML += `
      <div id="tagBox_${input.value}" class="tagBox" onclick="removeTagBox(this)">
          ${input.value}
          <span>&times;</span>
      </div>`;
  }
}

function removeTagBox(tagBox) {
  tagBox.remove();
  const input = document.getElementById(("ddElem_" + tagBox.id.split("_").slice(1).join('')))
  const label = input.parentNode;
  if (label.classList.contains('checkedLabel')) {
      label.classList.remove('checkedLabel');
  }
  toggleBoxSplit("remove");
}

function clearTags() {
  const tagsContainer = document.getElementById('tagsContainer');
  const labels = tagsContainer.querySelectorAll('label');
  labels.forEach(label => {
    const input = label.querySelector('input');
    label.classList.remove('checkedLabel');
  });

  const tagBoxesContainer = document.getElementById('chosenTags');
  tagBoxesContainer.innerHTML = '';  
  toggleBoxSplit("remove");
}





function handleSearchFor(event) {
const searchFor = document.getElementById('searchType');
searchFor.style.backgroundColor = "#ffffff";
searchFor.removeEventListener('change', handleSearchFor);
}

function handleInputDetails(event) {
const inputDetails = document.getElementById('searchBoxInput');
inputDetails.style.backgroundColor = "#ffffff";
inputDetails.removeEventListener('input', handleInputDetails);
}

function searchPosts() {
  let searchFor = document.getElementById('searchType');
  let inputDetails = document.getElementById('searchBoxInput');

  if (searchFor.value == "") {
    searchFor.style.backgroundColor = "#c47171";
    searchFor.addEventListener('change', handleSearchFor);
  }
  else {
    searchFor.removeEventListener('change', handleSearchFor);
    searchFor = searchFor.value;
    inputDetails = inputDetails.value;

    let sortingMethod = document.getElementById('sortMethod').value;
    if (sortingMethod == "") {
      sortingMethod = "recommendedPosts";
    }

    let divTags = document.getElementById("chosenTags").getElementsByTagName("div");
    let divIDs = [];
    for (i = 1; i < divTags.length; i++) {
      divIDs.push(divTags[i].id.split("_").slice(1).join(''));
    }
    document.getElementById('topNavbarSearch').value = inputDetails;
    localStorage.setItem("postInput", inputDetails.toLowerCase());
    localStorage.setItem("postSearchFor", searchFor);
    localStorage.setItem("postSortMethod", sortingMethod);
    if (divIDs.length > 0) {
      localStorage.setItem("postFilters", JSON.stringify(divIDs));
    } else {
      localStorage.removeItem("postFilters");
    }
    getPosts();
  }
}





function getCookie(name) {
  const allCookies = document.cookie.split(';');
  for (let i = 0; i < allCookies.length; i++) {
    const selectedCookie = allCookies[i].trim();
    if (selectedCookie.startsWith(name + '=')) {
      return selectedCookie.substring(name.length + 1);
    }
  }
  return null;
}


function getPostTime(postDate) {
  const nowDate = new Date();

  const diff = Math.abs(postDate - nowDate);
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  let resDiff = "";
  if (years > 0) {
    resDiff = years + " year" + (years > 1 ? "s" : "") + " ago";
  } 
  else if (months > 0) {
    resDiff = months + " month" + (months > 1 ? "s" : "") + " ago";
  } 
  else if (days > 0) {
    resDiff = days + " day" + (days > 1 ? "s" : "") + " ago";
  } 
  else if (hours > 0) {
    resDiff = hours + " hour" + (hours > 1 ? "s" : "") + " ago";
  } 
  else if (mins > 0) {
    resDiff = mins + " minute" + (mins > 1 ? "s" : "") + " ago";
  } 
  else {
    resDiff = "Just now";
  }

  return resDiff;
}


function getUserNames(authorIDs) {
  return new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: "/getUserNames",
      data: { authorIDs: authorIDs },
      success: function(response) {
        if (response.code == 200) {
          resolve(response.users);
        } 
        else if (response.code == 500) {
          alert("[Error]: Internal server error");
          reject(new Error("[Error]: " + response.errorText));
        } 
        else {
          alert("[Error]: Internal server error");
          reject(new Error("[Error]: There has been an error receiving the response from /getUserNames"));
        }
      },
      error: function() {
        alert("[Error]: Internal server error");
        reject(new Error("[Error]: There has been an error parsing and receiving data from /getUserNames"));
      }
    });
  });
}

function getPostTags(postIDs) {
  return new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: "/getPostTags",
      data: { postIDs: postIDs },
      success: function(response) {
        if (response.code == 200) {
          resolve(response.tags);
        } 
        else if (response.code == 500) {
          alert("[Error]: Internal server error");
          reject(new Error("[Error]: " + response.errorText));
        } 
        else {
          alert("[Error]: Internal server error");
          reject(new Error("[Error]: There has been an error receiving the response from /getPostTags"));
        }
      },
      error: function() {
        alert("[Error]: Internal server error");
        reject(new Error("[Error]: There has been an error parsing and receiving data from /getPostTags"));
      }
    });
  });
}










function getPostsData(accountID) {

  const promiseVotes = new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: "/getVotes",
      data: {
        accountID: accountID
      },
      success: function(response) {
        if (response.code == 200) {
          resolve(response.votes);
        } 
        else if (response.code == 500) {
          reject(new Error(response.errorText));
          alert("Internal server error");
        } 
        else {
          reject(new Error("[Error]: There has been an error receiving the response from /getVotes"));
          alert("Internal server error");
        }
      },
      error: function() {
        reject(new Error("[Error]: There has been an error parsing and receiving data from /getVotes"));
        alert("[Error]: Internal server error");
      }
    });
  });


  let bookmarkData;
  const promiseBookmarks = new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: "/getBookmarks",
      data: {
        accountID: accountID
      },
      success: function(response) {
        if (response.code == 200) {
          resolve(response.bookmarkData);
        } 
        else if (response.code == 500) {
          reject(new Error(response.errorText));
          alert("Internal server error");
        } 
        else {
          reject(new Error("[Error]: There has been an error receiving the response from /getBookmarks"));
          alert("Internal server error");
        }
      },
      error: function() {
        reject(new Error("[Error]: There has been an error parsing and receiving data from /getBookmarks"));
        alert("[Error]: Internal server error");
      }
    });
  });


  const promiseHidden = new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: "/getHidden",
      data: {
        accountID: accountID
      },
      success: function(response) {
        if (response.code == 200) {
          resolve(response.hiddenData);
        } 
        else if (response.code == 500) {
          reject(new Error(response.errorText));
          alert("Internal server error");
        } 
        else {
          reject(new Error("[Error]: There has been an error receiving the response from /getHidden"));
          alert("Internal server error");
        }
      },
      error: function() {
        reject(new Error("[Error]: There has been an error parsing and receiving data from /getHidden"));
        alert("[Error]: Internal server error");
      }
    });
  });


  const inputDetails = localStorage.getItem("postInput");
  const searchFor = localStorage.getItem("postSearchFor");
  const sortingMethod = localStorage.getItem("postSortMethod");
  const storedData = localStorage.getItem("postFilters");

  let divIDs;
  if (storedData) {
    divIDs = JSON.parse(storedData);
  }
  else {
    divIDs = "";
  }


  const promiseContent = new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: "/getPosts",
      data: {
        "inputDetails": inputDetails,
        "searchingFor": searchFor,
        "sortMethod": sortingMethod,
        "tagFilters": divIDs
      },
      success: function(response) {
        if (response.code == 200) {
          resolve(response.posts);
        } 
        else if (response.code == 500) {
          reject(new Error(response.errorText));
          alert("Internal server error");
        } 
        else {
          reject(new Error("[Error]: There has been an error receiving the response from /getPosts"));
          alert("Internal server error");
        }
      },
      error: function() {
        reject(new Error("[Error]: There has been an error parsing and receiving data from /getPosts"));
        alert("[Error]: Internal server error");
      }
    });
  });


  return Promise.all([promiseVotes, promiseBookmarks, promiseHidden, promiseContent]);
}

function getPostsDetails(authorIDs,postIDs) {

  const promiseAuthors = new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: "/getUserNames",
      data: {
        authorIDs: authorIDs
      },
      success: function(response) {
        if (response.code == 200) {
          resolve(response.users);
        } 
        else if (response.code == 500) {
          reject(new Error(response.errorText));
          alert("Internal server error");
        } 
        else {
          reject(new Error("[Error]: There has been an error receiving the response from /getUserNames"));
          alert("Internal server error");
        }
      },
      error: function() {
        reject(new Error("[Error]: There has been an error parsing and receiving data from /getUserNames"));
        alert("[Error]: Internal server error");
      }
    });
  });

  const promisePostTags = new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: "/getPostTags",
      data: {
        postIDs: postIDs
      },
      success: function(response) {
        if (response.code == 200) {
          resolve([response.postsTags, response.tags]);
        } 
        else if (response.code == 500) {
          reject(new Error(response.errorText));
          alert("Internal server error");
        } 
        else {
          reject(new Error("[Error]: There has been an error receiving the response from /getPostTags"));
          alert("Internal server error");
        }
      },
      error: function() {
        reject(new Error("[Error]: There has been an error parsing and receiving data from /getPostTags"));
        alert("[Error]: Internal server error");
      }
    });
  });

  return Promise.all([promiseAuthors, promisePostTags]);
}


function getAuthors() {
  const inputDetails = localStorage.getItem("postInput");

  return new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: "/searchUsers",
      data: {
        "inputDetails": inputDetails
      },
      success: function(response) {
        if (response.code == 200) {
          resolve(response.users);
        } 
        else if (response.code == 500) {
          reject(new Error(response.errorText));
          alert("Internal server error");
        } 
        else {
          reject(new Error("[Error]: There has been an error receiving the response from /searchUsers"));
          alert("Internal server error");
        }
      },
      error: function() {
        reject(new Error("[Error]: There has been an error parsing and receiving data from /searchUsers"));
        alert("[Error]: Internal server error");
      }
    });
  });
}












function getPosts() {
  const searchFor = localStorage.getItem("postSearchFor");

  let userSearch;
  if (searchFor == "postTitle" || searchFor == "postContent") {
    userSearch = false;
  }
  else if (searchFor == "users") {
    userSearch = true;
  }


  const accountID = getCookie("accountID");

  if (userSearch == false) {
    getPostsData(accountID)
    .then(postsData => {
      let postIDs = [], authorIDs = [], i = 0, j = 0;
      postsData[3].forEach((post) => {
        postIDs[i] = post.id;
        i++;
        if (!authorIDs.includes(post.authorID)) {
          authorIDs[j] = post.authorID;
          j++;
        }
      });

      return Promise.all([getPostsDetails(authorIDs,postIDs), postsData]);
    })
    .then(([postsDetails, postsData]) => {
      let postsVoteData = postsData[0], postsBookmarkData = postsData[1], postsHiddenData = postsData[2], postsContentData = postsData[3];
      let userDetails = postsDetails[0], tagsSet = postsDetails[1][0], tagsDetails = postsDetails[1][1];

      const postsContainer = document.getElementById("generatedContent");
      postsContainer.innerHTML = "";

      const displayType = localStorage.getItem("postDisplay");
      let likeButtonClass = "upVote", dislikeButtonClass = "downVote", bookmarkDataClass = "postBookmark", hidePostStyle = "flex";

      if (displayType == "card") {
        console.log("card post");
      }
      else {
        postsContentData.forEach((post, dataIndex) => {

          likeButtonClass = "upVote";
          dislikeButtonClass = "downVote";
          for (i = 0; i < postsVoteData.length; i++) {
            if (postsVoteData[i].postID == post.id) {
              if (postsVoteData[i].vote == 1) {
                likeButtonClass = "upVoteActive";
              }
              else if (postsVoteData[i].vote == -1) {
                dislikeButtonClass = "downVoteActive";
              }
              postsVoteData = postsVoteData.filter((_, index) => index !== i);
              break;
            }
          }

          bookmarkDataClass = "postBookmark";
          for (i = 0; i < postsBookmarkData.length; i++) {
            if (postsBookmarkData[i].postID == post.id) {
              bookmarkDataClass = "postBookmark postBookmarkActive"
              postsBookmarkData = postsBookmarkData.filter((_, index) => index !== i);
              break;
            }
          }
  
          hidePostStyle = "flex";
          for (i = 0; i < postsHiddenData.length; i++) {
            if (postsHiddenData[i].postID == post.id) {
              hidePostStyle = "none";
              postsHiddenData = postsHiddenData.filter((_, index) => index !== i);
              break;
            }
          }


          const postDate = new Date(post.creationDate);
          const timeDifference = getPostTime(postDate);

          let userNameSel = "unknown";
          for (i = 0; i < userDetails.length; i++) {
            if (post.authorID == userDetails[i][0]["userID"]) {
              if (userDetails[i][0]["displayname"] == null) {
                userNameSel = userDetails[i][0]["username"];
              }
              else {
                userNameSel = userDetails[i][0]["displayname"];
              }
            }
          }
          
          let tagSpans = "";
          for (i = 0; i < tagsSet[dataIndex].length; i++) {
            let setTagID = tagsSet[dataIndex][i].tagID;
            for (j = 0; j < tagsDetails.length; j++) {
              if (tagsDetails[j][0].id == setTagID) {
                tagSpans += `<span>${tagsDetails[j][0].title}</span>`;
                break;
              }
            }
          }
          

          let postTitle = "";
          if (post.title.length >= 128) {
            const truncatedTitle = post.title.substr(0, 130);
            const lastSpaceIndex = truncatedTitle.lastIndexOf(" ");
            postTitle = truncatedTitle.substring(0, lastSpaceIndex);
            postTitle += " ...";
          } else {
            postTitle = post.title;
          }
          
  
          let postElement = document.createElement("div");
          postElement.id = `${post.id}_postContainer`;
          postElement.className = "postContainer";   
          postElement.style.display = `${hidePostStyle}`;    
          postElement.innerHTML = `
            <div class="postVotes">
              <button class="${likeButtonClass}" id="${post.id}_LikeButton" type="button" onclick="voteFunction(${post.id},1)"></button> 
              <p id="${post.id}_VoteCount">${post.voteCount}</p>
              <button class="${dislikeButtonClass}" id="${post.id}_DislikeButton" type="button" onclick="voteFunction(${post.id},-1)"></button>
            </div>
            <div class="postType">
              <button class="contentType" id="1_LikeButton" type="button" onclick="voteFunction(1,1)"></button>
            </div>
            <div class="postContent">
              <a href="/posts/${post.id}">${postTitle}</a>
              <div class="postTags">${tagSpans}</div>
              <span>Posted by <a href="/users/${post.authorID}">${userNameSel}</a> ${timeDifference}</span>
            </div>
            <div class="postComments">
              <button class="showComments" onclick='window.location.href="/posts/${post.id}"'></button>
              <span>${post.commentCount}</span>
            </div>
            <div class="postOthers">
              <button id="${post.id}_postOthers" class="postMore" onclick="postMoreDropdown(${post.id})"></button>
            </div>
            <div id="${post.id}_postOthersDropdown" class="postOthersDropdown" style="display:none;">
              <button id="${post.id}_bookmarkButton" class="${bookmarkDataClass}" onclick="bookmarkPost(${post.id})" type="button"></button>
              <hr class="otherButtonsSplit">
              <button id="${post.id}_hideButton" class="hidePost" onclick="hidePost(${post.id})"></button>
              <hr class="otherButtonsSplit">
              <button class="postReport" onclick="reportPopup(${post.id})"></button>
              <hr class="otherButtonsSplit">
              <button class="postShare" onclick="copyToClipboard('localhost:3000/posts/${post.id}')"></button>
            </div>`;
          postsContainer.appendChild(postElement);
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
  }


























  else if (userSearch == true) {
    getAuthors(accountID)
    .then(resUsers => {
      const usersContainer = document.getElementById("generatedContent");
      usersContainer.innerHTML = "";
      const displayType = localStorage.getItem("postDisplay");

      if (displayType == "card") {
        console.log("card post");
      }
      else {
        resUsers.forEach((user, dataIndex) => {

          let userData = "";
          if (user.displayName == undefined) {
            userData = `<a href="/users/${user.id}">${user.username}</a>`
          }
          else {
            userData = `
            <a href="/users/${user.id}">${user.displayName}</a>
            <span>${user.username}</span>`;
          }


  
          let userElement = document.createElement("div");
          userElement.id = `${user.userID}_userContainer`;
          userElement.className = "userContainer";     
          userElement.innerHTML = `
            <div class="userContent">
              ${userData}
            </div>
            <div class="userContent">
              <span>User type: ${user.title}</span>
           </div>
            `;
          usersContainer.appendChild(userElement);
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
  }
  else {
    console.log("user / post Search error");
  }





/*



      const postsContainer = document.getElementById("generatedPosts");
      postsContainer.innerHTML = "";
      const displayType = localStorage.getItem("postDisplay");
  
      let likeButtonClass = "upVote";
      let dislikeButtonClass = "downVote";
      let bookmarkDataClass = "postBookmark";
      let hidePostStyle = "flex";

      let authorIDs=[], postIDs=[], j=0, k=0;
      contentData.forEach((post) => {
        if (!authorIDs.includes(post.authorID)) {
          authorIDs[j] = post.authorID;
          j++;
        }
        postIDs[k] = post.id;
        k++;
      });
      

      getUserNames(authorIDs);
      getPostTags(postIDs);
      .then(function(userDetails) {
        if (displayType == "card") {
          contentData.forEach((post) => {
            let postElement = document.createElement("div");
            postElement.className = "postContainer";    
            postElement.innerHTML = `
              <div class="postVotes">
                <button class="upVote" id="${post.id}_LikeButton" type="button" onclick=""></button> 
                <p>${post.voteCount}</p>
                <button class="downVote" id="${post.id}_DislikeButton" type="button" onclick="voteFunction(1,-1)"></button>
              </div>
              <div class="postType">
                <button class="contentType" id="1_LikeButton" type="button" onclick="voteFunction(1,1)"></button>
              </div>
              <div class="postContent">
                <a href="/posts/${post.id}">${post.title}</a>
                <div class="postTags"><span>x</span></div>
                <span>Posted by <a href="/users/${post.authorID}">x</a> on ${post.creationDate}</span>
              </div>
              <div class="postComments">
                <button class="showComments"></button>
                <span>${post.commentCount}</span>
              </div>
              <div class="postOthers">
                <button class="postMore"></button>
              </div>
              <button class="hidePost" id="1_LikeButton" type="button" onclick="voteFunction(1,1)"></button>`;
            postsContainer.appendChild(postElement);
          });
        }
        else {
          contentData.forEach((post) => {
            let postDate = new Date(post.creationDate);
            let timeDifference = getPostTime(postDate);

            let userNameSel;
            for (i = 0; i < userDetails.length; i++) {
              if (post.authorID == userDetails[i][0]["userID"]) {
                if (userDetails[i][0]["displayname"] == null) {
                  userNameSel = userDetails[i][0]["username"];
                }
                else {
                  userNameSel = userDetails[i][0]["displayname"];

                }
              }
            }
    
            likeButtonClass = "upVote";
            dislikeButtonClass = "downVote";
            for (i=0; i<voteData.length; i++) {
              if (voteData[i].postID == post.id) {
                if (voteData[i].vote == 1) {
                  likeButtonClass = "upVoteActive";
                }
                else if (voteData[i].vote == -1) {
                  dislikeButtonClass = "downVoteActive";
                }
                voteData = voteData.filter((_, index) => index !== i);
                break;
              }
            }
            
            bookmarkDataClass = "postBookmark";
            for (i=0; i<bookmarkData.length; i++) {
              if (bookmarkData[i].postID == post.id) {
                bookmarkDataClass = "postBookmark postBookmarkActive"
                bookmarkData = bookmarkData.filter((_, index) => index !== i);
                break;
              }
            }
    
            hidePostStyle = "flex";
            for (i=0; i<hiddenData.length; i++) {
              if (hiddenData[i].postID == post.id) {
                hidePostStyle = "none";
                hiddenData = hiddenData.filter((_, index) => index !== i);
                break;
              }
            }
    
            let postElement = document.createElement("div");
            postElement.id = `${post.id}_postContainer`;
            postElement.className = "postContainer";   
            postElement.style.display = `${hidePostStyle}`;    
            postElement.innerHTML = `
              <div class="postVotes">
                <button class="${likeButtonClass}" id="${post.id}_LikeButton" type="button" onclick="voteFunction(${post.id},1)"></button> 
                <p id="${post.id}_VoteCount">${post.voteCount}</p>
                <button class="${dislikeButtonClass}" id="${post.id}_DislikeButton" type="button" onclick="voteFunction(${post.id},-1)"></button>
              </div>
              <div class="postType">
                <button class="contentType" id="1_LikeButton" type="button" onclick="voteFunction(1,1)"></button>
              </div>
              <div class="postContent">
                <a href="/posts/${post.id}">${post.title}</a>
                <div class="postTags"><span>x</span></div>
                <span>Posted by <a href="/users/${post.authorID}">${userNameSel}</a> on ${timeDifference}</span>
              </div>
              <div class="postComments">
                <button class="showComments"></button>
                <span>${post.commentCount}</span>
              </div>
              <div class="postOthers">
                <button id="${post.id}_postOthers" class="postMore" onclick="postMoreDropdown(${post.id})"></button>
              </div>
              <div id="${post.id}_postOthersDropdown" class="postOthersDropdown" style="display:none;">
                <button id="${post.id}_bookmarkButton" class="${bookmarkDataClass}" onclick="bookmarkPost(${post.id})" type="button"></button>
                <hr class="otherButtonsSplit">
                <button id="${post.id}_hideButton" class="hidePost" onclick="hidePost(${post.id})"></button>
                <hr class="otherButtonsSplit">
                <button class="postReport"></button>
                <hr class="otherButtonsSplit">
                <button class="postShare"></button>
              </div>`;
            postsContainer.appendChild(postElement);
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    }
    else if (userSearch == true) {
      console.log("usersCase");
    }
*/
}



function voteFunction(postID,vote) {
  jQuery.ajax({
    type: 'POST',
    url: '/votePost',
    data: {
      "userID": getCookie('accountID'),
      "postID": postID,
      "vote": vote
    },
    success: function(response) {
        if (response.code == 200) {
          let likeButton = document.getElementById(`${postID}_LikeButton`);
          let dislikeButton = document.getElementById(`${postID}_DislikeButton`);
          let voteCount = document.getElementById(`${postID}_VoteCount`);

          if (response.voteResult == 1) {
            if (likeButton.classList.contains('upVote')) {
              likeButton.classList.replace('upVote', 'upVoteActive');
            }
            if (dislikeButton.classList.contains('downVoteActive')) {
              dislikeButton.classList.replace('downVoteActive', 'downVote');
            }
          }
          else if (response.voteResult == -1) {
            if (likeButton.classList.contains('upVoteActive')) {
              likeButton.classList.replace('upVoteActive', 'upVote');
            }
            if (dislikeButton.classList.contains('downVote')) {
              dislikeButton.classList.replace('downVote', 'downVoteActive');
            }
          }
          else {
            if (likeButton.classList.contains('upVoteActive')) {
              likeButton.classList.replace('upVoteActive', 'upVote');
            }
            if (dislikeButton.classList.contains('downVoteActive')) {
              dislikeButton.classList.replace('downVoteActive', 'downVote');
            }
          }

          voteCount.textContent = response.countResult[0].voteCount;
        } 
        else if (response.code == 500) {
          console.log(response.errorText);
          alert("[Error]: " + response.errorText);
        }
        else {
          console.log("[Error]: There has been an error receiving the response from /votePost")
          alert("[Error]: Internal server error");
        }
      },
    error: function() {
      console.log("[Error]: There was an error receiving the response from /votePost in voteFunction()")
      alert('[Error]: Internal server error');
    }
  });
}



let listenerDropdownElem = "";
let dropdownElemButton = "";
function postMoreDropdown(postID) {
  
  if (listenerDropdownElem != document.getElementById(`${postID}_postOthersDropdown`) && listenerDropdownElem != "") {
    listenerDropdownElem.style.display = "none";
    dropdownElemButton.classList.remove('postMoreActive');
    document.removeEventListener('click', handleDropdownButtons);
  }

  listenerDropdownElem = document.getElementById(`${postID}_postOthersDropdown`);
  if (listenerDropdownElem.style.display == "none") {
    listenerDropdownElem.style.display = "flex";
    dropdownElemButton = document.getElementById(`${postID}_postOthers`);
    dropdownElemButton.classList.add('postMoreActive');
    setTimeout(() => {
      document.addEventListener('click', handleDropdownButtons);
    }, 100);
  }
  else {
    listenerDropdownElem.style.display = "none";
    dropdownElemButton.classList.remove('postMoreActive');
  }
}

function handleDropdownButtons(event) {
  if (!event.target.closest('listenerDropdownElem')) {
    listenerDropdownElem.style.display = "none";
    dropdownElemButton.classList.remove('postMoreActive');
  }
  document.removeEventListener('click', handleDropdownButtons);
}








function resetSearch() {
  localStorage.setItem("postInput", "");
  localStorage.setItem("postSearchFor", "postTitle");
  localStorage.setItem("postSortMethod", "recommendedPosts");
  localStorage.setItem("postFilters", []);

  localStorage.getItem("postDisplay", "compact");
}
























window.addEventListener('load', function handleWindowLoad() {
  getFilters();
  resetSearch();

  getPosts();


  setTimeout(() => {
    window.removeEventListener('load', handleWindowLoad);
  }, 100);
});






