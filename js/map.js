var coffeeLocations = [
    {
        name: "Zingerman's Next Door Café",
        address: "418 Detroit St, Ann Arbor, MI 48104",
        lat: 42.2810,
        lng: -83.7480,
        description: "Iconic Ann Arbor cafe with artisanal coffee and delicious pastries",
        recommendedDrink: "Golden Age Latte"
    },
    {
        name: "Moka & Co",
        address: "333 S Main St, Ann Arbor, MI 48104",
        lat: 42.2780,
        lng: -83.7450,
        description: "European-style cafe with excellent espresso and light bites",
        recommendedDrink: "Iced Latte"
    },
    {
        name: "Teahaus",
        address: "204 N 4th Ave, Ann Arbor, MI 48104",
        lat: 42.28284935456189,
        lng: -83.7470587905091,
        description: "Cozy tea and coffee house with a wide selection of beverages",
        recommendedDrink: "Black Tea"
    },
    {
        name: "Comet Coffee",
        address: "16 Nickels Arcade, Ann Arbor, MI 48104",
        lat: 42.2805,
        lng: -83.7425,
        description: "Small batch roaster with excellent pour-over options",
        recommendedDrink: ""
    },
    {
        name: "Cupsnchai",
        address: "214 S 4th Ave, Ann Arbor, MI 48104",
        lat: 42.2801,
        lng: -83.7475,
        description: "Charming cafe offering coffee and chai with a welcoming atmosphere",
        recommendedDrink: "Dirty Chai; Bonbon"
    }
];

var map;
var markers = [];
var infoWindows = [];

function initMap() {
    var center = { lat: 42.2808, lng: -83.7430 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: center,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
    });

    coffeeLocations.forEach(function(location, index) {
        addMarker(location, index);
        addLocationToList(location, index);
    });

    if (markers.length > 0) {
        var bounds = new google.maps.LatLngBounds();
        markers.forEach(function(marker) {
            bounds.extend(marker.getPosition());
        });
        map.fitBounds(bounds);
    }
}

function addMarker(location, index) {
    var marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
        animation: google.maps.Animation.DROP
    });

    var drinkContent = location.recommendedDrink ? 
        '<p><strong>Recommended Drink:</strong> ' + location.recommendedDrink + '</p>' : '';
    
    var infoWindow = new google.maps.InfoWindow({
        content: '<div class="info-window">' +
                 '<h3>' + location.name + '</h3>' +
                 '<p><strong>Address:</strong> ' + location.address + '</p>' +
                 '<p>' + location.description + '</p>' +
                 drinkContent +
                 '</div>'
    });

    marker.addListener('click', function() {
        infoWindows.forEach(function(iw) {
            iw.close();
        });
        infoWindow.open(map, marker);
        highlightListItem(index);
    });

    markers.push(marker);
    infoWindows.push(infoWindow);
}

function addLocationToList(location, index) {
    var list = document.getElementById('locations-list');
    var listItem = document.createElement('li');
    listItem.className = 'location-item';
    listItem.setAttribute('data-index', index);
    listItem.setAttribute('tabindex', '0');
    listItem.setAttribute('aria-label', 'View ' + location.name + ' on map. Press Enter or Space to select.');
    
    var drinkHtml = location.recommendedDrink ? 
        '<p class="location-drink"><strong>Recommended:</strong> ' + location.recommendedDrink + '</p>' : '';
    
    listItem.innerHTML = 
        '<h4>' + location.name + '</h4>' +
        '<p class="location-address">' + location.address + '</p>' +
        '<p class="location-description">' + location.description + '</p>' +
        drinkHtml;
    
    listItem.addEventListener('click', function() {
        showLocationOnMap(index);
    });
    
    listItem.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showLocationOnMap(index);
        }
    });
    
    list.appendChild(listItem);
}

function showLocationOnMap(index) {
    if (markers[index]) {
        infoWindows.forEach(function(iw) {
            iw.close();
        });
        
        infoWindows[index].open(map, markers[index]);
        map.setCenter(markers[index].getPosition());
        map.setZoom(15);
        highlightListItem(index);
    }
}

function highlightListItem(index) {
    var items = document.querySelectorAll('.location-item');
    items.forEach(function(item) {
        item.classList.remove('active');
    });
    
    var selectedItem = document.querySelector('.location-item[data-index="' + index + '"]');
    if (selectedItem) {
        selectedItem.classList.add('active');
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

window.addEventListener('load', function() {
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        var mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = 
                '<div style="padding: 2rem; text-align: center; background-color: #f2e8c9; border: 2px solid #1c1208; border-radius: 8px;">' +
                '<p><strong>Map Loading Error</strong></p>' +
                '<p>Please check that your Google Maps API key is configured correctly.</p>' +
                '</div>';
        }
    }
});

