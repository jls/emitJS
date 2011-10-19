## Overview

emitJS is a combination of a pub/sub system and an event emitter.  Taking some of the best parts of [js-signals](https://github.com/millermedeiros/js-signals) and the simplicity of [EventEmitter](https://github.com/Wolfy87/EventEmitter) and combining them so either (or both) pattern implementation can be used.

## Simple Emitter Example

```javascript
  // Create an emitter.
  var emitter = new emit.EventEmitter();
  
  // Add a listener to the emitter.
  emitter.add('userCreated', function(){console.log('user has been created');});
  
  // Add another listener to the emitter.
  emitter.add('userCreated', function(){alert('user has been created');});
  
  // Emit the event
  emitter.emit('userCreated');
  // => Alert shown displaying 'user has been created';
  // => console message logged 'user has been created';
```
  
## Simple Binding Example

```javascript
  // Create the event bindings.
  var my = {
    events: {
      userCreated: new emit.Binding(),
      userRemoved: new emit.Binding()
    }
  };
  
  // Add a listener to the userCreated binding.
  my.events.userCreated.add(function(){console.log('user has been created');});
  
  // Emit the userCreated event.
  my.events.userCreated.emit();
  // => console message logged 'user has been created'
```

## More Examples

To see more examples please see the [Examples Page](https://github.com/jls/emitJS/wiki/Examples) in the wiki.

## Should I use Emitter or Binding?

Short answer is whichever you want.  Both have their pros and cons and Miller Medeiros has a great write up here [comparison between different observer pattern implmentations](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations).

I tend to prefer the binding implementation just because it works well with auto complete and my tests will complain when I try and emit or subscribe to the wrong event. 