import { StaticRedirect } from "@/components/navigation/static-redirect";
import { createRedirectMetadata } from "@/lib/seo";

export const metadata = createRedirectMetadata("/casas/");

export default function OldRoomsPage() {
  return <StaticRedirect href="/casas/" label="Conhecer as casas" />;
}
