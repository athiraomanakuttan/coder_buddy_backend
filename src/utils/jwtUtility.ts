import jwt,{JwtPayload} from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const access_secret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY as string
const refresh_secret = process.env.JWT_REFRESH_TOKEN_SECRET_KEY as string
class JwtUtility{
    static generateAccessToken(payload:object):string{
        return jwt.sign(payload,access_secret,{expiresIn:'1h'})
    }
    static generateRefreshToken(payload:object):string{
        return jwt.sign(payload, refresh_secret,{expiresIn:'1d'})
    }
    static verifyToken(token: string, isRefreshToken = false): string | JwtPayload {
        const secret = isRefreshToken ? refresh_secret : access_secret;
        return jwt.verify(token, secret);
    }

}

export default JwtUtility