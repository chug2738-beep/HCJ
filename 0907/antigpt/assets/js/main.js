/**
 * K-TRIP KOREA - Main Interaction Script
 * Role: Senior Web Publisher & Tutor
 * Stack: JavaScript & jQuery
 * Description: Header scroll, tab filtering, exchange calculator, mobile nav
 */

$(document).ready(function () {
  'use strict';

  // 1. Header Scroll Effect
  var $header = $('#mainHeader');
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 40) {
      $header.addClass('scrolled');
    } else {
      $header.removeClass('scrolled');
    }
  });

  // 2. Mobile Navigation Toggle
  var $mobileMenuBtn = $('#mobileMenuBtn');
  var $mobileNav = $('#mobileNav');

  $mobileMenuBtn.on('click', function () {
    var isExpanded = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', !isExpanded);
    $mobileNav.toggleClass('hidden');
  });

  // Close mobile nav on link click
  $('#mobileNav a').on('click', function () {
    $mobileNav.addClass('hidden');
    $mobileMenuBtn.attr('aria-expanded', 'false');
  });

  // 3. Category Tab Filtering (Spots)
  var $tabButtons = $('.tab-btn');
  var $spotCards = $('.spot-item');

  $tabButtons.on('click', function () {
    var targetCategory = $(this).data('filter');

    // Update active tab styling
    $tabButtons.removeClass('active');
    $(this).addClass('active');

    // Filter cards with smooth fade
    if (targetCategory === 'all') {
      $spotCards.stop(true, true).fadeIn(300);
    } else {
      $spotCards.each(function () {
        var cardCategory = $(this).data('category');
        if (cardCategory === targetCategory) {
          $(this).stop(true, true).fadeIn(300);
        } else {
          $(this).stop(true, true).fadeOut(200);
        }
      });
    }
  });

  // 4. Currency Exchange Calculator (JPY -> KRW)
  var $jpyInput = $('#jpyInput');
  var $krwOutput = $('#krwOutput');
  var currentRate = 9.15; // 1 JPY = approx 9.15 KRW (Standard Demo Rate)

  function calculateExchange() {
    var jpyVal = parseFloat($jpyInput.val());
    if (isNaN(jpyVal) || jpyVal < 0) {
      $krwOutput.text('0');
      return;
    }
    var krwVal = Math.round(jpyVal * currentRate);
    $krwOutput.text(krwVal.toLocaleString('ko-KR'));
  }

  $jpyInput.on('input keyup change', function () {
    calculateExchange();
  });

  // 5. Bookmark / Favorite Toggle
  var bookmarkCount = 0;
  var $bookmarkCountDisplay = $('#bookmarkBadge');

  $(document).on('click', '.bookmark-btn', function (e) {
    e.preventDefault();
    $(this).toggleClass('active');

    if ($(this).hasClass('active')) {
      bookmarkCount++;
      $(this).attr('aria-label', 'ブックマーク解除');
    } else {
      bookmarkCount = Math.max(0, bookmarkCount - 1);
      $(this).attr('aria-label', 'ブックマーク追加');
    }

    if ($bookmarkCountDisplay.length) {
      $bookmarkCountDisplay.text(bookmarkCount);
      if (bookmarkCount > 0) {
        $bookmarkCountDisplay.removeClass('hidden');
      } else {
        $bookmarkCountDisplay.addClass('hidden');
      }
    }
  });

  // 6. Smooth Scroll for Internal Links
  $('a[href^="#"]').on('click', function (e) {
    var targetHref = $(this).attr('href');
    if (targetHref.length > 1 && $(targetHref).length) {
      e.preventDefault();
      var targetOffset = $(targetHref).offset().top - 80; // 80px offset for fixed header
      $('html, body').animate({ scrollTop: targetOffset }, 400);
    }
  });
});
