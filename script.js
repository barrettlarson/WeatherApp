text = document.getElementById('text');

// Prevent scrolling in textarea
text.addEventListener('input', () => {
    text.scrollLeft = text.scrollWidth;
});

// Enter key to act as button click
text.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        event.preventDefault();
        getData();
    }
});

// Function to create and append elements
function createAndAppend(parent, tag, content = '', attirbutes = {}) {
    const element = document.createElement(tag);
    element.textContent = content;
    for (const [key, value] of Object.entries(attirbutes)) {
        element.setAttribute(key, value);
    }
    parent.append(element);
    return(element);
}

// Display weather icon dependent on current weather conditions
function getWeatherIcon(condition) {
    if(condition.includes('Snow')) return 'images/snow.png';
    if(condition.includes('Rain')) return 'images/rain.png';
    if(condition.includes('Overcast')) return 'images/overcast.png';
    if(condition.includes('Partially')) return 'images/partly-cloudy.png';
    if(condition.includes('torms')) return 'imgaes/lightning.png';
    return 'images/sun.png';

}

// Fetch data and dynamically build elements
async function getData () {
    city = text.value.trim();
    city = city.replace(/\s/g, "%20");
    api_key = 'ENTER YOUR API KEY HERE';
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}%2CNY?unitGroup=us&key=${api_key}&contentType=json`;

    try {
        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`Response status ${response.status}`);
        }

        const json = await response.json();
        console.log(json);

        const elements = ['.rop', '.picture', '.right', '.first', '.second', '.third', '.fourth', '.fifth'];
        elements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = '';
            }
        })

        // Days of the week
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date(`${json.days[0].datetime}T00:00:00`);
        const dayOfWeek = date.getDay();

        const rop = document.querySelector('.rop');
        const loco = `${json.address.substring(0, json.address.indexOf(","))}`;

        createAndAppend(rop, 'p', loco);
        createAndAppend(rop, 'p', `${json.currentConditions.temp}°F`);
        createAndAppend(rop, 'p', days[dayOfWeek]);

        const picture = document.querySelector('.picture');
        console.log(json.currentConditions.icon);
        if(json.currentConditions.icon.indexOf("partly-cloudy-day") > -1) {
            createAndAppend(picture, 'img', '', { src: "images/partly-cloudy.png" });
        }
        else if(json.currentConditions.icon.indexOf("rain") > -1) {
            createAndAppend(picture, 'img', '', { src: "images/rain.png" });
        }
        else if(json.currentConditions.icon.indexOf("partly-cloudy-night") > -1) {
            createAndAppend(picture, 'img', '', { src: "images/partly-cloudy-night.png" });
        }
        else if(json.currentConditions.icon.indexOf("clear-night") > -1) {
            createAndAppend(picture, 'img', '', { src: "images/clear-night.png" });
        }
        else if(json.currentConditions.icon.indexOf("cloudy") > -1) {
            createAndAppend(picture, 'img', '', { src: "images/overcast.png" });
        }
        else {
            createAndAppend(picture, 'img', '', { src: 'images/sun.png' });
        }
    
        const right = document.querySelector('.right');
        createAndAppend(right, 'p', `Precipitation: ${json.currentConditions.precipprob}%`);
        createAndAppend(right, 'p', `Humidity: ${json.currentConditions.humidity}%`);
        createAndAppend(right, 'p', `${json.currentConditions.windspeed} m/s`);

        const dayContainers = [".first", ".second", ".third", ".fourth", ".fifth"];
        dayContainers.forEach((selector, index) => {
            const element = document.querySelector(selector);
            const forecastDay = (dayOfWeek + index + 1) % days.length;
            const condition = json.days[index + 1].conditions;
            const iconSrc = getWeatherIcon(condition);

            createAndAppend(element, 'p', days[forecastDay]);
            createAndAppend(element, 'img', '', { src: iconSrc });
            createAndAppend(element, 'p', `${json.days[index + 1].tempmax}°/${json.days[index + 1].tempmin}°F`);
        });

    } catch (error) {
        console.log(error.message);
    }
}
