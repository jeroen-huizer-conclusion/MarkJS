define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",

    "mxui/dom",
    "dojo/_base/lang",

    "MarkJS/lib/jquery",
    "MarkJS/lib/jquery.mark"
   
], function (declare, _WidgetBase,
    dom, lang,
    jquery, markjs
) {
    "use strict";

    var $ = jQuery.noConflict(true);

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

        //Internal variables
        _contextObj: null,          // MxObject
        _markInstance: null,        // Instance of MarkJS
        _options: {},               // Object

        postCreate: function () {
            logger.debug(this.id + ".postCreate"); 

            var msg = this._validateConfig();
            if(msg.length)
                logger.error(msg);

            this._options = this._getOptions();
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

            $(this.context).unmark();

            // set new marks
            if (this._contextObj) {
                var input = this._contextObj.get(this.inputAttribute);
                if(input.length){
                    $(this.context).mark(input, this._options);
                }
            }

        },

        _formatMarks: function(){
            var color = this.color === "other" ? this.customColor : this.color;
            //Note: 
            $(this.element).css({"background-color": color, "padding": "0px", "margin" : "0px"});
        },

        _getOptions: function(){
            return { "accuracy": this.accuracy,
                     "separateWordSearch": this.separateWordSearch,
                     "caseSensitive": this.caseSensitive, 
                     "element": this.element,
                     "diacritics": this.diacritics,
                     "wildcards": this.wildcards,
                     "done": lang.hitch(this, this._formatMarks)}
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

            return validationMessage;
        }
    })
});

require(["MarkJS/widget/MarkJS"]);