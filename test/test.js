$(document).ready(function(){
  
  function emptyFunction(){};
  
  //
  // emit.EventListener
  //
  module("EventListener");

  test("instance variables are saved", function() {
    var e = new emit.EventListener('t', emptyFunction, this, false, emptyFunction);
    expect(5);
    equal(e.type, 't');
    equal(e.listener, emptyFunction);
    equal(e.scope, this);
    equal(e.once, false);
    equal(e.removeCallback, emptyFunction);
  });

  test("event calls listener when fired", function(){
    var fired = false, 
        e = new emit.EventListener('t', function(){fired = true;}, this, false, emptyFunction);
        
    expect(2);
    ok(!fired, 'Fired was initialized to false');
    e.fire();
    ok(fired, 'Listener was fired');
  });
  
  test("single fire events call remove callback", function(){
    var removeCalled = false;
    var e = new emit.EventListener('t', emptyFunction, this, true, function(){removeCalled = true;});
    expect(2);
    ok(!removeCalled, 'Remove initialized to false');
    e.fire();
    ok(removeCalled, 'Removed callback was called');
    
  });

  test("arguments correctly handed to listener", function(){
    var h = function(a){
      equal(a, '5', 'argument correct value');
      equal(typeof a, typeof "astring", 'argument correct type');
    };
    var e = new emit.EventListener('t', h);
    e.fire(['5']);
  });

  //
  // emit.Binding
  //
  module("Bindings");
  
  test("active by default", function(){
    var b = new emit.Binding();
    ok(b.active, 'Active was true by default');
  });

  test("removed correctly if once set to true", function(){
    var b = new emit.Binding();
    var c = 0, h = function(){c+=1;};
    b.add(h, true);
    equal(c, 0, 'count initialized to zero');
    b.emit();
    equal(c, 1, 'count incremented after first emit');
    b.emit();
    equal(c, 1, 'count not incremented after second emit');
  });

  test("initializes with zero listeners", function(){
    var b = new emit.Binding();
    equal(b.length(), 0, 'Listeners initializes to zero');
  });

  test("second test within module", function() {
    ok( true, "all pass" );
  });

  test("arguments are supplied to listener", function(){
    
    var b = new emit.Binding();
    b.add(function(a){
      equal(a, '5', 'argument has correct value');
      equal(typeof a, typeof 'astring', 'argument has the correct type');
    });
    
    b.emit('5');
    
  });

  test("listener correctly removed", function(){
    var c = 0;
    var b = new emit.Binding();
    var l = b.add(function(){
      c += 1;
    });
    
    b.emit();
    equal(c, 1, 'count incremented after first emit');
    b.rem(l);
    b.emit();
    equal(c, 1, 'count should not be incremented after listener removed');
    
  });

  //
  // emit.EventEmitter
  //
  module("EventEmitter");
  
  test("fire once event is removed from emitter after firing", function(){
    var fireCount = 0;
    var handler = function(){fireCount += 1};
    var emitter = new emit.EventEmitter();
    emitter.add('test', handler, this, true);
    
    equal(fireCount, 0, 'fireCount starts at 0');
    emitter.emit('test');
    equal(fireCount, 1, 'fireCount incremented after 1 run');
    emitter.emit('test');
    equal(fireCount, 1, 'fireCount should not increment after 2nd run');
    
  });
  
  test("arguments should be supplied to listener", function(){
    
    var i = 0;
    var h1 = function(s){ 
      equal(s, '5', 'argument has correct value');
      equal(typeof s, typeof 'astring', 'argument has correct type');
    };
    
    var e = new emit.EventEmitter();
    e.add('t', h1);
    e.emit('t', '5');

  });
  
  test("should be able to use same type value for different emitters", function(){
    
    var fc = 0, h1 = function(){fc+=1};
    
    var e1 = new emit.EventEmitter();
    var e2 = new emit.EventEmitter();
    
    e1.add('t', h1);
    e2.add('t', h1);
    
    equal(fc, 0, 'fc initialized to 0');

    e1.emit('t');
    equal(fc, 1, 'fc incremented after emitter1 fired');

    e2.emit('t');
    equal(fc, 2, 'fc incremented after emitter2 fired');      
    
  });

  test("event listener type should be set correctly by emitter", function(){
    
    var e = new emit.EventEmitter();
    var l = e.add('t', emptyFunction);
    equal(l.type, 't', 'listeners type should match type supplied to emitter');
    
  });

  test("listener should be correctly removed", function(){
    
    var c = 0;
    var e = new emit.EventEmitter();
    var l = e.add('t', function(){
      c += 1;
    });
    
    e.emit('t');
    equal(c, 1, 'count should be incremented after first emit');
    e.rem(l);
    e.emit('t');
    equal(c, 1, 'count should not be incremented after second emit');
    
  });
  
});