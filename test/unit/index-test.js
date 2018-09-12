jest.mock('../../lib/oauth1-login', () => jest.fn())
jest.mock('../../lib/oauth2-login', () => jest.fn())
const loginOauth1 = require('../../lib/oauth1-login'),
    loginOauth2 = require('../../lib/oauth2-login'),
    index = require('../..')

describe('index should', () => {
    test('export oauth1 login', async () => {
        expect(index.oauth1).toBe(loginOauth1)
    })
    test('export oauth2 login', async () => {
        expect(index.oauth2).toBe(loginOauth2)
    })
})