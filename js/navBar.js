
function handleTopNavbar(event) {
    const topNavbarSearch = document.getElementById('topNavbarSearch');
    const searchTopNavbar = document.getElementById('searchTopNavbar');
    if (!event.target.closest('#searchTopNavbar') && !topNavbarSearch.contains(event.target) && !event.target.closest('.tagBox')) {    
        document.getElementById('dropdownTags').style.display = "none";
        searchTopNavbar.classList.add('inactive');
        searchTopNavbar.addEventListener('animationend', function() {
            searchTopNavbar.removeEventListener('animationend', arguments.callee);
            searchTopNavbar.style.display = "none";
            searchTopNavbar.classList.remove('active');
        });
        document.removeEventListener('click', handleTopNavbar);
    }
  }

function toggleSearch() {
    const searchTopNavbar = document.getElementById('searchTopNavbar');
    if (!searchTopNavbar.classList.contains('active')) {
        searchTopNavbar.style.display = "flex";
        searchTopNavbar.classList.add('active');
        if (searchTopNavbar.classList.contains('inactive')) {
            searchTopNavbar.classList.remove('inactive');
        }
        document.addEventListener('click', handleTopNavbar);
    }
}  


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



function getFilters() {
    jQuery.ajax({
        type: 'GET',
        url: `/getFilters`,
        success: function(response) {
            if (response.code == 200) {
                tags = response.tags;
                if (typeof tags !== 'undefined') {
                    let container = document.getElementById('tagsContainer');
                    container.innerHTML = '';

                    tags.forEach((tag) => {
                        let tagElement = document.createElement('label');
                        tagElement.id = `dropdownTag-${tag.id}`;
                        tagElement.innerHTML = `<input id="ddElem_${tag.title}" type="checkbox" name="filters" value="${tag.title}" onclick="checkLabel('dropdownTag-${tag.id}')" >${tag.title}`;
                        container.appendChild(tagElement);
                    });
                }
            } else if (response.code == 500) {
                // handle error
            } else {
                // handle error
            }
        },
        error: function() {
            console.log("[Error]: There was an error receiving the response from /getFilters")
            alert('[Error]: Internal server error');
        }
    });
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
  var searchFor = document.getElementById('searchType');
  var inputDetails = document.getElementById('searchBoxInput');

  if (searchFor.value == "" || inputDetails.value == "") {
    if (searchFor.value == "") {
      searchFor.style.backgroundColor = "#c47171";
      searchFor.addEventListener('change', handleSearchFor);
    }
    else if (inputDetails.value == "") {
      inputDetails.style.backgroundColor = "#c47171";
      inputDetails.addEventListener('input', handleInputDetails);
    }
  }
  else {
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

    getPosts(inputDetails.toLowerCase(),searchFor,sortingMethod,divIDs);
  }
}


function getPosts(inputDetails,searchFor,sortingMethod,divIDs) {
  return new Promise(function(resolve, reject) {
    jQuery.ajax({
      type: 'GET',
      url: `/getPosts`,
      data: {
        "inputDetails": inputDetails,
        "searchingFor": searchFor,
        "sortMethod": sortingMethod,
        "tagFilters": divIDs
      },
      success: function(response) {
        console.log(response);
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




function handleLoginPopup(event) {
  const loginPop = document.getElementById('loginPopup');
  if (!loginPop.contains(event.target) || !event.target.closest(loginPop)) {
    loginPop.style.display = "none";
    document.getElementById('accountForms').style.display = "none";
    document.removeEventListener('click', handleLoginPopup);
  }
}
function loginPopup() {
  document.getElementById('accountForms').style.display = "flex";
  document.getElementById('loginPopup').style.display = "flex";
  setTimeout(() => {
    document.addEventListener('click', handleLoginPopup);
  }, 100);
}











window.onload = function() {
    //localStorage.setItem(JSON.stringify("postFilters"), JSON.stringify(""));
    //localStorage.setItem("postSorting", 'recommendedPosts');
    //localStorage.setItem("postDisplay", 'compact');
    //sortPosts(localStorage.getItem("postSorting"),localStorage.getItem("postDisplay"));
  
    getFilters();
  };
