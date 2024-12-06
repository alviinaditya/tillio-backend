import { sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../../config/env";
import { TokenType } from "../constants/enums";
import { Session } from "../../domain/entities/Session";
import { User } from "../../domain/entities/User";

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

export interface IRefreshTokenPayload {
  sessionId: Session["_id"];
}

export interface IAccessTokenPayload {
  userId: User["_id"];
  role: User["role"];
  sessionId: Session["_id"];
}

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secret: JWT_SECRET,
};

const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

// signToken(accessTokenPayload, TokenType.ACCESS);
export const signToken = (
  payload: IAccessTokenPayload | IRefreshTokenPayload,
  tokenType: TokenType
) => {
  const options =
    tokenType === TokenType.ACCESS
      ? accessTokenSignOptions
      : refreshTokenSignOptions;

  const { secret, ...signOpts } = options;
  return sign(payload, secret, signOpts);
};

// verifyToken<IAccessTokenPayload>(accessToken, TokenType.ACCESS);
export const verifyToken = <TPayload extends object>(
  token: string,
  tokenType: TokenType,
  options?: VerifyOptions
): { payload?: TPayload; error?: string } => {
  const secret =
    tokenType === TokenType.ACCESS ? JWT_SECRET : JWT_REFRESH_SECRET;

  try {
    const payload = verify(token, secret, options) as TPayload;
    return { payload };
  } catch (error: any) {
    return { error: error.message };
  }
};
