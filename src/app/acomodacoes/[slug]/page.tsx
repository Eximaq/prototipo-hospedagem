import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function OldRoomDetailPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/casas/${slug}`);
}
