const createPostBack = document.getElementById('createPostBackground');
const createPostPopTop = document.getElementById('createPostPopupTop');
const createPostPop = document.getElementById('createPostPopup');

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
    const button = document.getElementById("sortPostsButton");
    const buttonText = document.getElementById("sortPostsButtonText");
    const buttonImage = document.getElementById("sortPostsButtonImage");
    const dropdown = document.getElementById("sortPostsDropdown");
  
    if (buttonImage.style.display == "none") {
      buttonText.style.display = "none";
      button.style.backgroundColor = "white";
      buttonImage.style.display = "flex";
      dropdown.style.display = "block";
    } 
    else {
      buttonText.style.display = "flex";
      button.style.backgroundColor = "#553278";
      buttonImage.style.display = "none";
      dropdown.style.display = "none";
    }
  }
  
  function toggleFilter() {
    const button = document.getElementById("filterPostsButton");
    const buttonText = document.getElementById("filterPostsButtonText");
    const buttonImage = document.getElementById("filterPostsButtonImage");
    const dropdown = document.getElementById("filterPostsDropdown");
  
    if (buttonImage.style.display == "none") {
      buttonText.style.display = "none";
      button.style.backgroundColor = "white";
      buttonImage.style.display = "flex";
      dropdown.style.display = "block";
      getFilters();
    } 
    else {
      buttonText.style.display = "flex";
      button.style.backgroundColor = "#553278";
      buttonImage.style.display = "none";
      dropdown.style.display = "none";
    }
  }



  function sortPosts(sortingMethod) {
    jQuery.ajax({
      type: 'GET',
      url: `/sortPosts`,
      data: {
        "sortMethod": sortingMethod,
        "filters": JSON.parse(localStorage.getItem(JSON.stringify("postFilters")))
      },
      success: function(response) {
          if (response.code == 200) {
            posts = response.posts;
            if (typeof posts !== 'undefined') {
              let container = document.getElementById('resultedPosts');
              container.innerHTML = '';

              posts.forEach((post) => {
                let postElement = document.createElement('div');
                postElement.innerHTML = ` <h2>${post.title}</h2>
                                          <p><a href="/posts/${post.id}">${post.content}</a></p>
                                          <button id="${post.id}_LikeButton" type="button" onclick="voteFunction(${post.id},1)">Like</button>
                                          <button id="${post.id}_DislikeButton" type="button" onclick="voteFunction(${post.id},-1)">Dislike</button>`;
                container.appendChild(postElement);
              });
            }

          } 
          else if (response.code == 500) {
          }  
          else {
          }
        },
      error: function() {
        console.log("[Error]: There was an error receiving the response from /changePass")
        alert('[Error]: Internal server error');
      }
    });
}

function getFilters() {
  jQuery.ajax({
    type: 'GET',
    url: `/getFilters`,
    success: function(response) {
        if (response.code == 200) {
          tags = response.tags;
          if (typeof tags !== 'undefined') {
            let container = document.getElementById('postTags');
            container.innerHTML = '';

            tags.forEach((tag) => {
              let tagElement = document.createElement('label');
              tagElement.innerHTML = `<input type="checkbox" name="filters" value="${tag.title}">${tag.title}
                                      <br>`;
              container.appendChild(tagElement);
            });
          }

        } 
        else if (response.code == 500) {
        }  
        else {
        }
      },
    error: function() {
      console.log("[Error]: There was an error receiving the response from /changePass")
      alert('[Error]: Internal server error');
    }
  });
}



function checkFilters() {
  const inputs = document.getElementById("postTags").querySelectorAll("input[type='checkbox'][name='filters']");
  let filters = {};
  
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      filters[`filter${i+1}`] = inputs[i].value;
    }
  }

  localStorage.setItem(JSON.stringify("postFilters"), JSON.stringify(filters));

  jQuery.ajax({
    type: 'GET',
    url: `/filteredPosts`,
    data: filters,
    success: function(response) {
        if (response.code == 200) {
          posts = response.posts;
          if (typeof posts !== 'undefined') {
            let container = document.getElementById('resultedPosts');
            container.innerHTML = '';
            posts.forEach((post) => {
              let postElement = document.createElement('div');
              postElement.innerHTML = ` <h2>${post.title}</h2>
                                        <p><a href="/posts/${post.id}">${post.content}</a></p>
                                        <button id="${post.id}_LikeButton" type="button" onclick="voteFunction(${post.id},1)">Like</button>
                                        <button id="${post.id}_DislikeButton" type="button" onclick="voteFunction(${post.id},-1)">Dislike</button>`;
              container.appendChild(postElement);
            });
          }
        } 
        else if (response.code == 500) {
        }  
        else {
        }
      },
    error: function() {
      console.log("[Error]: There was an error receiving the response from /changePass")
      alert('[Error]: Internal server error');
    }
  });
}







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
});




window.onload = function() {
  sortPosts('recommendedPosts');
  localStorage.setItem(JSON.stringify("postFilters"), JSON.stringify(""));
};