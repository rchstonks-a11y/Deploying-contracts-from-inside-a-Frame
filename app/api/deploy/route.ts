import { NextRequest } from "next/server";
import { ethers } from "ethers";
import MyToken from "../../../artifacts/contracts/MyToken.sol/MyToken.json";

export const runtime = "nodejs"; // needs node, not edge

export async function POST(req: NextRequest) {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL!);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_KEY!, provider);

  const factory = new ethers.ContractFactory(
    MyToken.abi,
    MyToken.bytecode,
    wallet
  );

  const token = await factory.deploy("FrameToken", "FCAST");
  await token.waitForDeployment();

  const addr = await token.getAddress();
  console.log("Deployed token:", addr);

  const origin = `https://${req.headers.get("host")}`;

  return new Response(
    `<!doctype html><html><head>
      <meta property="og:title" content="Token deployed!" />
      <meta name="fc:frame" content="vNext" />
      <meta property="og:image" content="${origin}/og/ready" />
      <meta name="fc:frame:image" content="${origin}/og/ready" />

      <meta name="fc:frame:button:1" content="View on Etherscan" />
      <meta name="fc:frame:button:1:action" content="link" />
      <meta name="fc:frame:button:1:target" content="https://sepolia.etherscan.io/address/${addr}" />
    </head></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
