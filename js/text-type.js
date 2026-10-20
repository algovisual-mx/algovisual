/* Vanilla JS port of the React Bits "TextType" component.
   Uses GSAP for the cursor blink when available (loaded via CDN in <head>),
   and falls back to a plain CSS animation if GSAP fails to load. */

(function () {
  "use strict";

  function TextType(el, options) {
    this.el = el;
    this.opts = Object.assign(
      {
        text: [""],
        typingSpeed: 75,
        initialDelay: 300,
        pauseDuration: 1800,
        deletingSpeed: 40,
        loop: true,
        showCursor: true,
        cursorCharacter: "|",
        hideCursorWhileTyping: false,
        offsetCursorWhenEmpty: false,
        textColors: []
      },
      options
    );

    this.textArray = Array.isArray(this.opts.text) ? this.opts.text : [this.opts.text];
    this.charIndex = 0;
    this.textIndex = 0;
    this.isDeleting = false;
    this.timeoutId = null;

    this._buildDOM();
    this._start();
  }

  TextType.prototype._buildDOM = function () {
    this.contentEl = document.createElement("span");
    this.contentEl.className = "text-type__content";
    this.el.appendChild(this.contentEl);

    if (this.opts.showCursor) {
      this.cursorEl = document.createElement("span");
      this.cursorEl.className = "text-type__cursor";
      this.cursorEl.textContent = this.opts.cursorCharacter;
      this.el.appendChild(this.cursorEl);
      this._blinkCursor();
      this._syncCursorOffset();
    }
  };

  /* When offsetCursorWhenEmpty is on, the cursor never hides — instead, while
     the content is empty it's pulled left (and its own box-width cancelled
     via a matching negative right margin) so it doesn't push whatever sits
     after it in the flow. Keeps a trailing static label aligned with content
     above it while still always showing a blinking caret. */
  TextType.prototype._syncCursorOffset = function () {
    if (!this.opts.offsetCursorWhenEmpty || !this.cursorEl) return;
    this.cursorEl.classList.toggle("text-type__cursor--offset", this.contentEl.textContent.length === 0);
  };

  TextType.prototype._blinkCursor = function () {
    var cursor = this.cursorEl;
    if (window.gsap) {
      window.gsap.set(cursor, { opacity: 1 });
      window.gsap.to(cursor, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      });
    } else {
      cursor.classList.add("text-type__cursor--css-blink");
    }
  };

  TextType.prototype._setColor = function () {
    var colors = this.opts.textColors;
    if (colors && colors.length) {
      this.contentEl.style.color = colors[this.textIndex % colors.length];
    }
  };

  TextType.prototype._start = function () {
    var self = this;
    this.timeoutId = setTimeout(function () {
      self._tick();
    }, this.opts.initialDelay);
  };

  TextType.prototype._tick = function () {
    var self = this;
    var current = this.textArray[this.textIndex];

    if (this.opts.hideCursorWhileTyping && this.cursorEl) {
      var typing = this.charIndex < current.length || this.isDeleting;
      this.cursorEl.classList.toggle("text-type__cursor--hidden", typing);
    }

    if (this.isDeleting) {
      if (this.charIndex <= 0) {
        this.isDeleting = false;
        if (!this.opts.loop && this.textIndex === this.textArray.length - 1) return;
        this.textIndex = (this.textIndex + 1) % this.textArray.length;
        this.charIndex = 0;
        this._setColor();
        this.timeoutId = setTimeout(function () { self._tick(); }, this.opts.pauseDuration);
      } else {
        this.charIndex -= 1;
        this.contentEl.textContent = current.slice(0, this.charIndex);
        this._syncCursorOffset();
        this.timeoutId = setTimeout(function () { self._tick(); }, this.opts.deletingSpeed);
      }
    } else {
      if (this.charIndex < current.length) {
        this.charIndex += 1;
        this.contentEl.textContent = current.slice(0, this.charIndex);
        this._syncCursorOffset();
        this.timeoutId = setTimeout(function () { self._tick(); }, this.opts.typingSpeed);
      } else {
        if (!this.opts.loop && this.textIndex === this.textArray.length - 1) return;
        this.timeoutId = setTimeout(function () {
          self.isDeleting = true;
          self._tick();
        }, this.opts.pauseDuration);
      }
    }
  };

  TextType.prototype.destroy = function () {
    clearTimeout(this.timeoutId);
  };

  window.TextType = TextType;
})();
