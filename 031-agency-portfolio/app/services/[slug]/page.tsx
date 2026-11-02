import { notFound } from "next/navigation";
import { services } from "@/components/data";
import { ServiceDetail } from "@/components/portfolio";
import { Anvil, ArrowLeft } from "lucide-react";

export function generateStaticParams() { return services.map(service => ({ slug: service.slug })); }
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = services.findIndex(service => service.slug === slug);
  if (index < 0) notFound();
  return <main className="standalone wrap"><a href="/" className="wordmark"><Anvil/>Forge & Co.</a><a className="text-link back-home" href="/#services"><ArrowLeft size={17}/> Back to the studio</a><h1 className="sr-only">{services[index].title}</h1><ServiceDetail index={index} standalone/></main>;
}
