;(function ( $, window, document, undefined ) {

	// Plugin name and defaults setting
	var pluginName = "autoOpenningBlock",
		defaults = {
            openClass:      'is-open',
            closeClass:     'is-close',
            triggerElem:    'trigger-elem',   // [data-trigger-elem]
            openElem:       'open-elem',      // [data-open-elem]
            closing:        'closing',        // [data-closing]
            beforeTrigger:  'before-trigger', // [data-before-trigger]
            afterTrigger:   'after-trigger',  // [data-before-trigger]
            onEvent:        'click'
		};

	// The actual plugin constructor
	function Plugin ( elem, options ) {
		this.elem = elem;
		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = pluginName;
        this._nameSpace = 'autoOpenBlock'
		this.init();
	}

	Plugin.prototype = {

		init: function () {

            // Si le plugin à été instancié sur des éléments
            if ( this.elem.nodeType !== undefined ) 
            {
                if ( $(this.elem).length ) 
                {
                    var $this = $(this.elem);

                    // Check si le data de ces éléments correspond à ceux indiqué dans les options
                    if( $(this.elem).data( this.settings.triggerElem ) === undefined )
                    {   
                        var elemName = $this[0].localName;
                        elemName += $this[0].className != ''? '.'+ $this[0].className: '';
                        elemName += $this[0].id != ''? elemName += '.'+ $this[0].id: '';

                        console.error(this._name = pluginName +' => "'+ elemName +'" doesn\'t have [data-'+ this.settings.triggerElem +']');
                        return false;
                    }
                }
            }

            this._autoOpenElem();
		},

		cache: {},

        // Ajout les éléments en cache en fonction de "idName"
		_addElemToCache: function(idName) {

			this.cache['$'+ idName] = {
				trigger: $('[data-'+ this.settings.triggerElem +'='+ idName +']'),
				open:    $('[data-'+ this.settings.openElem +'='+ idName +']')
			}
		},

        // Get élément trigger en fonction de "idName" (du cache si est déjà présent)
		_getTriggerElem: function(idName) {

			if( this.cache['$'+ idName] === undefined ) 
			{
				this._addElemToCache(idName);
			}
			return this.cache['$'+ idName].trigger;
		},

        // Get élément block en fonction de "idName" (du cache si est déjà présent)
		_getBlockElem: function(idName) {

			if( this.cache['$'+ idName] === undefined ) 
			{
				this._addElemToCache(idName);
			}
			return this.cache['$'+ idName].open;
		},

        // Méthode pour ouvrir un block
		openElem: function(idName) {

            console.log('open '+ idName);

			// Get le trigger
			var $trigger = this._getTriggerElem(idName),
                $toOpen =  this._getBlockElem(idName); 

		    if( $toOpen.length )
		    {
                // Fermer les autres block indiqué dans le data du trigger
                if( $trigger.length ) 
                {
                    if( $trigger.data( this.settings.closing ) !== undefined ) 
                    {
                        var closing = $trigger.data('closing');

                        if (typeof closing == 'object') 
                        {
                            for (var i = 0; i < closing.length; i++) {
                                this.closeElem( closing[i] );
                            }
                        }
                        else {
                            this.closeElem( closing );
                        }
                    }
                }

                if( !$toOpen.hasClass( this.settings.openClass ) ) 
                {
                    $trigger.addClass( this.settings.openClass );
                    $toOpen.addClass( this.settings.openClass ).removeClass( this.settings.closeClass );
                }
		    }
		},

		// Méthode pour fermer un block
		closeElem: function(idName) {

		  console.log('close '+ idName);

            var $trigger = this._getTriggerElem(idName),
                $toClose = this._getBlockElem(idName);

		    if( $toClose.length )
		    {
		        if( $toClose.hasClass( this.settings.openClass ) ) 
		        {
		            $trigger.removeClass( this.settings.openClass );
                    $toClose.removeClass( this.settings.openClass ).addClass( this.settings.closeClass );
		        }
		    }
		},

        // Split method names and call it
        _callMethod: function(nameMethod) {

            arrayNameMethod = nameMethod.split('.'),
            namespace = arrayNameMethod[0],
            functionName = arrayNameMethod[1];

            console.log('Appel de la méthode ' + arrayNameMethod);

            window[namespace][functionName]();
        },

        _switchElem: function($elem) {

            console.log($elem);

            var idName = $elem.data( this.settings.triggerElem );

            // Si fermé, on ouvre
            if( !$elem.hasClass( this.settings.openClass ) )
            {
                // Si le lien à un attribut "data-before-open" => on appel la méthode précisé dans l'atribut
                if( $elem.data('before-open') ) 
                    this._callMethod( $elem.data('before-open') );

                this.openElem( idName );

                if( $elem.data('after-open') ) 
                    this._callMethod( $elem.data('after-open') );
            }
            // Si ouvert, on ferme
            else {
                this.closeElem( idName );
            }
        },

        // Ouverture/fermeture au click sur les trigger
        _autoOpenElem: function() {

            var self = this;

            $('[data-'+ self.settings.triggerElem +']').on( self.settings.onEvent +'.'+ self._nameSpace, function(e) {
                e.preventDefault();

                self._switchElem( $(this) );
            });
        },

        // Ajout d'un élément après chargement
        newElement: function(selector, onEvent) {

            var self =      this,
                $selector = $(selector);

            onEvent = typeof onEvent !== 'undefined' ? onEvent : this.settings.onEvent;

            $selector.parent().on( onEvent +'.'+ self._nameSpace, selector, function(e) {
                e.preventDefault();

                self._switchElem( $selector );
            });
        },

        // Unbind all
        destroy: function($elem) {

            var $elemToDestroy = $elem !== undefined ? $elem : $('[data-'+ this.settings.triggerElem +']');

            console.log('destroy');

            if( $elemToDestroy.length )
                $elemToDestroy.off('click.'+ this._nameSpace);
        }
    };


    // You don't need to change something below:
    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (ie. a function whose name doesn't start
    // with an underscore) to be called via the jQuery plugin,
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    // @thanks : https://github.com/jquery-boilerplate/jquery-boilerplate/wiki/Extending-jQuery-Boilerplate
    $[pluginName] = $.fn[pluginName] = function ( options ) {
        var args = arguments;

        // Is the first parameter an object (options), or was omitted,
        // instantiate a new instance of the plugin.
        if (options === undefined || typeof options === 'object') {

            // "this" is a jquery collection
            if (this.jquery) {

                return this.each(function () {

                    // Only allow the plugin to be instantiated once,
                    // so we check that the element has no plugin instantiation yet
                    //if (!$.data(this, 'plugin_' + pluginName)) {

                        // if it has no instance, create a new one,
                        // pass options to our plugin constructor,
                        // and store the plugin instance
                        // in the elements jQuery data object.
                        $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
                    //}
                });
            } 
            // "this" is not a jquery colleceletion
            else {
                // Push instanciated flag in window
                //if (!$.data(window, 'plugin_' + pluginName)) {
                    $.data(window, 'plugin_' + pluginName, new Plugin( this, options ));
                //}
            }

        // If the first parameter is a string and it doesn't start
        // with an underscore or "contains" the `init`-function,
        // treat this as a call to a public method.
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

            // Cache the method call
            // to make it possible
            // to return a value
            var returns;

            function callMethodIfInstance(elemSave) {

                var instance = $.data(elemSave, 'plugin_' + pluginName);

                // Tests that there's already a plugin-instance
                // and checks that the requested public method exists
                if (instance instanceof Plugin && typeof instance[options] === 'function') {

                    // Call the method of our plugin instance,
                    // and pass it the supplied arguments.
                    returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
                }

                // Allow instances to be destroyed via the 'destroy' method
                // ( CHECK SI FONCTIONNE OU UTILE)
                /*if (options === 'destroy') {
                  $.data(elemSave, 'plugin_' + pluginName, null);
                }*/
                
                // If the earlier cached method
                // gives a value back return the value,
                // otherwise return this to preserve chainability.
                return returns !== undefined ? returns : elemSave;
            }


            // "this" is a jquery collection
            if (this.jquery) 
            {
                this.each(function () {
                    callMethodIfInstance(this);
                });
            }
            else {
                callMethodIfInstance(window);
            }

        }
    };

})( jQuery, window, document );