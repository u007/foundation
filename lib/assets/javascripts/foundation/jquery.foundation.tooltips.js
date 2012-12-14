;(function ($, window, document, undefined) {
  'use strict';

  Foundation.libs = Foundation.libs || {};

  Foundation.libs.tooltips = {
    version : '3.0',

    settings : {
      bodyHeight : 0,
      selector : '.has-tip',
      additionalInheritableClasses : [],
      tooltipClass : '.tooltip',
      tipTemplate : function (selector, content) {
        return '<span data-selector="' + selector + '" class="' + Foundation.libs.tooltips.settings.tooltipClass.substring(1) + '">' + content + '<span class="nub"></span></span>';
      }
    },

    init : function (scope, method, options) {
      this.scope = scope;

      if (typeof method === 'object') {
        $.extend(true, this.settings, method);
      }

      if (typeof method != 'string') {
        // alias the old targetClass option
        this.settings.selector = this.settings.targetClass ? this.settings.targetClass : this.settings.selector;

        if (Modernizr.touch) {
          $(this.scope).on('click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip', this.settings.selector, function (e) {
            e.preventDefault();
            $(this.settings.tooltipClass).hide();
            methods.showOrCreateTip($(this));
          })
          .on('click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip', this.settings.tooltipClass, function (e) {
            e.preventDefault();
            $(this).fadeOut(150);
          });
        } else {
          $(this.scope).on('mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip', this.settings.selector, function (e) {
            var $this = $(this),
                methods = Foundation.libs.tooltips;

            if (e.type === 'mouseenter') {
              methods.showOrCreateTip($this);
            } else if (e.type === 'mouseleave') {
              methods.hide($this);
            }
          });
        }

        $(this.scope).data('fndtn.tooltips', true);
      } else {
        return this[method].call(this, options);
      }

    },

    showOrCreateTip : function ($target) {
      var $tip = this.getTip($target);

      if ($tip && $tip.length > 0) {
        this.show($target);
      } else {
        this.create($target);
      }
    },

    getTip : function ($target) {
      var selector = this.selector($target),
          tip = null;

      if (selector) {
        tip = $('span[data-selector=' + selector + ']' + this.settings.tooltipClass);
      }

      return (tip.length > 0) ? tip : false;
    },

    selector : function ($target) {
      var id = $target.attr('id'),
          dataSelector = $target.data('selector');

      if (id === undefined && dataSelector === undefined) {
        dataSelector = 'tooltip' + Math.random().toString(36).substring(7);
        $target.attr('data-selector', dataSelector);
      }

      return (id) ? id : dataSelector;
    },

    create : function ($target) {
      var $tip = $(this.settings.tipTemplate(this.selector($target), $('<div>').html($target.attr('title')).html())),
          classes = this.inheritable_classes($target);

      $tip.addClass(classes).appendTo('body');
      if (Modernizr.touch) {
        $tip.append('<span class="tap-to-close">tap to close </span>');
      }
      $target.removeAttr('title');
      this.show($target);
    },
    
    reposition : function (target, tip, classes) {
      var width, nub, nubHeight, nubWidth, column, objPos;

      tip.css('visibility', 'hidden').show();

      width = target.data('width');
      nub = tip.children('.nub');
      nubHeight = nub.outerHeight();
      nubWidth = nub.outerWidth();

      objPos = function (obj, top, right, bottom, left, width) {
        return obj.css({
          'top' : top,
          'bottom' : bottom,
          'left' : left,
          'right' : right,
          'width' : (width) ? width : 'auto'
        }).end();
      };

      objPos(tip, (target.offset().top + target.outerHeight() + 10), 'auto', 'auto', target.offset().left, width);
      objPos(nub, -nubHeight, 'auto', 'auto', 10);

      if ($(window).width() < 767) {
        column = target.closest('.columns');

        if (column.length < 0) {
          // if not using Foundation
          column = $(this.scope);
        }
        tip.width(column.outerWidth() - 25).css('left', 15).addClass('tip-override');
        objPos(nub, -nubHeight, 'auto', 'auto', target.offset().left);
      } else {
        if (classes && classes.indexOf('tip-top') > -1) {
          objPos(tip, (target.offset().top - tip.outerHeight() - nubHeight), 'auto', 'auto', target.offset().left, width)
            .removeClass('tip-override');
          objPos(nub, 'auto', 'auto', -nubHeight, 'auto');
        } else if (classes && classes.indexOf('tip-left') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - nubHeight), 'auto', 'auto', (target.offset().left - tip.outerWidth() - 10), width)
            .removeClass('tip-override');
          objPos(nub, (tip.outerHeight() / 2) - (nubHeight / 2), -nubHeight, 'auto', 'auto');
        } else if (classes && classes.indexOf('tip-right') > -1) {
          objPos(tip, (target.offset().top + (target.outerHeight() / 2) - nubHeight), 'auto', 'auto', (target.offset().left + target.outerWidth() + 10), width)
            .removeClass('tip-override');
          objPos(nub, (tip.outerHeight() / 2) - (nubHeight / 2), 'auto', 'auto', -nubHeight);
        }
      }

      tip.css('visibility', 'visible').hide();
    },

    inheritable_classes : function (target) {
      var inheritables = ['tip-top', 'tip-left', 'tip-bottom', 'tip-right', 'noradius'].concat(this.settings.additionalInheritableClasses),
          classes = target.attr('class'),
          filtered = classes ? $.map(classes.split(' '), function (el, i) {
              if ($.inArray(el, inheritables) !== -1) {
                return el;
              }
          }).join(' ') : '';

      return $.trim(filtered);
    },

    show : function ($target) {
      var $tip = this.getTip($target);

      this.reposition($target, $tip, $target.attr('class'));
      $tip.fadeIn(150);
    },

    hide : function ($target) {
      var $tip = this.getTip($target);

      $tip.fadeOut(150);
    },

    // deprecate reload
    reload : function () {
      var $self = $(this);

      return ($self.data('fndtn.tooltips')) ? $self.foundationTooltips('destroy').foundationTooltips('init') : $self.foundationTooltips('init');
    },

    unbind : function () {
      $(this.scope).off('.tooltip');
      $(this.scope).data('fndtn.tooltips', false);
      $(this.settings.tooltipClass).each(function (i) {
        $($(this.settings.selector).get(i)).attr('title', $(this).text());
      }).remove();
    }
  };
}(jQuery, this, this.document));