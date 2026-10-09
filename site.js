(function () {
  // Empty media stays out of the visitor's view, including when opened locally.
  var isPreview = new URLSearchParams(location.search).get("preview") === "1";

  // Accepts a Vimeo URL (public or unlisted) or a bare ID, returns the player URL.
  function vimeoSrc(value) {
    var m = String(value).match(/(\d{6,})(?:\/([a-f0-9]{6,}))?(?:.*[?&]h=([a-f0-9]+))?/i);
    if (!m) return null;
    var hash = m[2] || m[3];
    var src = "https://player.vimeo.com/video/" + m[1] + "?title=0&byline=0&portrait=0&dnt=1";
    if (hash) src += "&h=" + hash;
    return src;
  }

  var videos = window.VIDEOS || {};
  document.querySelectorAll(".video-card").forEach(function (card) {
    var slot = card.getAttribute("data-slot");
    var src = videos[slot] ? vimeoSrc(videos[slot]) : null;
    var frame = card.querySelector(".frame");
    var title = card.querySelector(".title").textContent;

    if (src) {
      card.hidden = false;
      var iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = title;
      iframe.loading = "lazy";
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      frame.appendChild(iframe);
      var link = document.createElement("a");
      link.href = src;
      link.textContent = "Open " + title + " on Vimeo";
      link.className = "text-link video-link";
      link.target = "_blank";
      link.rel = "noopener";
      card.appendChild(link);
      if (slot === "cfx") document.getElementById("cfx-request").hidden = true;
    } else if (isPreview) {
      card.hidden = false;
      frame.classList.add("placeholder");
      frame.innerHTML = '<span>Add Vimeo link for <code>' + slot + '</code> in videos.js</span>';
    } else {
      card.hidden = true;
    }
  });

  // Empty grids add no blank space; one available project clip fills its row.
  document.querySelectorAll(".grid").forEach(function (g) {
    var shown = g.querySelectorAll(".video-card:not([hidden])").length;
    g.hidden = shown === 0;
    if (shown === 1 && g.classList.contains("two")) g.classList.add("single");
  });

  document.getElementById("yr").textContent = new Date().getFullYear();
})();
