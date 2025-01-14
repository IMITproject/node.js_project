
// Necessary imports
const express = require('express');
const httpMocks = require('node-mocks-http');
const { isAuthenticated } = require('./isAuth');

// Unit tests with Jest

describe('isAuthenticated Middleware', () => {

    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    test('should call next() if req.isAuthenticated() returns true', () => {
        req.isAuthenticated = jest.fn().mockReturnValue(true);

        isAuthenticated(req, res, next);

        expect(req.isAuthenticated).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        expect(res._getStatusCode()).toBeFalsy(); // No response code because next() is called
        expect(res._getRedirectUrl()).toBeFalsy(); // No redirect should happen
    });

    test('should redirect to /login if req.isAuthenticated() returns false', () => {
        req.isAuthenticated = jest.fn().mockReturnValue(false);

        isAuthenticated(req, res, next);

        expect(req.isAuthenticated).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res._getStatusCode()).toBe(302); // Redirect status code
        expect(res._getRedirectUrl()).toBe('/login'); // Redirect URL
    });

    test('should handle when req.isAuthenticated is not defined', () => {
        req.isAuthenticated = undefined;

        isAuthenticated(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res._getStatusCode()).toBe(302); // Redirect status code
        expect(res._getRedirectUrl()).toBe('/login'); // Redirect URL });

    test('should handle when req.isAuthenticated is not a function', () => {
        req.isAuthenticated = null;

        isAuthenticated(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(res._getStatusCode()).toBe(302); // Redirect status code
        expect(res._getRedirectUrl()).toBe('/login'); // Redirect URL });
});
});
})