const toast = require('../src/exercise.js');

describe('toast tests', () => {

    it('get the text from the text box when clicked', () => {
        expect(exercise('World')).toEqual('Hello, World!');
    });
});