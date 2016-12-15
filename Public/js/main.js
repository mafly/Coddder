document.addEventListener('DOMContentLoaded', function() {
  var $root = document.documentElement;
  var template = $root.dataset.template;

  // Menu: Search
  var $menuItems = document.querySelectorAll('#menu-list li a');

  // Menu: Shadows
  var $menuUl = document.getElementById('menu-list-ul');
  var $menuShadowTop = document.getElementById('menu-shadow-top');
  var $menuShadowBottom = document.getElementById('menu-shadow-bottom');
  var menuThrottle = null;

  $menuUl.addEventListener('scroll', function(event) {
    clearTimeout(menuThrottle);
    throttle = setTimeout(setMenuShadows(), 100);
  });

  function setMenuShadows() {
    var scrollTop = $menuUl.scrollTop;
    var height = $menuUl.offsetHeight;
    var fullHeight = $menuUl.scrollHeight;
    var maxScroll = fullHeight - height;
    var threshold = 200;
    var topFactor = 0;
    var bottomFactor = 1;

    if (scrollTop > threshold) {
      topFactor = 1;
    } else {
      topFactor = scrollTop / threshold;
    }

    if (scrollTop < maxScroll - threshold) {
      bottomFactor = 1;
    } else {
      var fromBottom = maxScroll - scrollTop;
      bottomFactor = fromBottom / threshold;
    }

    $menuShadowTop.style.opacity = topFactor;
    $menuShadowTop.style.transform = 'scaleY(' + topFactor + ')';
    $menuShadowBottom.style.opacity = bottomFactor;
    $menuShadowBottom.style.transform = 'scaleY(' + bottomFactor + ')';
  }
  setMenuShadows();

  // Menu: Mobile
  var $menuNav = document.getElementById('menu-nav');
  var $menuNavOpen = document.getElementById('menu-nav-open');
  var $menuNavClose = document.getElementById('menu-nav-close');

  $menuNavOpen.addEventListener('click', function(event) {
    $menuNav.classList.add('is-active');
  });

  $menuNavClose.addEventListener('click', function(event) {
    $menuNav.classList.remove('is-active');
  });

  Array.prototype.forEach.call($menuItems, function($menuItem, index) {
    $menuItem.addEventListener('click', function(event) {
      if (window.innerWidth < 800) {
        $menuNav.classList.remove('is-active');
      }
    });
  });

  var $menuHello = document.getElementById('menuHello');
  var $huggingFace = document.getElementById('huggingFace');

  setTimeout(function() {
    if (window.carbonLoaded) {
      $menuHello.style.minHeight = '218px';
      $huggingFace.style.display = 'none';
    } else {
      $menuHello.style.minHeight = '0';
      $huggingFace.style.display = 'block';
    }
  }, 0);

  // Property: Share modal
  var $propertyShares = document.querySelectorAll('.property-share');
  var $modalInput = document.getElementById('modal-input');
  var baseURL = '' + window.location.origin + window.location.pathname;
  baseURL = 'http://cssreference.io/';
  var facebookURL = 'https://www.facebook.com/sharer.php?u=http%3A%2F%2Fcssreference.io';
  var twitterURL = 'https://twitter.com/intent/tweet?url=http%3A%2F%2Fcssreference.io&text=CSS%20Reference%3A%20a%20visual%20guide%20to%20the%20most%20popular%20%23CSS%20properties';

  Array.prototype.forEach.call($propertyShares, function($el, index) {
    $el.addEventListener('click', function(e) {
      var propertyName = $el.dataset.propertyName;
      var shareURL = baseURL + '#' + propertyName;
      $modalInput.value = shareURL;
      encodedURL = encodeURIComponent(shareURL);
      facebookURL = 'https://www.facebook.com/sharer.php?u=' + encodedURL;
      twitterURL = buildTwitterURL(encodedURL, propertyName);
      openModal();
    });
  });

  var $modalTwitter = document.getElementById('modal-twitter');
  var $modalFacebook = document.getElementById('modal-facebook');

  $modalTwitter.addEventListener('click', function(event) {
    event.preventDefault();
    window.open(twitterURL);
  });

  $modalFacebook.addEventListener('click', function(event) {
    event.preventDefault();
    window.open(facebookURL);
  });

  // Modal
  var $modalShare = document.getElementById('modal-share');
  var $modalClose = document.getElementById('modal-close');

  $modalShare.addEventListener('click', function(event) {
    event.preventDefault();
    if (event.target === $modalShare) {
      closeModal();
    } else {
      return true;
    }
  });

  $modalClose.addEventListener('click', function(event) {
    event.preventDefault();
    closeModal();
  });

  function openModal() {
    isModaling = true;
    $modalShare.classList.add('is-active');
  }

  function closeModal() {
    isModaling = false;
    $modalShare.classList.remove('is-active');
    facebookURL = 'https://www.facebook.com/sharer.php?u=http%3A%2F%2Fcssreference.io';
    twitterURL = 'https://twitter.com/intent/tweet?url=http%3A%2F%2Fcssreference.io&text=CSS%20Reference%3A%20a%20visual%20guide%20to%20the%20most%20popular%20%23CSS%20properties';
  }
});

// Pure functions
function initializeMatches($menuItems) {
  var matches = [];

  Array.prototype.forEach.call($menuItems, function($el, index) {
    var propertyName = $el.dataset.propertyName;
    matches.push({
      DOMIndex: index,
      propertyName: propertyName,
    });
  });

  return matches;
}

function cleanMenu($menuItems, highlight, selection) {
  Array.prototype.forEach.call($menuItems, function($el, index) {
    if (highlight) {
      $el.innerHTML = $el.dataset.propertyName;
      $el.classList.remove('is-highlighted');
    }
    if (selection) {
      $el.classList.remove('is-selected');
    }
  });
}

function navigateMenu($menuItems, matches, currentIndex, increment = true) {
  Array.prototype.forEach.call($menuItems, function($el, index) {
    $el.classList.remove('is-selected');
  });

  if (matches.length < 1) {
    return -1;
  }

  var desiredIndex = increment ? currentIndex + 1 : currentIndex - 1;
  var actualIndex = limitNumber(desiredIndex, -1, matches.length - 1);

  if (actualIndex > -1) {
    var DOMIndex = matches[actualIndex].DOMIndex;
    $menuItems[DOMIndex].classList.add('is-selected');
  }

  return actualIndex;
}

function highlightQuery($el, propertyName, query) {
  var queryIndex = propertyName.indexOf(query);

  if (queryIndex >= 0) {
    var before = propertyName.substring(0, queryIndex);
    var highlight = '<span class="highlight">' + propertyName.substring(queryIndex, queryIndex + query.length) + '</span>';
    var after = propertyName.substring(queryIndex + query.length);
    $el.innerHTML = before + highlight + after;
    $el.classList.add('is-highlighted');
    return true;
  } else {
    $el.innerHTML = propertyName;
    $el.classList.remove('is-highlighted');
    return false;
  }
}

function limitNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function buildTwitterURL(encodedURL, propertyName) {
  var text = 'Here\'s how ' + propertyName + ' works in #CSS';
  var encodedText = encodeURIComponent(text);
  return 'https://twitter.com/intent/tweet?url=' + encodedURL + '&text=' + encodedText;
}