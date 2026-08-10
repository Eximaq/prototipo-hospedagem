import { StaticRedirect } from "@/components/navigation/static-redirect";
import { houses } from "@/data/houses";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return houses.map((house) => ({ slug: house.slug }));
}

export default async function OldRoomDetailPage({ params }: Props) {
  const { slug } = await params;
  return <StaticRedirect href={`/casas/${slug}/`} label="Conhecer a casa" />;
}
