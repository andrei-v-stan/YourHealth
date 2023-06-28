
async function preciseLocationMap(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const apiKey = 'AIzaSyAiwCtIK0N-dXk1-gVsRtpKlRy2cmGG63k';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const locationData = await response.json();

    if (locationData.status == 'OK') {
      return { success: true, location: locationData.results[1].geometry.location, data: locationData };
    } 
    else {
      return { success: false, location: { latitude, longitude }, data: '' };
    }
  } 
  catch (error) {
    alert("[Error]: There has been an error receiving the response from /preciseLocation")
    console.log("[Error]: " + error);
    return { success: false, location: { latitude, longitude }, data: '' };
  }
}


async function setLocationMap(position) {
  try {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    let acc = position.coords.accuracy;

    const { success, location, data } = await preciseLocationMap(position);

    if (success) {
      lat = location.lat;
      lng = location.lng;
      acc = 1.000;
    }

    return { latitude: lat, longitude: lng, accuracy: acc };

  } catch (error) {
    console.log(error);
  }
}


function checkLocationMap() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const result = await setLocationMap(position);
        resolve(result);
      }, (error) => {
        reject(error);
      });
    } 
    else {
      reject("Location tracking must be enabled to use this website");
    }
  });
}




let openInfoWindow = null;
let currentInfoWindow = null;

function markMedical(medicalInfo, map, pinIcon) {
  var marker = new google.maps.Marker({
    position: medicalInfo.location,
    map: map,
    title: medicalInfo.name,
    icon: pinIcon
  });

  var infoWindow = new google.maps.InfoWindow({
    content: createInfoWindowContent(medicalInfo)
  });

  marker.addListener('click', function() {
    if (openInfoWindow) {
      openInfoWindow.close();
    }
    infoWindow.open(map, marker);
    openInfoWindow = infoWindow;
    currentInfoWindow = infoWindow;
  });

  map.addListener('click', function() {
    if (currentInfoWindow) {
      currentInfoWindow.close();
      currentInfoWindow = null;
    }
  });
}

function createInfoWindowContent(medicalInfo) {
  
  let rating;
  if (!medicalInfo.rating) {
    rating = "No reviews";
  }
  else {
    rating = medicalInfo.rating;
  }


  const content = `
  <div class=infoWindow>
    <a href="https://www.google.com/maps/place/?q=place_id:${medicalInfo.place_id}"> <h3> ${medicalInfo.name} </h3> </a>
    <p>Rating: ${rating} </p>
  </div>
  `;
  return content;
}

let firstInit = false;

async function initMap() {
  try {
    let radiusNr = 50000;

    if (firstInit == true) {
      if (document.getElementById("mapRadiusType").innerHTML == "Kilometers") {
        radiusNr = document.getElementById("mapRadiusVal").value * 1000;
      }
      else {
        radiusNr = document.getElementById("mapRadiusVal").value;
      }
    }
    else {
      firstInit = true;
    }

    const location = await checkLocationMap();

    let map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: location.latitude, lng: location.longitude },
      zoom: 15,
    });


    const googlePin = "../Resources/map/googleMapPin.png";
    let locationDetails = [
      {
        name: 'The University of Alexandru Ioan Cuza',
        location: {lat: 47.174293, lng: 27.571675},
        hours: '8AM to 8PM',
        place_id: '0'
      },
      {
        name: 'Faculty of Computer Science Iasi',
        location: {lat: 47.173934, lng: 27.574717},
        hours: '8AM to 8PM',
        place_id: '0'
      }
    ];

    locationDetails.forEach(function(medical) {
      markMedical(medical,map,googlePin);
    });
  
  

    const service = new google.maps.places.PlacesService(map);
    
    const reqDoctor = {
      location: { lat: location.latitude, lng: location.longitude },
      radius: radiusNr,
      type: 'doctor'
    };

    const doctorPin = "../Resources/map/doctorPin.png";
    service.nearbySearch(reqDoctor, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(function(place) {
          var medical = {
            name: place.name,
            location: place.geometry.location,
            rating: place.rating,
            place_id: place.place_id
          };
          locationDetails.push(medical);
          markMedical(medical,map,doctorPin);
        });
      }
    });

    const reqHospital = {
      location: { lat: location.latitude, lng: location.longitude },
      radius: radiusNr,
      type: 'hospital'
    };

    const hospitalPin = "../Resources/map/hospitalPin.png";    
    service.nearbySearch(reqHospital, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(function(place) {
          var medical = {
            name: place.name,
            location: place.geometry.location,
            rating: place.rating,
            place_id: place.place_id
          };
          locationDetails.push(medical);
          markMedical(medical,map,hospitalPin);
        });
      }
    });


  } catch (error) {
    console.log(error);
  }
}


function checkRadiusVal(usage) {
  const intervalNr = document.getElementById("mapRadiusVal");
  const intervalButton = document.getElementById("mapRadiusType");
  
  let valid = true;

  if (intervalButton.innerHTML == "Meters") {
    if (intervalNr.value < 1 || intervalNr.value > 50000) {
      intervalNr.style.backgroundColor = "#f08b8b";
      valid = false;
    }
    else {
        intervalNr.style.backgroundColor = "";
    }
  }
  else if (intervalButton.innerHTML == "Kilometers") {
    if (intervalNr.value < 1 || intervalNr.value > 50) {
      intervalNr.style.backgroundColor = "#f08b8b";
      valid = false;
    }
    else {
        intervalNr.style.backgroundColor = "";
    }
  }

  if (usage == true) {
    return valid;
  }
}

function changeRadiusType() {
  const intervalButton = document.getElementById("mapRadiusType");
  if (intervalButton.innerHTML == "Meters") {
    intervalButton.innerHTML = "Kilometers"
  }
  else {
    intervalButton.innerHTML = "Meters"
  }
}

function updateMap() {
  if (checkRadiusVal(true)) {
    initMap();
  }
}

