const app = require("./service");

test('listen to port', () => {
    let listenMock = jest.spyOn(app, 'listen').mockImplementation((port, callback) => {
        callback();
    });

    console.log = jest.fn();
    process.argv = ['node', 'index.js'];
    require('./index');

    expect(listenMock).toHaveBeenCalledWith(4000, expect.any(Function));
    expect(console.log).toHaveBeenCalledWith('Server started on port 4000');
});