jest.mock('../../../lib/oauth2', () => jest.fn())
jest.mock('url', () => ({
    parse: jest.fn()
}))

const login = require('../../../lib/oauth2-login'),
    { faker } = require('@faker-js/faker'),
    EventEmitter = require('events'),
    url = require('url'),
    Oauth = require('../../../lib/oauth2')

class TestEmitter extends EventEmitter {}
class WebEmitter extends EventEmitter {
    onCompleted(_, listener){
        return super.on('Completed',listener)
    }
}

describe.skip('login should', () => {
    const session = {
        defaultSession:{
            webRequest: new WebEmitter()
        }
    }

    beforeEach(() => {
        url.parse.mockClear()
        Oauth.mockClear()
    })
    test('allow login with electron window passed', async () => {
        let info = { something: faker.datatype.uuid() },
            childEmitter = new TestEmitter(),
            window = {
                loadURL: jest.fn(),
                webContents: childEmitter
            },
            authUrl = faker.datatype.uuid(),
            mockOauth = { 
                getAuthUrl: jest.fn(() => authUrl) 
            }
        Oauth.mockImplementation(() => mockOauth)

        login(info, window, session)
        
        expect(Oauth).toBeCalledWith(info)        
        expect(window.loadURL).toBeCalledWith(authUrl)
    })

    test('should reject if user closes window', async () => {
        let childEmitter = new TestEmitter(),
            window = {
                loadURL: jest.fn(),
                webContents: childEmitter
            }
        try {
            let result = login({
                redirectUrl: faker.datatype.uuid()
            }, window, session)
            window.webContents.emit('close')
            await result
            expect(true).toBeFalsy()
        } catch (error) {
            expect(error).toEqual('closed window')
        }
    })

    test('should get oauth tokens when navigates redirect', async () => {
        let childEmitter = new TestEmitter(),
            window = {
                loadURL: jest.fn(),
                webContents: childEmitter,
                show: jest.fn()
            },
            authUrl = faker.internet.url(),
            tokens = faker.datatype.uuid(),
            mockOauth = { 
                redirectUrl: authUrl,
                getAuthUrl: jest.fn(),
                getTokens: jest.fn(() => Promise.resolve(tokens)) 
            },
            parsed = {
                query: {
                    code: faker.datatype.uuid()
                }
            }
        Oauth.mockImplementation(() => mockOauth)
        url.parse.mockReturnValue(parsed)

        let result = login({
            redirectUrl: authUrl
        }, window, session)
        session.defaultSession.webRequest.emit('Completed', { url: authUrl })
        result = await result
        expect(url.parse).toBeCalledWith(authUrl, true)
        expect(mockOauth.getTokens).toBeCalledWith(parsed.query.code)
        expect(result).toEqual(tokens)
    })

    test('should rejects when navigates redirect', async () => {
        let childEmitter = new TestEmitter(),
            window = {
                loadURL: jest.fn(),
                webContents: childEmitter,
                show: jest.fn()
            },
            authUrl = faker.internet.url(),
            err = faker.datatype.uuid(),
            mockOauth = { 
                redirectUrl: authUrl,
                getAuthUrl: jest.fn(),
                getTokens: jest.fn(() => Promise.reject(err)) 
            }
        Oauth.mockImplementation(() => mockOauth)
        try {
            let result = login({
                redirectUrl: authUrl
            }, window, session)
            session.defaultSession.webRequest.emit('Completed', { url: authUrl })
            result = await result
            expect(true).toBeFalsy()
            
        } catch (error) {
            expect(error).toEqual(err)
        }
    })

    test('should rejects when no code in url redirect', async () => {
        let childEmitter = new TestEmitter(),
        window = {
            loadURL: jest.fn(),
            webContents: childEmitter,
            show: jest.fn()
        },
        authUrl = faker.internet.url(),
        mockOauth = { 
            redirectUrl: authUrl,
            getAuthUrl: jest.fn(),
        },
        parsed = {
            query: {
                error: faker.datatype.uuid()
            }
        }
        Oauth.mockImplementation(() => mockOauth)
        url.parse.mockReturnValue(parsed)

        try {
            let result = login({
                redirectUrl: authUrl
            }, window, session)
            session.defaultSession.webRequest.emit('Completed', { url: authUrl })
            result = await result
            expect(true).toBeFalsy()
            
        } catch (error) {
            expect(error).toEqual(`URL response is not correct, parameters are ${JSON.stringify(parsed.query)}`)
        }
    })
})
