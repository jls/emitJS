## Which Implementation?

For help deciding which implementation to use see Miller Medeiros's write up [comparison between different observer pattern implmentations](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations).

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

## Adding a one time listener

```javascript
  // Using the binding implementation, create bindings.
  var my = {
    events: {
      userCreated: new emit.Binding()
    }
  };
  
  // Add a listener that will fire only once.
  my.events.userCreated.add(function(){console.log('one time action after creation');}, true);
  
  // Emit the userCreated event.
  my.events.userCreated.emit();
  // => console message logged 'one time action after creation')
  
  // Emit the userCreated event again, but the message will not be logged this time.
  my.events.userCreated.emit();
  // => no console messages
  
```

## Deactivating a binding

```javascript
  
  // Using the binding implementation, create bindings.
  var theEvent = new emit.Binding();
  
  // Add a listener to the event
  theEvent.add(function(){console.log('event fired');});
  
  // Fire event
  theEvent.emit();
  // => console message logged 'event fired'
  
  // Deactivate the binding.
  theEvent.active = false;
  
  // Fire event
  theEvent.emit();
  // => no console messages logged
  
  // Re-activate the binding and fire
  theEvent.active = true;
  theEvent.emit();
  // => console message logged 'event fired'

```
  
