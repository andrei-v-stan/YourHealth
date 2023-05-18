
const topNavbarSearch = document.getElementById('topNavbarSearch');
const searchTopNavbar = document.getElementById('searchTopNavbar');

function handleTopNavbar(event) {
    if (!event.target.closest('#searchTopNavbar') && !topNavbarSearch.contains(event.target)) {
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
    const searchSorting = document.getElementById('searchType2');
    const searchTags = document.getElementById('searchType3');
    switch (options[searchType.selectedIndex].value) {
      case 'option1':
        searchInput.placeholder = "Search for titles...";
        searchSorting.style.display = "flex";
        searchTags.style.display = "flex";
        break;
      case 'option2':
        searchInput.placeholder = "Search for content...";
        searchSorting.style.display = "flex";
        searchTags.style.display = "flex";
        break;
      case 'option3':
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
    const dropdownButton = document.getElementById('searchType3');
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
  


function checkLabel(labelID) {
    const label = document.getElementById(labelID);
    const input = label.querySelector('input');
    if (label.classList.contains('checkedLabel')) {
        label.classList.remove('checkedLabel');
        document.getElementById(("tagBox_" + input.id.split("_").slice(1).join(''))).remove();
    }
    else {
        label.classList.add('checkedLabel');
        document.getElementById('chosenTags').innerHTML += `
        <div id="tagBox_${input.value}" onclick="removeTagBox(this)">
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
                    tags.forEach((tag) => {
                        let tagElement = document.createElement('label');
                        tagElement.id = `dropdownTag-${tag.id}`;
                        tagElement.innerHTML = `<input type="checkbox" name="filters" value="${tag.title}" onclick="checkLabel('dropdownTag-${tag.id}')" >${tag.title}`;
                        container.appendChild(tagElement);
                    });
                    tags.forEach((tag) => {
                        let tagElement = document.createElement('label');
                        tagElement.id = `dropdownTag-${tag.id}`;
                        tagElement.innerHTML = `<input type="checkbox" name="filters" value="${tag.title}" onclick="checkLabel('dropdownTag-${tag.id}')" >${tag.title}`;
                        container.appendChild(tagElement);
                    });
                    tags.forEach((tag) => {
                        let tagElement = document.createElement('label');
                        tagElement.id = `dropdownTag-${tag.id}`;
                        tagElement.innerHTML = `<input type="checkbox" name="filters" value="${tag.title}" onclick="checkLabel('dropdownTag-${tag.id}')" >${tag.title}`;
                        container.appendChild(tagElement);
                    });
                    tags.forEach((tag) => {
                        let tagElement = document.createElement('label');
                        tagElement.id = `dropdownTag-${tag.id}`;
                        tagElement.innerHTML = `<input type="checkbox" name="filters" value="${tag.title}" onclick="checkLabel('dropdownTag-${tag.id}')" >${tag.title}`;
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
            console.log("[Error]: There was an error receiving the response from /changePass")
            alert('[Error]: Internal server error');
        }
    });
}













window.onload = function() {
    localStorage.setItem(JSON.stringify("postFilters"), JSON.stringify(""));
    localStorage.setItem("postSorting", 'recommendedPosts');
    localStorage.setItem("postDisplay", 'compact');
    sortPosts(localStorage.getItem("postSorting"),localStorage.getItem("postDisplay"));
  
    getFilters();
  };
