import { SiteShell } from "@/components/layout/SiteShell";
import { HomePage } from "@/components/content/HomePage";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";

export default function RootHomePage() {
  return (
    <SiteShell locale={siteConfig.defaultLocale}>
      <Container>
        <HomePage locale={siteConfig.defaultLocale} />
      </Container>
    </SiteShell>
  );
}
