/**
 * Simple jQuery plugin for fix thead and some first columns NOT 
 *  COLLSPANNED columns.
 * @author qnub
 * @license GPLv3
 */


/**
 * Fixed columns must be NOT COLSPANED with not fixed
 */
(function($) 
{

  //The main fixedColumn function
  $.fn.fixedColumn = function(options) 
  {
    
    // default settings
    var settings = 
    {
      'width' : 960,
      'fixedColumns' : 1,
      'fixedClass' : 'fixedTable'
    }
    
    return this.each(function() 
    {        
      // enable user settings
      if(options)
      {
        $.extend (settings, options);
      }
      
      var rebuildedTable = '';
      
      $(this).find('.' + settings.fixedClass).each(function(){
        var table = this;
        rebuildedTable += rebuildTable(table, settings.fixedColumns, settings.width);
      });
      
      $(this).html(rebuildedTable);
    });
  }
  
  function rebuildTable(table, columns, width)
  {
    var tdRowspan = new Array();
    var fixedWidth = 0;
    var tableClass = '';
    var tableId = '';
    
    if($(table).attr('class'))
      tableClass = 'class="' + $(table).attr('class') +'"';
    
    if($(table).attr('id'))
      tableId = 'id="' + $(table).attr('id') +'"';

    var fixedTable = '';
    var scrolledTable = '<table style="clear:none !important;" ' + tableClass + '>\n';
      
    for(var i = 0; i < columns; i++)
    {
      tdRowspan[i] = 0;
    }
    
    $(table).find('tr').each(function()
    {
      var tdNumber = 0;
      var fixedTr = false;
      var scrolledTr = false;
      var currentFixedWidth = 0;
      
      $(this).find('td,th').each(function(){
        var rowspan = '';
        var tagName = this.tagName.toLowerCase();
        var $this = $(this);
        var firstSpan = false;
        
        if($this.attr('rowspan'))
        {
          tdRowspan[tdNumber] = parseInt($this.attr('rowspan'));
          firstSpan = true;
          rowspan = ' rowspan="' + tdRowspan[tdNumber] + '"';
        }
          
        var tdWidth = $this.width() + 1;
        var tdHeight = $this.height() + 1;
        
        var attrs = 'style="width:' +
          tdWidth + 'px;height:' +
          tdHeight + 'px;"';

        if($this.attr('class'))
          attrs += ' class="' + $this.attr('class') + '"';
        
        if($this.attr('title'))
          attrs += ' title="' + $this.attr('title') + '"';
          
        if($this.attr('onclick'))
          attrs += ' onclick="' + $this.attr('onclick') + '"';
          
        if($this.attr('onhover'))
          attrs += ' onhover="' + $this.attr('onhover') + '"';
        
        if($this.attr('colspan'))
          attrs += ' colspan="' + $this.attr('colspan') + '"';
          
        while(tdNumber < columns && tdRowspan[tdNumber] > 0 && !firstSpan)
        {
          tdRowspan[tdNumber]--;
          tdNumber++;
        }

        if(tdNumber < columns && (tdRowspan[tdNumber] < 1 || firstSpan))
        {
          if(fixedTr)
            fixedTable += '\t\t<' + tagName + ' ' + attrs + rowspan + 
              '>' + $this.html() +
              '</' + tagName + '>\n';
          else
          {
            fixedTable += '\t<tr>\n\t\t<' + tagName + ' ' + attrs + 
              rowspan + '>' + $this.html() +
              '</' + tagName + '>\n';
            fixedTr = true;
          }
          
          currentFixedWidth += $this.outerWidth();
          
          if(tdRowspan[tdNumber] > 0)
            tdRowspan[tdNumber]--;
          
        }
        else
        {
          
          if(fixedTr)
          {
            fixedTable += '\t</tr>\n';
            fixedTr = false;
          }
            
            
          if(scrolledTr)
            scrolledTable += '\t\t<' + tagName + ' ' + attrs + ' ' +
              rowspan +
              '>' + $this.html() + '</' + tagName + '>\n';
          else
          {
            scrolledTable += '\t<tr>\n\t\t<' + tagName + ' ' + attrs + ' ' +
              rowspan +
              '>' + $this.html() + '</' + tagName + '>\n';
            scrolledTr = true;
          }
        }
        
        tdNumber++;
      });
      
      if(fixedWidth < currentFixedWidth)
        fixedWidth = currentFixedWidth;
      
      if(scrolledTr)
        scrolledTable += '\t</tr>\n';
    });
    
    return '<div ' + tableId + 
      '>\n<div style="float:left;">\n<table style="clear:none !important;" ' + 
      tableClass + '>\n' + 
      fixedTable + 
      '</table>\n</div>\n<div style="float:left;overflow:auto;width:' +
      (width - fixedWidth) +
      'px;">' + 
      scrolledTable + 
      '</table>\n</div>\n<div style="clear:left;"></div>\n</div>';
  }
  
})(jQuery);