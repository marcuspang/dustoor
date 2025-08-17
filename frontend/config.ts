import { createConfig, http } from "wagmi";
import { arbitrumSepolia, baseSepolia, sepolia } from "wagmi/chains";

export const config = createConfig({
	chains: [sepolia, arbitrumSepolia, baseSepolia],
	transports: {
		[sepolia.id]: http(),
		[arbitrumSepolia.id]: http(),
		[baseSepolia.id]: http(),
	},
});
