(function() {
  "use strict";

  // Constants
  var MONTH_MAP = {
    jan: "January",
    feb: "February",
    mar: "March",
    apr: "April",
    may: "May",
    jun: "June",
    jul: "July",
    aug: "August",
    sep: "September",
    oct: "October",
    nov: "November",
    dec: "December"
  };


  var FLIPBOOK_CONFIG = {
    width: 1000,
    height: 650,
    autoCenter: true,
    gradients: true,
    elevation: 50,
    acceleration: true,
    duration: 1000,
    display: (window.innerWidth < 768) ? "single" : "double"
  };

  // Helper to get current display mode
  function getDisplayMode() {
    return (window.innerWidth < 768) ? "single" : "double";
  }

  // Handle window resize for flipbook
  function handleResize() {
    var flipbook = $("#flipbook");
    if (!flipbook.length) return;

    var newDisplay = getDisplayMode();
    if (flipbook.turn("display") !== newDisplay) {
      flipbook.turn("display", newDisplay);
    }

    // Dynamic sizing based on viewport
    var containerWidth = $(".flipbook-container").width();
    var newWidth, newHeight;

    if (newDisplay === "single") {
      newWidth = Math.min(containerWidth, 500);
      newHeight = newWidth * 1.3; // Aspect ratio for single page
    } else {
      newWidth = Math.min(containerWidth, 1000);
      newHeight = newWidth * 0.65; // Aspect ratio for double page
    }

    flipbook.turn("size", newWidth, newHeight);
  }

  var CORNER_SIZE = 100;
  var CORNER_SETUP_INTERVAL = 1000;
  var CORNER_SETUP_COUNT = 5;

  // Get folder from URL parameter
  function getFolderFromURL() {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("folder") || "jan";
  }



  // Update month name in caption
  function updateMonthName(folder) {
    var monthName = MONTH_MAP[folder] || "May";
    var monthNameEl = document.getElementById("monthName");
    if (monthNameEl) {
      monthNameEl.textContent = monthName;
    }
  }

  // Update all image sources with the selected folder
  function updateImageSources(folder) {
    var images = document.querySelectorAll("#flipbook .page img");
    images.forEach(function(img, index) {
      var pageNum = index + 1;
      img.setAttribute("src", "../../assets/images/editorial/" + folder + "/" + pageNum + ".jpg");
      img.setAttribute("alt", "Magazine page " + pageNum + " - " + MONTH_MAP[folder] + " editorial");
    });
  }

  // Setup corners for page turning indicators
  function setupCorners() {
    var pages = document.querySelectorAll("#flipbook .turn-page");

    pages.forEach(function(page) {
      var pageNum = parseInt(page.getAttribute("page"), 10);

      // Remove existing corners
      var existingCorners = page.querySelectorAll(".page-corner, .page-corner-left");
      existingCorners.forEach(function(corner) {
        corner.remove();
      });

      // Even pages are on the left side, odd pages are on the right side
      if (pageNum % 2 === 0) {
        // Left side page - add left corner
        var leftCorner = document.createElement("div");
        leftCorner.className = "page-corner-left";
        leftCorner.setAttribute("data-page", pageNum);
        leftCorner.setAttribute("aria-hidden", "true");
        page.appendChild(leftCorner);
      } else {
        // Right side page - add right corner
        var rightCorner = document.createElement("div");
        rightCorner.className = "page-corner";
        rightCorner.setAttribute("data-page", pageNum);
        rightCorner.setAttribute("aria-hidden", "true");
        page.appendChild(rightCorner);
      }
    });
  }

  // Handle corner clicks for page navigation
  function handleCornerClick(event) {
    var flipbook = document.getElementById("flipbook");
    if (!flipbook) return;

    var offset = flipbook.getBoundingClientRect();
    var relX = event.pageX - offset.left;
    var relY = event.pageY - offset.top;
    var width = flipbook.offsetWidth;
    var height = flipbook.offsetHeight;

    // Right page bottom-right corner
    if (relX > (width - CORNER_SIZE) && relY > (height - CORNER_SIZE)) {
      $(flipbook).turn("next");
    }
    // Left page bottom-left corner
    else if (relX < CORNER_SIZE && relY > (height - CORNER_SIZE)) {
      $(flipbook).turn("previous");
    }
  }

  // Handle keyboard navigation
  function handleKeydown(event) {
    var flipbook = document.getElementById("flipbook");
    if (!flipbook) return;

    if (event.key === "ArrowLeft" || event.keyCode === 37) {
      event.preventDefault();
      $(flipbook).turn("previous");
    } else if (event.key === "ArrowRight" || event.keyCode === 39) {
      event.preventDefault();
      $(flipbook).turn("next");
    } else if (event.key === "Home") {
      event.preventDefault();
      $(flipbook).turn("page", 1);
    } else if (event.key === "End") {
      event.preventDefault();
      var totalPages = $(flipbook).turn("pages");
      $(flipbook).turn("page", totalPages);
    }
  }

  // Announce page changes for screen readers
  function announcePageChange(page) {
    var flipbook = document.getElementById("flipbook");
    if (flipbook) {
      var totalPages = $(flipbook).turn("pages");
      var announcement = "Page " + page + " of " + totalPages;
      flipbook.setAttribute("aria-label", announcement);
    }
  }

  // Initialize flipbook
  function initializeFlipbook() {
    var folder = getFolderFromURL();

    // Update month name
    updateMonthName(folder);

    // Update image sources
    updateImageSources(folder);

    // Initialize turn.js
    var flipbook = $("#flipbook");
    flipbook.turn(Object.assign({}, FLIPBOOK_CONFIG, {
      when: {
        turning: function(event, page, view) {
          announcePageChange(page);
        },
        turned: function(event, page, view) {
          // Page turned successfully
        }
      }
    }));

    // Setup corners after turn.js initializes
    setTimeout(function() {
      setupCorners();

      // Keep monitoring and fixing corners
      var fixCount = 0;
      var cornerInterval = setInterval(function() {
        setupCorners();
        fixCount++;
        if (fixCount >= CORNER_SETUP_COUNT) {
          clearInterval(cornerInterval);
        }
      }, CORNER_SETUP_INTERVAL);
    }, 500);

    // Add event listeners
    flipbook.on("click", handleCornerClick);
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", handleResize);

    // Initial resize to fit container
    handleResize();

    // Initial page announcement
    announcePageChange(1);
  }

  // Initialize when DOM is ready
  $(document).ready(initializeFlipbook);
})();
