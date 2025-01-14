
// All necessary imports here
const sqlite3 = require('sqlite3');
const db = require('./path_to_your_db_module'); // Update this path to the correct location of your module

jest.mock('sqlite3');

describe('SQLite Database Connection', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new database connection', () => {
        expect(sqlite3.Database).toHaveBeenCalledWith(
            './db/database.db',
            sqlite3.OPEN_READWRITE,
            expect.any(Function)
        );
    });

    it('should call the callback with an error if there is a failure', () => {
        const error = new Error('Connection error');
        sqlite3.Database.mockImplementationOnce((filename, mode, callback) => {
            callback(error);
        });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        // Create a new instance to trigger the error new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith(error.message);

        consoleErrorSpy.mockRestore();
    });

    it('should not log an error when connection is successful', () => {
        sqlite3.Database.mockImplementationOnce((filename, mode, callback) => {
            callback(null); // No error });

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
 // Create a new instance with no error new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            }
        });

        expect(consoleErrorSpy).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});
