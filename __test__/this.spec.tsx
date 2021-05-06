afterEach(() => {
  jest.clearAllMocks();
});

it("this is how method() actually works", () => {
  const spy = jest.spyOn(console, "log");
  function hello(thing: string) {
    console.log(`${this} say hello ${thing}`);
  }
  hello.call("minsu", "world");
  expect(spy).toBeCalledWith("minsu say hello world");
});

it("method() is a shorthand and it's default this value is window", () => {
  const spy = jest.spyOn(console, "log");
  function hello(thing: string) {
    console.log(`${this} say hello ${thing}`);
  }
  hello("world"); // actually it's a shorthand. it desugars to hello.call(window, "world")
  expect(spy).toBeCalledWith("[object Window] say hello world");
});

it("obj.method()'s default this value is obj", () => {
  const spy = jest.spyOn(console, "log");
  const person = {
    name: "minsu",
    hello(thing: string) {
      console.log(`${this.name} say hello ${thing}`);
    },
  };
  person.hello("world"); // desugars to person.hello.call(person, "world")
  expect(spy).toBeCalledWith("minsu say hello world");
});

it("although we attach method() to obj before, method() is always set at call time based upon the way it was invoked by its caller", () => {
  const person: any = {
    name: "minsu",
  };
  function hello(thing: string) {
    console.log(`${this.name} say hello ${thing}`);
  }
  person.hello = hello;
  const spy = jest.spyOn(console, "log");
  person.hello("world"); // desugars to person.hello.call(person, "world")
  expect(spy).toBeCalledWith("minsu say hello world");
  spy.mockReset();

  const newSpy = jest.spyOn(console, "log");
  hello("world"); // desugars to hello.call(window, "world")
  expect(newSpy).toBeCalledWith(" say hello world");
});

it("we want to have a reference to function with a persistant this value. Like this", () => {
  const person = {
    name: "minsu",
    hello(thing: string) {
      console.log(`${this.name} say hello ${thing}`);
    },
  };
  const boundHello = function (thing: string) {
    return person.hello.call(person, thing);
  };
  const spy = jest.spyOn(console, "log");
  boundHello("world");
  expect(spy).toBeCalledWith("minsu say hello world");
});

it("we can abstract above boundHello. Like this", () => {
  const person = {
    name: "minsu",
    hello(thing: string) {
      console.log(`${this.name} say hello ${thing}`);
    },
  };

  const bind = function (func: (arg: any) => any, thisValue: any) {
    return function (arg: any) {
      return func.apply(thisValue, arg);
    };
  };

  const spy = jest.spyOn(console, "log");

  const boundHello = bind(person.hello, person);
  boundHello(["world"]);

  expect(spy).toBeCalledWith("minsu say hello world");
});

it("actually, you don't have to do that. It's already built-in by javascript called bind()", () => {
  const person = {
    name: "minsu",
    hello(thing: string) {
      console.log(`${this.name} say hello ${thing}`);
    },
  };
  const boundHello = person.hello.bind(person);

  const spy = jest.spyOn(console, "log");

  boundHello("world");
  expect(spy).toBeCalledWith("minsu say hello world");
});
