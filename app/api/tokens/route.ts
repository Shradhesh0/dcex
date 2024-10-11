import { NextRequest, NextResponse } from "next/server";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { connection, getSupportedTokens } from "@/app/lib/contants";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address') as string;

    if (!address) {
        return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    try {
        const supportedTokens = await getSupportedTokens();
        const balances = await Promise.all(supportedTokens.map(token => getAccountBalance(token, address)));

        const tokens = supportedTokens.map((token, index) => ({
            ...token,
            balance: balances[index].toFixed(2),
            // Safely handle token price, use 0 if undefined
            usdBalance: (balances[index] * Number(token.price || 0)).toFixed(2),
        }));

        const totalBalance = tokens.reduce((acc, val) => acc + Number(val.usdBalance), 0).toFixed(2);

        return NextResponse.json({
            tokens,
            totalBalance,
        });
    } catch (error) {
        console.error("Error fetching token balances:", error);
        return NextResponse.json({ error: "Failed to fetch token balances" }, { status: 500 });
    }
}

async function getAccountBalance(token: {
    name: string;
    mint: string;
    native: boolean;
    decimals: number;
}, address: string) {
    try {
        if (token.native) {
            // Get SOL balance for native tokens
            const balance = await connection.getBalance(new PublicKey(address));
            console.log("Native balance is", balance);
            return balance / LAMPORTS_PER_SOL;
        }

        // Get balance for non-native tokens
        const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), new PublicKey(address));
        const account = await getAccount(connection, ata);
        return Number(account.amount) / (10 ** token.decimals);
    } catch (error) {
        console.error(`Failed to fetch balance for token: ${token.name}`, error);
        return 0;  // Return 0 balance in case of failure
    }
}
