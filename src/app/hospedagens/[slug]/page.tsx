import { StaticRedirect } from "@/components/navigation/static-redirect";
import { houses } from "@/data/houses";
import { createRedirectMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return houses.map((house) => ({ slug: house.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return createRedirectMetadata(`/casas/${slug}/`);
}

export default async function OldPropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  return <StaticRedirect href={`/casas/${slug}/`} label="Conhecer a casa" />;
}
