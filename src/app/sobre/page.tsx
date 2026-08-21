import { StaticRedirect } from "@/components/navigation/static-redirect";
import { createRedirectMetadata } from "@/lib/seo";

export const metadata = createRedirectMetadata("/");

export default function AboutPage() {
  return <StaticRedirect href="/" label="Ir para o início" />;
}
