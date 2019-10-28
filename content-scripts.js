function getFilters(settings) {
    let string = '',
        body_filter = '';

    if (settings.bluelight > 0) {
        let bluelight = document.getElementById('night-mode-bluelight') || document.createElement('div');

        bluelight.id = 'night-mode-bluelight';
        bluelight.innerHTML = '<svg version=1.1 xmlns=//www.w3.org/2000/svg viewBox="0 0 1 1"><filter id=bluelight-filter><feColorMatrix type=matrix values="1 0 0 0 0 0 1 0 0 0 0 0 ' + (1 - parseFloat(settings.bluelight) / 100) + ' 0 0 0 0 0 1 0"></feColorMatrix></filter></svg>';

        document.documentElement.appendChild(bluelight);

        body_filter += 'url(#bluelight-filter)';
    } else if (document.getElementById('night-mode-bluelight')) {
        document.getElementById('night-mode-bluelight').remove();
    }

    if (settings.invert_colors === true) {
        string += 'html{background:0 0!important}body{background:#000!important}body [style*="url("],body [style*=background-position],body canvas,body iframe,body img:not([src*="/ic_"]):not([src*=_ic_]):not([class*=icon]),body pre,body video{-webkit-filter:invert(1)!important;filter:invert(1)!important}';
        body_filter += ' invert(1)';
    }

    if (settings.brightness) {
        body_filter += ' brightness(' + settings.brightness + '%)';
    }

    if (settings.contrast) {
        body_filter += ' contrast(' + settings.contrast + '%)';
    }

    if (settings.grayscale) {
        body_filter += ' grayscale(' + settings.grayscale + '%)';
    }

    if (settings.sepia) {
        body_filter += ' sepia(' + settings.sepia + '%)';
    }

    if (settings.saturate) {
        body_filter += ' saturate(' + settings.saturate + '%)';
    }

    string += 'body{-webkit-filter:' + body_filter + ';filter:' + body_filter + ';}';

    return string;
}

function injectStyle(string, id) {
    let element = document.getElementById(id) || document.createElement('style');

    element.textContent = string;
    element.className = 'night-mode-extension-inject';

    if (id) {
        element.id = id;
    }

    document.documentElement.appendChild(element);
}

chrome.storage.local.get(function(object) {
    if (object.websites && object.websites[location.hostname] && object.websites[location.hostname].filters) {
        injectStyle(getFilters(object.websites[location.hostname].filters), 'night-mode-extension-filters');
    }
});

chrome.runtime.onMessage.addListener(function(request, sender) {
    chrome.storage.local.get(function(object) {
        if (object.websites && object.websites[location.hostname] && object.websites[location.hostname].filters) {
            injectStyle(getFilters(object.websites[location.hostname].filters), 'night-mode-extension-filters');
        }
    });
});