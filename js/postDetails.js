

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
          let voteCount = document.getElementById(`postVoteCount`);

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



function addSubComments(allComments, resultedComments, postID, parentID, marginLevel) {

  marginLevel += 10;

  const subComments = allComments.filter(comment => comment.parentType == "comment" && comment.parentID == parentID);

  subComments.forEach(comment => {
    resultedComments.innerHTML += `
    <div id="commentID_${comment.id}" class="commentBox" style="margin-left: ${marginLevel}px;">
      <div class="commentContent">
        <div class="commentText">
          <p>${comment.content} <a href="/users/${comment.authorID}">@user${comment.authorID}</a></p>
        </div>
        <div class="commentActions">
          <input type="text" class="" name="comment" placeholder="Write your comment">
          <button class="postComment" onclick="submitComment(${postID},${comment.id},this.previousElementSibling.value,'comment')"></button>
        </div>
      </div>
    </div>
    `;
    addSubComments(allComments, resultedComments, postID, comment.id, marginLevel);
  });

}



function getPostData() {
    const urlString = window.location.href;
    const postID = urlString.slice(urlString.lastIndexOf('/') + 1);
    
    jQuery.ajax({
        type: 'GET',
        url: '/getPostDetails',
        data: {
          "postID": postID
        },
        success: function(response) {
          if (response.code == 200) {
              let upVoteActive = "upVote", downVoteActive = "downVote";
              if (response.postVote == 1) {
                upVoteActive = "upVoteActive";
              }
              else if (response.postVote == -1) {
                downVoteActive = "downVoteActive";
              }

              const creationDate = new Date(response.postDetails.creationDate);
              const timeDifference = getPostTime(creationDate);

              let tagSpans = "";
              for (i = 0; i < response.postTags.length; i++) {
                tagSpans += `<span>${response.postTags[i].tagTitle}</span>`;
              }


              let resultedPost = document.getElementById("resultedPost");
              resultedPost.innerHTML = `
              <div class="postTop">
                <div class="postVote">
                  <button class="${upVoteActive}" id="${response.postDetails.id}_LikeButton" type="button" onclick="voteFunction(${response.postDetails.id},1)"></button>
                  <span id="postVoteCount">${response.postDetails.voteCount}</span>
                  <button class="${downVoteActive}" id="${response.postDetails.id}_DislikeButton" type="button" onclick="voteFunction(${response.postDetails.id},-1)"></button> 
                </div>
                <div class="postContent">
                  <span class="authorTime">Posted by <a href="/users/${response.postDetails.authorID}">@user${response.postDetails.authorID}</a> ${timeDifference}</span>
                  <h2>${response.postDetails.title}</h2>
                  <div class="postTags">
                      ${tagSpans}
                  </div>
                </div>
              </div>
              <p>${response.postDetails.content}</p>
              <hr class="tagBoxSplit">
              <div class="postMainButtons">
                <button class="postComment"></button>
                <button class="postBookmark"></button>
                <button class="postShare"></button>
                <button class="hidePost"></button>
                <button class="postReport"></button>
              </div>
              <hr class="tagBoxSplit">
              <div class="commentActions">
                <input type="text" class="" name="comment" placeholder="Write your comment">
                <button class="postComment" onclick="submitComment(${response.postDetails.id},${response.postDetails.id},this.previousElementSibling.value,'post')"></button>
              </div>
              <div id="resultedComments"></div>`;
        
              let resultedComments = document.getElementById("resultedComments");
              resultedComments.innerHTML = "";
          
              let marginLevel = 0;
              const postComments = response.postComments.filter(comment => comment.parentType == "post");
              postComments.forEach(comment => {
                resultedComments.innerHTML += `
                <div id="commentID_${comment.id}" class="commentBox" style="margin-left: ${marginLevel}px;">
                  <div class="commentContent">
                    <div class="commentText">
                      <p>${comment.content} <a href="/users/${comment.authorID}">@user${comment.authorID}</a></p>
                    </div>
                    <div class="commentActions">
                      <input type="text" class="" name="comment" placeholder="Write your comment" style="display: flex;">
                      <button class="postComment" onclick="submitComment(${response.postDetails.id},${comment.id},this.previousElementSibling.value,'comment')"></button>
                    </div>
                  </div>
                </div>`;
                const commentLevel = 0;
                addSubComments(response.postComments, resultedComments, response.postDetails.id, comment.id, marginLevel);
              });
          
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










function submitComment(postID,parentID,commentContent,parentType) {

  console.log(postID,parentID,commentContent,parentType)

  jQuery.ajax({
      type: 'GET',
      url: '/submitComment',
      data: {
        "postID": postID,
        "parentID": parentID,
        "parentType": parentType,
        "content": commentContent
      },
      success: function(response) {
          if (response.code == 200) {
              alert("your comment has been posted");
              location.reload();
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
  getPostData();
};