/* eslint-disable react/jsx-key */
import { TokenWithbalance } from "../api/hooks/useTokens";

export function TokenList({ tokens }: { tokens: TokenWithbalance[] }) {
  return (
    <div className="token-list">
      {/*  eslint-disable-next-line react/jsx-key */}
      {tokens.map((t) => (
        <TokenRow token={t} />
      ))}
    </div>
  );
}

function TokenRow({ token }: { token: TokenWithbalance }) {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <img src={token.image} className="w-10 h-10 rounded-full mr-2" />
        <div>
        <div className="font-bold">{token.name}</div>
        <div className="font-slim">
          1 {token.name} = ~${token.price}
        </div>
        </div>
      </div>
      

      <div>
        <div>
          <div className="font-bold flex jutify-end">{token.usdBalance}</div>
          <div className="font-slim flex jutify-end">{token.balance}</div>
        </div>
      </div>
    </div>
  );
}
