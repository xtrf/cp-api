var xtrfApiApp = (function() {
  var element = {
    filter: {
      clearBrokenLinks: '.js-fliter-clear-broken-links',
      remove: '.js-filter-remove'
    },

    ui: {
      hide: '.js-ui-hide',
      hightlight: '.js-ui-hightlight',
      navLink: '.js-ui-nav-link',
      restExample: '.js-operation',
      sort: '.js-ui-sort'
    }
  };

  var template = _.transform({
    restExample: '.tmp-rest-example',
    versionLabel: '.tmp-version-label'
  }, function(result, selector, key) {
    var html = $(selector).html();

    if (_.isUndefined(html)) { return; }

    lines = _.map(html.split('\n'), function(line) {
      return line.trim();
    });

    result[key] = _.template(lines.join('').replace(/\\n/g, '\n'));
  });

  var ui = {
    hide: function(selector) {
      $(selector).each(function() {
        var data = $(this).data();

        if (data.hideIfNo) {
          if ($(data.hideIfNo).length) { return; }

          $(this).hide();
        }
      });
    },

    hightlight: function(selector) {
      $(selector).find('code').each(function() {
        hljs.highlightBlock(this);
      });
    },

    navLink: function(selector) {
      var originalTitle = document.title;

      $(document).on('click', selector, function() {
        var title = [$(this).attr('title'), originalTitle].join(' - ');

        document.title = title;
        document.location.hash = $(this).attr('href').slice(0);

        $('.js-page-header').text(title);

        return false;
      });
    },

    restExample: function(selector) {
      $(selector).each(function() {
        var $restExample = $(this).children('.rest-example');

        if ($restExample.length === 0) { return; }

        var example = JSON.parse($restExample.html());

        example = _.defaults({}, example, {
          requestBody: null,
          responseBody: null
        });

        if (_.has(example, 'method') === false) { return; }
        if (_.has(example, 'path')   === false) { return; }
        if (_.has(example, 'status') === false) { return; }

        $restExample.after(template.restExample(example));

        if (_.isUndefined(example.version)) { return; }

        $(this)
          .children('h3')
            .append(template.versionLabel(example));
      });
    },

    sort: function(selector) {
      $(selector).each(function() {
        var $table = $(this);
        var rows = $table.find('tbody').find('tr').get();
        var by = _.isUndefined($table.data('by')) ? 0 : $table.data('by');

        rows.sort(function(a, b) {
          var value = {
            a: $(a).children('td').eq(by).text().toUpperCase(),
            b: $(b).children('td').eq(by).text().toUpperCase()
          };

          if (value.a < value.b) { return -1; }
          if (value.a > value.b) { return  1; }

          return 0;
        });

        $.each(rows, function(index, row) {
          $table.children('tbody').append(row);
        });
      });
    }
  };

  var filter = {
    clearBrokenLinks: function(selector) {
      $(selector).find('a[href^="#"]').each(function() {
        var $link =  $(this);
        var id = $link.attr('href').slice(1);

        if (id.length === 0) { return; }
        if ($('[id="' + id + '"]').length) { return; }

        $link
          .after($('<span />', {
            text: $link.text()
          }))
          .remove();
      });
    },

    remove: function(selector) {
      $(selector).text(function(index, text) {
        var toRemove = $(this).data('filterRemove');

        return text.replace(toRemove, '', 'g');
      });
    }
  };

  var routing = {
    init: function() {
      $('base').attr('href', function() {
        if (/introduction\.html/.test(location.pathname)) {
          return '.';
        }

        return '..';
      });


    }
  };

  var init = function() {
    ui.hide(element.ui.hide);
    ui.navLink(element.ui.navLink);
    ui.restExample(element.ui.restExample);
    ui.hightlight(element.ui.hightlight);
    ui.sort(element.ui.sort);

    filter.clearBrokenLinks(element.filter.clearBrokenLinks);
    filter.remove(element.filter.remove);

    routing.init();

    $('.dropdown-toggle').dropdown();
    $('[data-toggle="tooltip"]').tooltip();
  };

  return {
    init: init
  };
})();

$(document).ready(xtrfApiApp.init);
