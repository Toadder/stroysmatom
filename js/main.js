function testWebP(callback) {
  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src =
    "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
  if (support == true) {
    document.querySelector("body").classList.add("webp");
  } else {
    document.querySelector("body").classList.add("no-webp");
  }
});

$(document).ready(function () {
  // Popup
  function popup() {
    const popupLinks = document.querySelectorAll(".popup-link");
    const body = document.querySelector("body");
    const lockPadding = document.querySelectorAll(".lock-padding");
    let unlock = true;
    const timeout = 800;

    if (popupLinks.length > 0) {
      for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function (e) {
          const popupName = popupLink.getAttribute("href").replace("#", "");
          const currentPopup = document.getElementById(popupName);
          popupOpen(currentPopup);
          e.preventDefault();
        });
      }
    }

    const popupCloseIcon = document.querySelectorAll(".close-popup");
    if (popupCloseIcon.length > 0) {
      for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener("click", function (e) {
          popupClose(el.closest(".popup"));
          e.preventDefault();
        });
      }
    }

    function popupOpen(currentPopup) {
      if (currentPopup && unlock) {
        const popupActive = document.querySelector(".popup._open");
        if (popupActive) {
          popupClose(popupActive, false);
        } else {
          bodyLock();
        }
        currentPopup.classList.add("_open");
        currentPopup.addEventListener("click", function (e) {
          if (!e.target.closest(".popup__content")) {
            popupClose(e.target.closest(".popup"));
          }
        });
      }
    }

    function popupClose(popupActive, doUnlock = true) {
      if (unlock) {
        popupActive.classList.remove("_open");
        if (doUnlock) {
          bodyUnlock();
        }
      }
    }

    function bodyLock() {
      const lockPaddingValue =
        window.innerWidth -
        document.querySelector(".wrapper").offsetWidth +
        "px";

      if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
          const el = lockPadding[index];
          el.style.paddingRight = lockPaddingValue;
        }
      }
      body.style.paddingRight = lockPaddingValue;
      body.classList.add("_lock");

      unlock = false;
      setTimeout(function () {
        unlock = true;
      }, timeout);
    }

    function bodyUnlock() {
      setTimeout(function () {
        if (lockPadding.length > 0) {
          for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = "0px";
          }
        }
        body.style.paddingRight = "0px";
        body.classList.remove("_lock");
      }, timeout);

      unlock = false;
      setTimeout(function () {
        unlock = true;
      }, timeout);
    }

    document.addEventListener("keydown", function (e) {
      if (e.which === 27) {
        const popupActive = document.querySelector(".popup._open");
        popupClose(popupActive);
      }
    });
  }

  function onScroll(element) {
    if ($(window).scrollTop() > $(window).height()) element.addClass("_active");
    $(window).on("scroll", () => {
      if ($(window).scrollTop() > $(window).height())
        element.addClass("_active");
      else element.removeClass("_active");
    });
  }

  function scrollToTop() {
    let btn = $(".to-top");
    onScroll(btn);
    btn.on("click", function () {
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        800
      );
      return false;
    });
  }

  function scrollMenu() {
    let menuTabs = $(".scrollmenu-tab");
    let menu = $(".scrollmenu");
    let closeIcons = $(".scrollmenu__side-close");

    onScroll(menu);

    menuTabs.on("click", function () {
      menu.addClass("_opened");

      closeIcons.removeClass("_shown");
      menuTabs.addClass("_shown");

      $(this).removeClass("_shown");
      $(this).next().addClass("_shown");

      $(".scrollmenu-content").removeClass("_active");
      $(".scrollmenu-content").eq($(this).data("index")).addClass("_active");
    });

    closeIcons.on("click", function () {
      menu.removeClass("_opened");

      $(this).removeClass("_shown");
      $(this).prev().addClass("_shown");

      $(".scrollmenu-content").removeClass("_active");
    });
  }

  function scrollToBlock() {
    let links = $("a.link-anchor");
    links.on("click", function () {
      let elementClick = $(this).attr("href");
      let destination = $(elementClick).offset().top;
      $("html, body").animate({ scrollTop: destination }, 800);
      $(".scrollmenu__side-close").removeClass("_shown");
      $(".scrollmenu-tab").addClass("_shown");
      $(".scrollmenu-content").removeClass("_active");
      $(".scrollmenu").removeClass("_opened");
      return false;
    });
  }

  // Phone mask
  function phoneMask() {
    let phoneInputs = document.querySelectorAll("input[data-tel-input]");

    for (let phoneInput of phoneInputs) {
      phoneInput.addEventListener("keydown", onPhoneKeyDown);
      phoneInput.addEventListener("input", onPhoneInput, false);
      phoneInput.addEventListener("paste", onPhonePaste, false);
    }

    function getInputNumbersValue(input) {
      // Return stripped input value — just numbers
      return input.value.replace(/\D/g, "");
    }

    function onPhonePaste(e) {
      let input = e.target,
        inputNumbersValue = getInputNumbersValue(input);
      let pasted = e.clipboardData || window.clipboardData;
      if (pasted) {
        let pastedText = pasted.getData("Text");
        if (/\D/g.test(pastedText)) {
          // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
          // formatting will be in onPhoneInput handler
          input.value = inputNumbersValue;
          return;
        }
      }
    }

    function onPhoneInput(e) {
      let input = e.target,
        inputNumbersValue = getInputNumbersValue(input),
        selectionStart = input.selectionStart,
        formattedInputValue = "";

      if (!inputNumbersValue) {
        return (input.value = "");
      }

      if (input.value.length != selectionStart) {
        // Editing in the middle of input, not last symbol
        if (e.data && /\D/g.test(e.data)) {
          // Attempt to input non-numeric symbol
          input.value = inputNumbersValue;
        }
        return;
      }

      if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
        if (inputNumbersValue[0] == "9")
          inputNumbersValue = "7" + inputNumbersValue;
        let firstSymbols = inputNumbersValue[0] == "8" ? "8" : "+7";
        formattedInputValue = input.value = firstSymbols + " ";
        if (inputNumbersValue.length > 1) {
          formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
          formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
          formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
          formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
        }
      } else {
        formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
      }
      input.value = formattedInputValue;
    }

    function onPhoneKeyDown(e) {
      // Clear input after remove last symbol
      let inputValue = e.target.value.replace(/\D/g, "");
      if (e.keyCode == 8 && inputValue.length == 1) {
        e.target.value = "";
      }
    }
  }

  function formCheck() {
    let form = document.querySelector('.popup__form');
    let inputs = document.querySelectorAll('input._req');

    form.addEventListener('submit', (e) => {
      let error = 0;

      inputs.forEach(input => {
        input.parentElement.classList.remove('_error');
        if(input.getAttribute('type') === 'checkbox' && input.checked === false) {
          input.parentElement.classList.add('_error');
          error++;
        } else if(input.value === '') {
          input.parentElement.classList.add('_error');
          error++;
        }
      });

      if(error !== 0) e.preventDefault();
    })

  }

  // Slider
  if (window.matchMedia("(max-width: 576px)").matches) {
    let slider = new Swiper(".team__slider", {
      autoHeight: true,
      speed: 800,
      loop: true,

      // Arrows
      navigation: {
        nextEl: ".team__next",
        prevEl: ".team__prev",
      },
      // Bullets
      pagination: {
        el: ".team__bullets",
        clickable: true,
      },
    });
  }

  

  // Calling functions
  scrollToTop();
  scrollMenu();
  scrollToBlock();
  popup();
  phoneMask();
  formCheck();
});
