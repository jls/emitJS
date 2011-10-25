(function(global){
  
  // Initialize the namespace that we will use and 
  // store a reference to the current value of our namespace.
  var ns = 'emit', _prevEmitter = global[ns];
  
  /**
  * @namespace emit Namespace - JavaScript event system that includes both a Pub/Sub and Emitter implementation.
  */
  var emitterNS = global[ns] = {};

  /**
  * Returns an instance of the emit namespace object and
  * restores the value of the global.emit object.
  * @return {Object} The emit namespace object containing all emit classes.
  */
  emitterNS.noConflict = function(){
    global[ns] = _prevEmitter;
    return emitterNS;
  };
    
  /**
  * Object that represents an event listener.
  * <p>Used by internal classes, and probably should not be used by clients.</p>
  * @internal
  * @constructor
  * @param {String} type The event type of this listener.
  * @param {Function} listener The function that will be called when this listener is fired.
  * @param {Object} [scope] Context on which the listener function will be executed.
  * @param {boolean} [once=false] If true the listener will be removed after firing one time.
  * @param {Function} [removeCallback] A function that is called if once=true and the listener has been fired.
  */
  emitterNS.EventListener = function(type, listener, scope, once, removeCallback){
    var eventInstance = this;
    
    /**
    * Type of this listener.  Can be any arbitrary string.
    * @type String
    */
    eventInstance.type = type;
    
    /**
    * Listener that will be executed when this listener is fired.
    * @type Function
    */
    eventInstance.listener = listener;
    
    /**
    * Context that the listener will be executed on.
    * @type Object
    */
    eventInstance.scope = scope;
    
    /**
    * Flag indicating whether the listener should only ever fire once.
    * @type boolean
    */
    eventInstance.once = once;
    
    /**
    * Flag indicating whether the listener is currently active.
    * @type boolean
    */
    eventInstance.active = true;
    
    /**
    * Callback executed when the event listener should be 
    * removed from any bindings it is currently attached to.
    * @type Function
    */
    eventInstance.removeCallback = removeCallback;
    
    /**
    * Calls listener passing args as listener arguments.
    * @param {Array} [args] An array of arguments that will be passed to the listener.
    * @return {*} The value returned from the listener.
    */
    eventInstance.fire = function(args){
      if(!eventInstance.active) return;
      
      var ret = eventInstance.listener.apply(eventInstance.scope || this, args || []);      
      if(eventInstance.once){
        eventInstance.removeCallback(eventInstance);
      }
      return ret;
    };
  
  };
  
  /**
  * @class Object representing a binding between an event and multiple listeners.
  */
  emitterNS.Binding = function(){

    var bindingInstance = this, 
    
    /**
    * An array of EventListener objects that are
    * fired when this binding is emitted.    
    * @type {Array}
    */
    _listeners = [];
    
    /**
    * Indicates whether the binding is currently active.
    * If false then any calls to emit will NOT result in 
    * this bindings listeners being fired.
    * @type boolean
    */
    bindingInstance.active = true;
  
    /**
    * @return {Number} Number of listeners currently bound to this binding.
    */
    bindingInstance.length = function(){return _listeners.length;};
    
    /**
    * Adds a listener to this binding.
    * @param {Function} listener The function to call when this binding is emitted.
    * @param {boolean} once True indicates this listener should only fire once, then be removed.
    * @param {Object} scope Context on which to execute the listener.
    * @param {String} type Type passed directly to the EventListener. Unless this binding is being used by an emitter, it can be ignored.
    * @return {EventListener} The newly created EventListener instance.
    */
    bindingInstance.add = bindingInstance.addListener = function(listener, once, scope, type){
      var eventHandler = new emitterNS.EventListener(type, listener, scope, once, bindingInstance.rem);
      _listeners.push(eventHandler);
      return eventHandler;
    };
    
    /**
    * Removes a listener from this binding.
    * @param {EventListener} listener The Event Listener to remove from this binding.
    */
    bindingInstance.rem = bindingInstance.removeListener = function(listener){
      for(var i = 0; i < _listeners.length; i+=1){
        if(_listeners[i] === listener){
          _listeners.splice(i, 1);
        }
      }
    };
    
    /**
    * Fires all of the listeners associated with this binding.
    * @param {...*} [params] Arguments to be sent to each of the listeners.
    */
    bindingInstance.emit = function(){
      if(bindingInstance.active !== true) return;
      
      var args = Array.prototype.slice.call(arguments);
      for(var i = 0; i < _listeners.length; i+=1){
        _listeners[i].fire(args);
      }
    };
    
  };
    
  /**
  * Object that represents a emitter.  It can contain multiple bindings differentiated
  * by a type string.  Listeners can be added for different type strings
  * and events can be fired for each type string.
  * @constructor
  */
  emitterNS.EventEmitter = function(){

    var emitterInstance = this;
    
    /**
    * Stores a key value pair for each of the 
    * bindings for this emitter.  The key will be
    * the event type string and the value will be
    * the emit.Binding object containing all of the 
    * listeners.
    * @type {Object}
    */
    var _bindings = {};

    /**
    * Removes a listener from this emitter.  Subsequent emit calls will no longer
    * call the supplied listener.
    * @param {EventListener} listener Listener to be removed from this emitter.
    */
    emitterInstance.rem = emitterInstance.removeListener = function(listener){
      var type = listener.type;

      if(!_bindings[type])
        return;

      _bindings[type].rem(listener);

      // If there are no other listeners for this type then 
      // go ahead and delete the type.
      if(_bindings[type].length() === 0) 
        delete _bindings[type];

    };
    
    /**
    * Adds a listener to this emitter.
    * @param {String} type The type of listener to add.  This can be an arbitrary string
    *    that identifies the event type that this listener responds to. Ex. 'userCancelled', 'videoStopped', etc.
    * @param {Function} listener The function that will be executed when the event type is emitted.
    * @param {Object} [scope] Context on which to call the listener
    * @param {boolean} [once=false] True indicates that the listener should only be called once, then removed.
    */
    emitterInstance.add = emitterInstance.addListener = function(type, listener, once, scope){
      if(!_bindings[type])
        _bindings[type] = new emitterNS.Binding();
      return _bindings[type].add(listener, once, scope, type);
    };

    /*
    * Emits the event type.  All of the listeners that have been added
    * with event types that match the type param will be executed.
    * @param {String} type The event type to emit.  
    */
    emitterInstance.emit = function(type){
      if(!_bindings[type]) return;
      var args = Array.prototype.slice.call(arguments, 1);
      _bindings[type].emit.apply(_bindings[type], args);
    };
    
  };
  
})(window);