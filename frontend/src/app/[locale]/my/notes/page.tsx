import { SiteShell } from "@/components/layout/SiteShell";
import { MyNotesPage } from "@/components/content/MyNotesPage";
import { Container } from "@/components/ui/Container";

type MyNotesRouteProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function MyNotesRoute({ params }: MyNotesRouteProps) {
  const { locale } = await params;

  return (
    <SiteShell locale={locale}>
      <Container className="py-12">
        <MyNotesPage locale={locale} />
      </Container>
    </SiteShell>
  );
}
