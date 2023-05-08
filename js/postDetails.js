
function addSubComments(allComments, resultedComments, parentID, commentLevel) {

  commentLevel += 1;

  const subComments = allComments.filter(comment => comment.parentType == "comment" && comment.parentID == parentID);

  subComments.forEach(comment => {
    resultedComments.innerHTML += `
      <div id="commentID_${comment.id}">
        <p>Level ${commentLevel} <a href="/users/${comment.authorID}">${comment.content}</a></p>
        <input type="text" id="postComment" name="comment" placeholder="Write your comment">
        <button onclick="submitComment(${comment.id},'comment')">Post comment</button>
      </div>
    `;
    addSubComments(allComments, resultedComments, comment.id, commentLevel);
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
            console.log(response.comments);
              let likedPost = '';
              let dislikedPost = '';
              let resultedPost = document.getElementById("resultedPost");
              resultedPost.innerHTML = `<h2>${response.post.title}</h2>
              <p><a href="/posts/${response.post.id}">${response.post.content}</a></p>
              <button id="${response.post.id}_LikeButton" type="button" onclick="voteFunction(${response.post.id},1)" ${likedPost}>Like</button>
              <button id="${response.post.id}_DislikeButton" type="button" onclick="voteFunction(${response.post.id},-1)"  ${dislikedPost}>Dislike</button>
              <input type="text" id="postComment" name="comment" placeholder="Write your comment">
              <button onclick="submitComment(${response.post.id},'post')">Post comment</button>
              <div id="resultedComments"></div>`;
        
              let resultedComments = document.getElementById("resultedComments");
              resultedComments.innerHTML = `<h2>Resulted Comments</h2>`;
          
              const postComments = response.comments.filter(comment => comment.parentType == "post");
              postComments.forEach(comment => {
                resultedComments.innerHTML += `
                  <div id="commentID_${comment.id}">
                    <p><a href="/users/${comment.authorID}">${comment.content}</a></p>
                    <input type="text" id="postComment" name="comment" placeholder="Write your comment">
                    <button onclick="submitComment(${comment.id},'comment')">Post comment</button>
                  </div>
                `;
                const commentLevel = 0;
                addSubComments(response.comments, resultedComments, comment.id, commentLevel);
              });
          
            } else if (response.code == 401) {
              alert('You need to be signed in to like a post');
            } 
          },
          
        error: function() {
          console.log("[Error]: There was an error receiving the response from /votePost in voteFunction()")
          alert('[Error]: Internal server error');
        }
      });
}



function getPostData2() {
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
              let likedPost = '';
              let dislikedPost = '';
              let resultedPost = document.getElementById("resultedPost");
              resultedPost.innerHTML = `<h2>${response.post.title}</h2>
              <p><a href="/posts/${response.post.id}">${response.post.content}</a></p>
              <button id="${response.post.id}_LikeButton" type="button" onclick="voteFunction(${response.post.id},1)" ${likedPost}>Like</button>
              <button id="${response.post.id}_DislikeButton" type="button" onclick="voteFunction(${response.post.id},-1)"  ${dislikedPost}>Dislike</button>
              <input type="text" id="postComment" name="comment" placeholder="Write your comment">
              <button onclick="submitComment(${response.post.id},'post')">Post comment</button>
              <div id="resultedComments"></div>`;

              let resultedComments = document.getElementById("resultedComments");

              const postComments = response.comments.filter(comment => comment.parentType == "post");
              postComments.forEach(comment => {
                  resultedComments.innerHTML += `
                      <div id="comment-${comment.id}">
                          <p><a href="/users/${comment.authorID}">${comment.content}</a></p>
                          <input type="text" id="postComment" name="comment" placeholder="Write your comment">
                          <button onclick="submitComment(${comment.id},'comment')">Post comment</button>
                          <div class="child-comments"></div>
                      </div>
                  `;
                  addSubComments(comment, response);
              });

              function addSubComments(parentComment, response) {
                  const subComments = response.comments.filter(comment => comment.parentID == parentComment.id && comment.parentType == "comment");

                  if (subComments.length === 0) {
                      return;
                  }

                  const parentElement = document.getElementById(`comment-${parentComment.id}`).getElementsByClassName('child-comments')[0];

                  subComments.forEach(comment => {
                      const childElement = document.createElement('div');
                      childElement.classList.add('child-comment');
                      childElement.innerHTML = `
                          <div id="comment-${comment.id}">
                              <p><a href="/users/${comment.authorID}">${comment.content}</a></p>
                              <input type="text" id="postComment" name="comment" placeholder="Write your comment">
                              <button onclick="submitComment(${comment.id},'comment')">Post comment</button>
                              <div class="child-comments"></div>
                          </div>
                      `;
                      parentElement.appendChild(childElement);

                      // Recursively add the sub-comments of this comment
                      addSubComments(comment, response);
                  });
              }

          } else if (response.code == 401) {
            alert('You need to be signed in to like a post');
          } 
      },
      error: function() {
        console.log("[Error]: There was an error receiving the response from /votePost in voteFunction()")
        alert('[Error]: Internal server error');
      }
  });
}











function submitComment(parentID,parentType) {

  const cookies = document.cookie.split(";");

  jQuery.ajax({
      type: 'GET',
      url: '/submitComment',
      data: {
        "postID": parentID,
        "parentID": parentID,
        "parentType": parentType,
        "authorID": cookies[0].split("=")[1],
        "content": document.getElementById('postComment').value
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