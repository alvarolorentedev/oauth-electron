jest.mock('../../../lib/oauth1', () => jest.fn())

const login = require('../../../lib/oauth1-login'),
    { faker } = require('@faker-js/faker'),
    EventEmitter = require('events'),
    Oauth = require('../../../lib/oauth1')

class TestEmitter extends EventEmitter {}

describe('login should', () => {
    beforeEach(() => {
        Oauth.mockClear()
    })

    test('should reject if user closes window', async () => {
        let childEmitter = new TestEmitter(),
            window = {
                loadURL: jest.fn(),
                webContents: childEmitter
            },
            mockOauth = { 
                getRequestTokens: jest.fn(() => (Promise.resolve({ token: "pepe" }))),
                getAccessToken: jest.fn()
            }
        Oauth.mockImplementation(() => mockOauth)
        try {
            let result = login({
                authenticateUrl: faker.datatype.uuid(),
            }, window)
            window.webContents.emit('close')
            await result
            expect(true).toBeFalsy()
        } catch (error) {
            expect(error).toEqual('closed window')
        }
    })

    test('should get oauth tokens when navigates', async () => {
        let childEmitter = new TestEmitter(),
            window = {
                loadURL: jest.fn(),
                show: jest.fn(),
                webContents: childEmitter
            },
            authUrl = faker.internet.url(),
            tokens = faker.datatype.uuid(),
            token = faker.datatype.uuid(),
            mockOauth = { 
                getRequestTokens: jest.fn(() => Promise.resolve({ token })),
                getAccessToken: jest.fn(() => Promise.resolve({ tokens }))                
            },
            info = { 
                authenticateUrl: faker.datatype.uuid(),
                something: faker.datatype.uuid()
             }
        Oauth.mockImplementation(() => mockOauth)

        let result = login(info, window)
        window.webContents.emit('will-navigate', undefined, authUrl)
        result = await result
        expect(mockOauth.getAccessToken).toBeCalled()
        expect(result).toEqual({ tokens })
        expect(Oauth).toBeCalledWith(info)        
        expect(window.loadURL).toBeCalledWith(`${info.authenticateUrl}${token}`)
    })

    test('should rejects when navigates', async () => {
        let childEmitter = new TestEmitter(),
            window = {
                loadURL: jest.fn(),
                show: jest.fn(),
                webContents: childEmitter
            },
            authUrl = faker.internet.url(),
            token = faker.datatype.uuid(),
            err = faker.datatype.uuid(),
            mockOauth = { 
                getRequestTokens: jest.fn(() => Promise.resolve({ token })),
                getAccessToken: jest.fn(() => Promise.reject(err)) 
            }
        Oauth.mockImplementation(() => mockOauth)
        let result = login({
            authenticateUrl: faker.datatype.uuid(),
        }, window)
        window.webContents.emit('will-navigate', undefined, authUrl)
        expect(result).rejects.toEqual(err)
    })
})
