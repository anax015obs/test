/* eslint-disable no-plusplus */
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

it("when you use this value of function()", () => {
  jest.useFakeTimers();
  function Person(callback: (age: number) => void) {
    this.age = 0;

    setInterval(function () {
      this.age++; // this value is [window]
      callback(this.age);
    }, 1000);
  }

  const mock = jest.fn((age: number) => {
    console.log(age);
  });

  const p = new (Person as any)(mock);

  jest.advanceTimersByTime(3000);
  expect(mock).toHaveBeenCalledTimes(3);
  expect(mock).toHaveBeenLastCalledWith(NaN);
});

it("when you use this value of () => {}", () => {
  jest.useFakeTimers();
  function Person(callback: (age: number) => void) {
    this.age = 0;

    setInterval(() => {
      this.age++; // this value is outer function's this
      callback(this.age);
    }, 1000);
  }

  const mock = jest.fn((age: number) => {
    console.log(age);
  });

  const p = new (Person as any)(mock);

  jest.advanceTimersByTime(3000);
  expect(mock).toHaveBeenCalledTimes(3);
  expect(mock).toHaveBeenLastCalledWith(3);
});
