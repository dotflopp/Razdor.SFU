import { Buffer } from "buffer";
import crypto from "crypto";
import { TokenPayload } from "../services/models";




export class InvalidTokenFormatError extends Error {}

export class TokenSource {
    public constructor(
        private secret :string
    ){}

    public newToken({sessionId} : TokenPayload) : string {
        var payload = encodeBase64Url(
            Buffer.from(sessionId)
        )

        var signature = crypto.createHmac("sha256", this.secret)
            .update(payload)
            .digest("base64url")
        
        return payload + "." + signature;
    }

    public readToken(token: string): TokenPayload {
        const tokenData = token.split(".");
        if (tokenData.length != 2)
            throw new InvalidTokenFormatError();

        return {
            sessionId: decodeBase64Url(tokenData[0]).toString("ascii"),
        }
    }

    public checkToken(token: string): Boolean {
        const re = /^(.+\..+)\.(.+)$/
        const match = token.match(re)

        if (!match?.groups) 
            return false;

        const payload = match?.groups[1]
        const tokenSignature = match?.groups[2]

        const factorySignature = crypto.createHmac("sha256", this.secret)
            .update(payload)
            .digest("base64url")

        return payload === tokenSignature
    }
}

function encodeBase64Url(buffer: Buffer) : string {
    return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '')
  }
  
function decodeBase64Url(base64url: string) : Buffer {
  const base64 = base64url
    .replace(/-/g, '+')
    .replace(/_/g, '/') + '=='.slice(0, (4 - (base64url.length % 4)) % 4)

  return Buffer.from(base64, 'base64')
}