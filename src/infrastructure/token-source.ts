import { Buffer } from "buffer";
import crypto from "crypto";
import { TokenPayload } from "../models";


export class InvalidTokenFormatError extends Error {}

export class TokenSource {
    public constructor(
        private secret :string
    ){}

    public newToken({userId, roomId} : TokenPayload) : string {
        var userIdBase64 = encodeBase64Url(
            Buffer.from(userId)
        )
        var roomIdBase64 = encodeBase64Url(
            Buffer.from(roomId)
        )

        var payload = userIdBase64 + "." + roomIdBase64; 

        var signature = crypto.createHmac("sha256", this.secret)
            .update(payload)
            .digest("base64url")
        

        return payload + "." + signature;
    }

    public readToken(token: string): TokenPayload {
        const tokenData = token.split(".");
        if (tokenData.length != 3)
            throw new InvalidTokenFormatError();

        return {
            userId: decodeBase64Url(tokenData[0]).toString("ascii"),
            roomId: decodeBase64Url(tokenData[1]).toString("ascii")
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