define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/_base/lang",

    "MarkJS/lib/mark"
   
], function (declare, _WidgetBase,
    dom, lang, markjs
) {
    "use strict";

    // Declare widget"s prototype.
    return declare("MarkJS.widget.MarkJS", [_WidgetBase], {

        //Widget variables
        inputAttribute: null,       // string ('')
        accuracy: null,             // enum ('partially')
        separateWordSearch: null ,  // boolean  (true)
        caseSensitive: null,        // boolean (false) 
        element: null,              // string ('mark')
        context: null,              // string ('body')
        diacritics: null,           // boolean (true)
        wildcards: null,            // enum ('enabled')
        color: null,                // enum ('yellow')
        customColor: null,          // string ('')
        refresh: null,              // boolean (false)
        refreshInterval: null,      // Integer (0)

        showToggleButton: null,     // boolean (false)
        offCaption: null,           // boolean ("Disable")
        onCaption: null,            // boolean ("Disable")
        offIcon: null,              // boolean ("erase")
        onIcon: null,               // boolean ("pencil")


        //Internal variables
        _contextObj: null,          // MxObject
        _markInstance: null,        // Instance of MarkJS
        _options: {},               // Object
        _button: null,              // mxui.widget.Button
        _isActive: true,            // boolean
        _markColor: null,           // String (this.color || this.customColor)

        postCreate: function () {
            logger.debug(this.id + ".postCreate"); 

            var msg = this._validateConfig();
            if(msg.length)
                logger.error(msg);

            this._options = this._getOptions();
            this._instance = new markjs(this.domNode);

            if(this.showToggleButton){
                this._updateButton();
            }

            this._markColor = this.color === "other" ? this.customColor : this.color;
            
        },


        update: function (obj, callback) {

            if (obj) {
                this._contextObj = obj;
                this._resetSubscriptions();
                this._updateMarks();
    
            } else {
                // Sorry no data no show!
                logger.warn(this.id + ".update - Did not receive a context object.");
            }

            callback && callback();
        },

        uninitialize: function(){
            // Unmark everything that is currently marked..
            this._contextObj = null;
            this._updateMarks();
        },

        _updateMarks: function(){
            // clean all current marks

            this._instance.unmark();

            // set new marks
            if (this._contextObj && this._isActive) {
                var input = this._contextObj.get(this.inputAttribute);
                if(input.length){

                    // Should I 'destroy' the old instance maybe?     
                    this._instance = new markjs(document.querySelectorAll(this.context));
                    this._instance.mark(input, this._options);

                    if(this.refresh)
                        setTimeout(lang.hitch(this, this._updateMarks), Math.abs(this.refreshInterval));
                }
            }

        },

        _toggleActive: function(){
            if(this._isActive){
                this._isActive = false;
                if(!this.refresh)
                    this._updateMarks();
            } 

            else{
                this._isActive = true;
                this._updateMarks();
            }
        },

        _formatMark: function(mark){
            mark.style.backgroundColor = this._markColor;
            mark.style.padding = "0px";
            mark.style.margin = "0px";
        },

        _getOptions: function(){
            return { "accuracy": this.accuracy,
                     "separateWordSearch": this.separateWordSearch,
                     "caseSensitive": this.caseSensitive, 
                     "element": this.element,
                     "diacritics": this.diacritics,
                     "wildcards": this.wildcards,
                     "each": lang.hitch(this, this._formatMark),
                     "filter": this._filter
                 }
        },

        _filter: function(node, match, total, cntr){
            // This limits the amount of markings in the hope of keeping this thing performat in IE.
            return cntr <25; 
        },

        _updateButton: function(){

            if(!this._button){

                function hitched(){
                    this._toggleActive();
                    this._updateButton();
                }

                this._button = this._button = new mxui.widget.Button({onClick: lang.hitch(this, hitched)});
                this._button.placeAt(this);
            }

            if(this._isActive){
                this._button.set('caption', this.offCaption);
                this._button.set('iconClass', this.offIcon != '' ? 'glyphicon-'+this.offIcon : '');
                this._button.set('class', 'btn-'+this.offClass);
            } else{
                this._button.set('caption', this.onCaption);
                this._button.set('iconClass', this.onIcon != '' ? 'glyphicon-'+this.onIcon : '');
                this._button.set('class', 'btn-'+this.onClass);
            }         
           
        },

        _resetSubscriptions: function () {
            logger.debug(this.id + "._resetSubscriptions");

            this.unsubscribeAll();

            if (this._contextObj) {
                this.subscribe({
                    guid: this._contextObj,
                    callback: lang.hitch(this, this._updateMarks)
                });

                this.subscribe({
                    guid: this._contextObj,
                    attr: this.inputAttribute,
                    callback: lang.hitch(this, this._updateMarks)
                });

                this.subscribe({
                    guid: this._contextObj,
                    val: true,
                    callback: lang.hitch(this, this._handleValidation)
                });
            }
        },

        _handleValidation: function(){
            console.log(this.id+'._handleValidation');

        },

        _validateConfig: function(){

            var validationMessage = "";
            if(this.color === "other" && (this.customColor == null && this.customColor === "" ))
                validationMessage += "If color is set to 'Other', the custom color attribute must be set.\r\n";

            if(this.context == null || this.context === "")
                validationMessage += "Search context must not be empty\r\n";

            if(this.element == null || this.element === "")
                validationMessage += "Inserted element must not be empty\r\n";

            if(this.refresh == true && !this.refreshInterval)
                validationMessage += "Refresh interval of 0 is not recommended.\r\n";

            if(this.showToggleButton){
                if(this.onCaption == null || this.onCaption === '')
                    validationMessage += "When button is enabled, it requires valid captions.\r\n";
                if(this.offCaption == null || this.offCaption === '')
                    validationMessage += "When button is enabled, it requires valid captions.\r\n";
            }

            return validationMessage;
        }
    })
});

require(["MarkJS/widget/MarkJS"]);