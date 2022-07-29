jest.mock('oauth', () =>({
    OAuth2: jest.fn()
}))
const Oauth = require('../../../lib/oauth2'),
    OAuth2 = require('oauth').OAuth2,
    { faker } = require('@faker-js/faker')

describe('oauth should', () => {
    test('construct using library', async () => {
        let info = { 
                key: faker.datatype.uuid(),
                secret: faker.datatype.uuid(),
                baseSite: faker.datatype.uuid(),
                authorizePath: faker.datatype.uuid(),
                accessTokenPath: faker.datatype.uuid(),
            },
            expectedResult = { some: faker.datatype.uuid() }
        OAuth2.mockImplementation(() => expectedResult)

        let result = new Oauth(info)
        expect(OAuth2).toBeCalledWith(
            info.key, 
            info.secret,
            info.baseSite, 
            info.authorizePath, 
            info.accessTokenPath)
        expect(result.oauth).toEqual(expectedResult)
    })

    test('getAuthUrl should return authorization url', async () => {
        let info = { 
                redirectUrl: faker.datatype.uuid(),
                scope: faker.datatype.uuid(),
                responseType: faker.datatype.uuid()
            },
            expectedResult = faker.datatype.uuid(),
            mockOauth = { getAuthorizeUrl: jest.fn(() => expectedResult) }
            
        OAuth2.mockImplementation(() => mockOauth)

        let oauth = new Oauth(info)
        let url = oauth.getAuthUrl()
        
        expect(mockOauth.getAuthorizeUrl).toBeCalledWith({
            redirect_uri: info.redirectUrl,
            scope: info.scope,
            response_type: info.responseType
        })
        expect(url).toEqual(expectedResult)
    })

    test('getAuthUrl should use code as default type if is nit passed in the info object', async () => {
        let info = { 
                redirectUrl: faker.datatype.uuid(),
                scope: faker.datatype.uuid()
            },
            expectedResult = faker.datatype.uuid(),
            mockOauth = { getAuthorizeUrl: jest.fn(() => expectedResult) }
            
        OAuth2.mockImplementation(() => mockOauth)

        let oauth = new Oauth(info)
        let url = oauth.getAuthUrl()
        
        expect(mockOauth.getAuthorizeUrl).toBeCalledWith({
            redirect_uri: info.redirectUrl,
            scope: info.scope,
            response_type: 'code'
        })
        expect(url).toEqual(expectedResult)
    })

    test('getTokens should return tokens if no error', async () => {
        let code = faker.datatype.uuid(),
            info = {
                redirectUrl: faker.datatype.uuid(),
            },
            expected = {
                accessToken: faker.datatype.uuid(),
                other: faker.datatype.uuid()
            },
            mockOauth = { 
                getOAuthAccessToken: jest.fn((_,__,cb) => cb(undefined, undefined,undefined,expected)) 
            }
            
        OAuth2.mockImplementation(() => mockOauth)

        let oauth = new Oauth(info)
        let result = await oauth.getTokens(code)
        
        expect(mockOauth.getOAuthAccessToken).toBeCalledWith(
            code,
            {
                redirect_uri: info.redirectUrl
            },
            expect.anything()
        )
        expect(result).toEqual(expected)
    })

    test('getTokens should reject if error', async () => {
        let error = faker.datatype.uuid(),
        mockOauth = { 
            getOAuthAccessToken: jest.fn((_,__,cb) => cb(error, undefined, undefined)) 
        }
            
        OAuth2.mockImplementation(() => mockOauth)

        let oauth = new Oauth({})
        try {
            await oauth.getTokens("pepe")
            fail()
        } catch (e) {
            expect(e).toEqual(error)
        } 
    })

})
