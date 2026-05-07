(function () {

  var MODAL_DELAY_MS = 1500;


  // Async image loader
  function loadImage(url) {
    return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() { resolve(url); };
      img.onerror = function() { reject(new Error('Failed to load image: ' + url)); };
      img.src = url;
    });
  }

  // Load all images asynchronously
  function loadAllImages(config) {
    var backgroundImg = document.querySelector('.experience__img');
    var iconImg = document.querySelector('.modal__icon-badge-img');
    var arrowImg = document.querySelector('.modal__tagline-icon');

    // Load background image
    if (backgroundImg && config.background) {
      loadImage(config.background)
        .then(function(url) {
          backgroundImg.src = url;
        })
        .catch(function(err) {
          console.error(err);
        });
    }

    // Load icon image
    if (iconImg && config.icon) {
      loadImage(config.icon)
        .then(function(url) {
          iconImg.src = url;
        })
        .catch(function(err) {
          console.error(err);
        });
    }

    // Load arrow image
    if (arrowImg && config.arrow) {
      loadImage(config.arrow)
        .then(function(url) {
          arrowImg.src = url;
        })
        .catch(function(err) {
          console.error(err);
        });
    }
  }

  var main = document.getElementById("page-main");
  var modal = document.getElementById("explore-modal");
  var startBtn = document.getElementById("modal-start-btn");
  var closeBtn = document.getElementById("modal-close-btn");
  var lastFocus = null;

  function getFocusable(el) {
    if (!el) return [];
    return Array.prototype.slice
      .call(
        el.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      )
      .filter(function (node) {
        return (
          node.offsetWidth > 0 ||
          node.offsetHeight > 0 ||
          node.getClientRects().length > 0
        );
      });
  }

  function trapKeydown(e) {
    if (!modal || modal.hasAttribute("hidden")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key !== "Tab") return;
    var focusables = getFocusable(modal);
    if (focusables.length === 0) return;
    var first = focusables[0];
    var last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openModal() {
    if (!modal || !main) return;
    lastFocus = document.activeElement;
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    main.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", trapKeydown);
    window.setTimeout(function () {
      if (startBtn) startBtn.focus();
    }, 0);
  }

  function closeModal() {
    if (!modal || !main) return;
    modal.setAttribute("hidden", "");
    modal.setAttribute("aria-hidden", "true");
    main.removeAttribute("inert");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", trapKeydown);
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
    lastFocus = null;
  }

  document.querySelectorAll(".hotspot").forEach(function (button) {
    button.addEventListener("click", function () {
      var id = button.getAttribute("data-hotspot");
      var folders = ["jan", "feb", "mar", "apr"];
      var folder = folders[parseInt(id) - 1];
      if (folder) {
        window.location.href = "../editorial/index.html?folder=" + folder;
      }
    });
  });

  if (startBtn) {
    startBtn.addEventListener("click", closeModal);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.setAttribute("aria-hidden", "true");
  }

  // Initialize image loading
  fetch("../../assets/data/experience_images.json")
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Failed to fetch image configuration");
      }
      return response.json();
    })
    .then(function(config) {
      loadAllImages(config);
    })
    .catch(function(err) {
      console.error("Error loading image configuration:", err);
    });

  var hasVisited = sessionStorage.getItem("hasVisitedExperience");
  if (!hasVisited) {
    window.setTimeout(function() {
      openModal();
      sessionStorage.setItem("hasVisitedExperience", "true");
    }, MODAL_DELAY_MS);
  }
})();
