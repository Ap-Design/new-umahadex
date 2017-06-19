//The visual effect of touch on element on the mobile device
document.body.addEventListener('touchstart', function(e){
    addClass(e, 'touch');
}, false);
document.body.addEventListener('touchmove', function(e){
    removeClass(e, 'touch');
}, false);
document.body.addEventListener('touchend', function(e){
    var el = e;
    setTimeout(function(){
        removeClass(el, 'touch');
    }, 50);
}, false);

//console.log(device.type);
//console.log(device.tablet());
//console.log(device.mobile());

// Call functions for touch devices
if(device.type){
    replaceSelector(':hover', '.touch');    // Replace :hover => .touch for touch devices
    tableResponsive();    // Responsive table
}

// Function calls
//======================================================

// TODO rewrite on native javascript
///////// Responsive table /////////
function tableResponsive(){
    $('table.responsive').each(function(){
        var $tableTr = $('tr', this);
        var $tableTh = $('th', this);
        var allHeadersSaved = new Array();

        $tableTh.each(function(){
            var headerContent = $(this).text();
            allHeadersSaved.push(headerContent);
        });

        $.each(allHeadersSaved, function(i, v){
            $tableTr.find('td:eq('+i+')').prepend('<span class="table-head">'+v+'</span>');
        });
    });
}

function hasClass(el, name){
    return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.target.className);
}
function addClass(el, name){
    if(!hasClass(el, name)){
        el.target.className += (el.target.className ? ' ' : '')+name;
    }
}
function removeClass(el, name){
    if(hasClass(el, name)){
        el.target.className = el.target.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'), ' ').replace(/^\s+|\s+$/g, '');
    }
}

// Replace 'Selector' on 'New Selector'
var sheet, rule, selectors, newSelectorRule, newRule, j, f;
function replaceSelector(oldSelector, newSelector){
    var pattern = new RegExp(oldSelector+'\\b');
    try{

        for(var i = 0; i<document.styleSheets.length; i++){
            sheet = document.styleSheets[i];

            if(sheet.cssRules!=null && sheet.cssRules.length!=0){
                for(j = 0; j<sheet.cssRules.length; j++){
                    rule = sheet.cssRules[j];

                    if(rule.type===CSSRule.STYLE_RULE){
                        changeRule(rule, pattern, newSelector, oldSelector, rule.type);
                    }else if(rule.type===CSSRule.MEDIA_RULE){
                        for(f = 0; f<rule.cssRules.length; f++){
                            changeRule(rule.cssRules[f], pattern, newSelector, oldSelector, rule.type);
                        }
                    }
                }
            }
        }
    }catch(e){
        console.log(e);
        alert(e);
    }
}

function changeRule(rule, pattern, newSelector, oldSelector, type){
    selectors = rule.selectorText;
    // Iterate over the selectors and test them against the pattern
    if(/:active\b/.test(rule.selectorText)){
        var selectorsWithActive = rule.selectorText.split(',');

        for(k = 0; k<=selectorsWithActive.length; k++){
            // Add string to the new selector if it didn't match
            if(/:active\b/.test(selectorsWithActive[k])){
                selectorsWithActive.splice(k, 1);
                k--;
                continue;
            }
        }

        selectors = selectorsWithActive.join();
        if(!selectorsWithActive.length && type===CSSRule.STYLE_RULE){
            sheet.deleteRule(j);
            j--;
            return;
        }
        if(!selectorsWithActive.length && type===CSSRule.MEDIA_RULE){
            sheet.cssRules[j].deleteRule(f);
            f--;
            return;
        }
    }

    if(!pattern.test(rule.selectorText)){
        return;
    }

    newSelectorRule = selectors.replace(new RegExp(oldSelector, 'g'), newSelector);

    // Remove the rule, and add the new one if we've got something
    // added to the new selector
    newRule = rule.cssText.replace(/([^{]*)?/, newSelectorRule+' ');
    if(type===CSSRule.STYLE_RULE){
        sheet.deleteRule(j);
        sheet.insertRule(newRule, j);
    }
    if(type===CSSRule.MEDIA_RULE){
        sheet.cssRules[j].deleteRule(f);
        sheet.cssRules[j].insertRule(newRule, f);
    }
}

if(device.type){
    window.onbeforeunload = function(e){
        $('body').append('<span class="loading-page"></span>');

        setTimeout(function(){
            $('.loading-page').remove();
        }, 10000);
    };
}