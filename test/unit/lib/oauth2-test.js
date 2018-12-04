jest.mock('oauth', () =>({
    OAuth2: jest.fn()
}))
const Oauth = require('../../../lib/oauth2'),
    OAuth2 = require('oauth').OAuth2,
    faker = require('faker')

describe('oauth should', () => {
    test('construct using library', async () => {
        let info = { 
                key: faker.random.uuid(),
                secret: faker.random.uuid(),
                baseSite: faker.random.uuid(),
                authorizePath: faker.random.uuid(),
                accessTokenPath: faker.random.uuid(),
            },
            expectedResult = { some: faker.random.uuid() }
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
                redirectUrl: faker.random.uuid(),
                scope: faker.random.uuid(),
                responseType: faker.random.uuid()
            },
            expectedResult = faker.random.uuid(),
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
                redirectUrl: faker.random.uuid(),
                scope: faker.random.uuid()
            },
            expectedResult = faker.random.uuid(),
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
        let code = faker.random.uuid(),
            info = {
                redirectUrl: faker.random.uuid(),
            },
            accessToken = faker.random.uuid(),
            refreshToken = faker.random.uuid(),
            mockOauth = { 
                getOAuthAccessToken: jest.fn((_,__,cb) => cb(undefined, accessToken,refreshToken)) 
            }
            
        OAuth2.mockImplementation(() => mockOauth)

        let oauth = new Oauth(info)
        let result = oauth.getTokens(code)
        
        expect(mockOauth.getOAuthAccessToken).toBeCalledWith(
            code,
            {
                redirect_uri: info.redirectUrl
            },
            expect.anything()
        )
        expect(result).resolves.toEqual({accessToken, refreshToken})
    })

    test('getTokens should reject if error', async () => {
        let error = faker.random.uuid(),
        mockOauth = { 
            getOAuthAccessToken: jest.fn((_,__,cb) => cb(error, undefined, undefined)) 
        }
            
        OAuth2.mockImplementation(() => mockOauth)

        let oauth = new Oauth({})
        let result = oauth.getTokens("pepe")
        
        expect(result).rejects.toEqual(error)
    })

})
